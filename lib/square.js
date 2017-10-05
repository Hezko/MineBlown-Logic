"use-strict";

var serialNumber = 0;

class Square {
    constructor() {
        this.location = { y: -1, x: -1 };
        this.neighbours = [];
        this.exposedData = {
            isFlagged: false,
            isDiscovered: false,
            nearbyFlags: 0
        };
        this.hiddenData = {
            isMine: false,
            nearbyMines: 0
        };
    }
}

module.exports = Square;