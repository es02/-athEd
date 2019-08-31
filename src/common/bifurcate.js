var bifurcate = require('./bif.js').bifurcate;
var unbifurcate = require('./bif.js').unbifurcate;

function bif(valueA, valueB = false) {
    if (valueB) {
        return unbifurcate(valueA, valueB);
    } else {
        return bifurcate(valueA);
    }
}

module.exports = {
  bifurcate: bif,
}
