const _ = require('lodash');
const logger = require('../lib/logger').get('store');
const AIRCRAFT_SCHEMA = require('./schemas');
const {
  secondsToMillis,
  millisToSeconds
} = require('../lib/utils');
const {
  StoreError,
  StaleDataError
} = require('../lib/errors');

// maximum age of new data that will be accepted into the store
const MAX_DATA_AGE = 10000;

module.exports = (client) => ({
  setNewData: setNewData.bind(null, client),
  getAllAircraft: getAllAircraft.bind(null, client),
  getValidAircraft: getValidAircraft.bind(null, client),
  getInvalidAircraft: getInvalidAircraft.bind(null, client)
});

// CREATE

/**
 * Accept new dump1090 aircraft data to merge into the store
 *
 * @param data raw JSON object generated by dump109 with data.now in seconds since epoch
 * @returns {boolean} true if the data was accepted, false if it was rejected
 */
function setNewData (client, data) {
  const clientNowMillis = secondsToMillis(data.now);
  const now = Date.now();
  const age = now - clientNowMillis;
  if (age > MAX_DATA_AGE) {
    logger.info({
      message: 'reject new data',
      clientTimestamp: new Date(clientNowMillis).toISOString(),
      age: millisToSeconds(age).toFixed(2)
    });
    throw new StaleDataError(millisToSeconds(age));
  }
  // logger.info({
  //   message: 'accept dump1090 data',
  //   messages: data.messages,
  //   clientTimestamp: new Date(clientNowMillis).toISOString()
  // });
  // first, update and filter the data
  const newAircraftMap = mapifyAircraftArray(data.aircraft.map(setUpdated));
  return validateAndWrite(client, newAircraftMap);
}

/**
 *
 * @param aircraftArray array of aircraft from dump1090
 * @returns { hex: aircraft } hex mapped to aircraft object
 */
function mapifyAircraftArray (aircraftArray = []) {
  return aircraftArray.reduce((acc, aircraft) => {
    acc[aircraft.hex] = aircraft;
    return acc;
  }, {});
}

/**
 * Filter an aircraft serve1090 data store; validate against AIRCRAFT_SCHEMA
 * and return the validated map
 *
 * @param map serve1090 aircraft map to validate and filter
 * @returns validated and filtered serve1090 aircraft map
 * @private
 */
function validateAndWrite (client, store) {
  client.pipeline();
  Object.entries(store).forEach(([hex, aircraft]) => {
    const { value: validatedBody, error } = AIRCRAFT_SCHEMA.validate(aircraft);
    if (!error) {
      validatedBody.error = false;
      client.hsetJsonEx('store:valid', hex, validatedBody, 10);
    } else {
      aircraft.error = error.message.replace(/"/g, '\'');
      client.hsetJsonEx('store:invalid', hex, aircraft, 60);
    }
    client.hsetJsonEx('store:all', hex, aircraft, 60);
  });
  return client.exec();
}

// RETRIEVE

function getAllAircraft (client) {
  return getStore(client, 'store:all');
}

async function getValidAircraft (client) {
  return getStore(client, 'store:valid');
}

async function getInvalidAircraft (client) {
  return getStore(client, 'store:invalid');
}

async function getStore (client, store) {
  const aircraft = await client.hgetAllJsonValues(store);
  return {
    now: Date.now(),
    count: aircraft.length,
    aircraft
  };
}

// TODO decide if this is really necessary
function setUpdated (aircraft) {
  aircraft.updated = Date.now();
  return aircraft;
}