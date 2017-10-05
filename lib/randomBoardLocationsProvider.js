"use-strict";

var log4js = require("log4js");
var log = log4js.getLogger("randomBoardLocationsProvider");

function getRandomIndexesByBoardSize(height, width, amount) {

    var indexesSetSoFar = 0;
    var minesHashset = {}; //bombs is being used as a hashset
    var mines = [];

    while (indexesSetSoFar < amount) {
        var y = Math.floor(Math.random() * height);
        var x = Math.floor(Math.random() * width);
        if ((getIndexesKey(y, x) in minesHashset) === false) {
            minesHashset[getIndexesKey(y, x)] = true;
            mines.push({ y: y, x: x });
            indexesSetSoFar += 1;
        }
    }
    return mines;
}

function getIndexesKey(y, x) {
    return y + "-" + x;
}

var exports = module.exports = {};

exports.getRandomIndexesByBoardSize = getRandomIndexesByBoardSize;