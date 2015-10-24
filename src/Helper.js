import invert from 'lodash.invert'

export function createDualMapping(map) {
  var invMap = invert(map);
  return {
    valueFor(key) {
      return map[key];
    },
    keyFor(value) {
      return parseInt(invMap[value], 10);
    },
  };
}
