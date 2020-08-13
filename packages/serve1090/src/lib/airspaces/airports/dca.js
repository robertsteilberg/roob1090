// this module defines an approach/departure route for runway 01-19 at KDCA
// polygons generated via https://www.keene.edu/campus/maps/tool/
// headings generated via https://www.acscdg.com/
const { point } = require('@turf/helpers');
const distance = require('@turf/distance').default;

const airspaceName = 'Washington Reagan National Airport';
const airspaceKey = 'kdca';

/**
 * Runway 01/19
 *
 * Coordinates: (lon/lat)
 -77.0391322, 38.8617231
 -77.0390886, 38.8612313
 -77.0403761, 38.8609828
 -77.0409071, 38.8596231
 -77.0389062, 38.8585955
 -77.0373023, 38.8429374
 -77.0386863, 38.8433343
 -77.0385736, 38.8417424
 -77.0377100, 38.8414374
 -77.0370991, 38.8414719
 -77.0370461, 38.8410071
 -77.0363440, 38.8410462
 -77.0384254, 38.8617691
 -77.0391322, 38.8617231
 */
const runway01_19 = {
  key: `${airspaceKey}:runway:01-19`,
  name: 'Runway 01-19',
  maxAltitude: 500,
  coordinates: [[
    [
      -77.0391322,
      38.8617231
    ],
    [
      -77.0390886,
      38.8612313
    ],
    [
      -77.0403761,
      38.8609828
    ],
    [
      -77.0409071,
      38.8596231
    ],
    [
      -77.0389062,
      38.8585955
    ],
    [
      -77.0373023,
      38.8429374
    ],
    [
      -77.0386863,
      38.8433343
    ],
    [
      -77.0385736,
      38.8417424
    ],
    [
      -77.03771,
      38.8414374
    ],
    [
      -77.0370991,
      38.8414719
    ],
    [
      -77.0370461,
      38.8410071
    ],
    [
      -77.036344,
      38.8410462
    ],
    [
      -77.0384254,
      38.8617691
    ],
    [
      -77.0391322,
      38.8617231
    ]
  ]]
};

/**
 * North
 *
 * Coordinates: (lon/lat)
 -77.0384254, 38.8617691
 -77.0263481, 38.8709549
 -77.0381927, 38.8884942
 -77.0502090, 38.9023889
 -77.0584488, 38.9086673
 -77.0819664, 38.9153459
 -77.1284866, 38.9712877
 -77.1574974, 38.9587414
 -77.1063423, 38.8969115
 -77.0874596, 38.8892291
 -77.0700359, 38.8726589
 -77.0391315, 38.8617221
 -77.0384254, 38.8617691
 */
const north01_19 = {
  key: `${airspaceKey}:north:01-19`,
  name: '',
  maxAltitude: 5000,
  rank: function (a, b) {
    const extremity = [38.861209, -77.0386846]; // lat/lon
    const aPos = point([a.lon, a.lat]);
    const bPos = point([b.lon, b.lat]);
    const aDistance = distance(aPos, extremity);
    const bDistance = distance(bPos, extremity);
    return bDistance - aDistance; // sorts according to closest to point
  },
  coordinates: [[
    [
      -77.0384254,
      38.8617691
    ],
    [
      -77.0263481,
      38.8709549
    ],
    [
      -77.0381927,
      38.8884942
    ],
    [
      -77.050209,
      38.9023889
    ],
    [
      -77.0584488,
      38.9086673
    ],
    [
      -77.0819664,
      38.9153459
    ],
    [
      -77.1284866,
      38.9712877
    ],
    [
      -77.1574974,
      38.9587414
    ],
    [
      -77.1063423,
      38.8969115
    ],
    [
      -77.0874596,
      38.8892291
    ],
    [
      -77.0700359,
      38.8726589
    ],
    [
      -77.0391315,
      38.8617221
    ],
    [
      -77.0384254,
      38.8617691
    ]
  ]]
};

/**
 * South
 *
 * Coordinates: (lon/lat)
 -77.0370474, 38.8410034
 -77.0461750, 38.8397745
 -77.0577621, 38.7895496
 -77.0538139, 38.7021234
 -77.0011139, 38.7039989
 -77.0139885, 38.7918242
 -77.0251894, 38.8410781
 -77.0363420, 38.8410421
 -77.0370474, 38.8410034
 */
const south01_19 = {
  key: `${airspaceKey}:south:01-19`,
  name: '',
  maxAltitude: 5000,
  rank: function (a, b) {
    const extremity = [38.8416032, -77.0366997]; // lat/lon
    const aPos = point([a.lon, a.lat]);
    const bPos = point([b.lon, b.lat]);
    const aDistance = distance(aPos, extremity);
    const bDistance = distance(bPos, extremity);
    return bDistance - aDistance; // sorts according to closest to point
  },
  coordinates: [[
    [
      -77.0370474,
      38.8410034
    ],
    [
      -77.046175,
      38.8397745
    ],
    [
      -77.0577621,
      38.7895496
    ],
    [
      -77.0538139,
      38.7021234
    ],
    [
      -77.0011139,
      38.7039989
    ],
    [
      -77.0139885,
      38.7918242
    ],
    [
      -77.0251894,
      38.8410781
    ],
    [
      -77.036342,
      38.8410421
    ],
    [
      -77.0370474,
      38.8410034
    ]
  ]]
};

const route01_19 = {
  key: `${airspaceKey}:route01_19`,
  parent: airspaceKey,
  runway: runway01_19,
  head: north01_19,
  tail: south01_19,
  computeActiveRunway: function (sample) {
    if (!sample) return false;
    return isNorthward(sample.track) ? '1' : '19';
  },
  getApproachRouteKey (runway) {
    return runway === '1' ? south01_19.key : north01_19.key;
  },
  getDepartureRouteKey (runway) {
    return runway === '1' ? north01_19.key : south01_19.key;
  }
};

function getRoutes () {
  return [route01_19];
}

function isNorthward (track) {
  const isNE = (track > 275 && track <= 360);
  const isNW = (track >= 0 && track < 90);
  return (isNE || isNW);
}

module.exports = {
  key: airspaceKey,
  name: airspaceName,
  getRoutes
};