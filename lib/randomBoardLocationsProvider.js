"use-strict";

function getRandomIndexesByBoardSize(height, width, amount) {

    let indexesSetSoFar = 0;
    const minesHashset = {}; //bombs is being used as a hashset
    const mines = [];

    while (indexesSetSoFar < amount) {
        const y = Math.floor(Math.random() * height);
        const x = Math.floor(Math.random() * width);
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