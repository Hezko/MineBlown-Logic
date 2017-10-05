"use-strict";

const debug = require("debug")("MineBlown-game");
const interval = 1000;

class Game {
    constructor(board) {
        this.seconds = 0;
        this.state = {};
        this.state.flagsNumber = 0;
        this.state.startTime = undefined;
        this.state.endTime = undefined;

        this.state.isStarted = false;
        this.state.isFinished = false;
        this.state.isWin = false;
        this.state.isLose = false;

        this.board = board;

        //the timer will start only when first discover is done
        // setTimeout(this.updateTime.bind(this), interval);
    }
    getView() {
        let result = {
            board: this.board.getView(),
            settings: this.board.getSettings(),
            stats: this.getStats()
        };
        return result;
    }

    getStats() {
        let time = undefined;
        if (this.state.isStarted) {
            if (this.state.isFinished) {
                time = (this.state.endTime - this.state.startTime) / 1000;
            }
            else {
                time = (Date.now() - this.state.startTime) / 1000;
            }
        }
        return {
            flagsCount: this.state.flagsNumber,
            seconds: time,
            isFinished: this.state.isFinished,
            isStarted: this.state.isStarted,
            isWin: this.state.isWin,
            isLose: this.state.isLose
        };
    }

    discoverAndGetAllMines() {
        let result = this.board.discoverAndGetAllMines();

        return result;
    }

    discover(y, x) {
        if (this.state.isFinished === true) {
            throw "game is already finished";
        }
        var discoverResult = this.board.discover(y, x);
        if (this.state.isStarted === false) {
            this.state.isStarted = true;
            this.state.startTime = Date.now();
        }

        if (discoverResult.clickedSquare.isMine) {
            this.state.endTime = Date.now();
            this.state.isFinished = true;
            this.state.isLose = true;
            this.board.revealAllMines();
            debug("game finished with lose. bomb location: y=" + y + ",x=" + x);
        }
        else if (this.board.totalSquares === this.board.discoveredSquares + this.board.minesCount) {
            this.state.endTime = Date.now();
            this.state.isFinished = true;
            this.state.isWin = true;
            debug("game finished with win. last discovered square is: y=" + y + ",x=" + x);
        }

        var result = {
            newlyDiscovered: discoverResult.newlyDiscovered,
            clickedSquare: discoverResult.clickedSquare,
            isFinished: this.state.isFinished,
            isLose: this.state.isLose,
            isWin: this.state.isWin,
        };

        return result;
    }

    multiDiscover(y, x) {
        if (this.state.isFinished === true) {
            throw "game is already finished";
        }
        var multiDiscoverResult = this.board.multiDiscover(y, x);

        if (multiDiscoverResult.newlyDiscoveredNeighbours.some((square) => square.isMine)) {
            this.state.isFinished = true;
            this.state.isLose = true;
            debug("game finished with lose. bomb location: y=" + y + ",x=" + x);
        }
        else if (this.board.totalSquares === this.board.discoveredSquares + this.board.minesCount) {
            this.state.isFinished = true;
            this.state.isWin = true;
            debug("game finished with win. last discovered square is: y=" + y + ",x=" + x);
        }

        var result = {
            newlyDiscovered: multiDiscoverResult.newlyDiscovered,
            newlyDiscoveredNeighbours: multiDiscoverResult.newlyDiscoveredNeighbours,
            clickedSquare: multiDiscoverResult.clickedSquare,
            isFinished: this.state.isFinished,
            isLose: this.state.isLose,
            isWin: this.state.isWin,
        };
        return result;
    }

    toggleFlag(y, x) {
        if (this.state.isFinished === true) {
            throw "game is already finished";
        }
        var result = this.board.toggleFlag(y, x);
        if (result.clickedSquare.isFlagged) {
            this.state.flagsNumber = this.state.flagsNumber + 1;
        }
        else {
            this.state.flagsNumber = this.state.flagsNumber - 1;
        }
        return result;
    }

    print() {
        let s = "";
        for (let i = 0; i < this.board.height; i++) {
            s += "<br/>|";
            for (var j = 0; j < this.board.width; j++) {
                var temp = this.board.getSquare(i, j);
                if (temp.exposedData.isDiscovered) {
                    s += temp.hiddenData.nearbyMines + "|";
                }
                else {
                    s += "-|";
                }
            }
        }
        return s;
    }

    updateTime() {
        setTimeout(this.updateTime.bind(this), interval);
        this.seconds += interval / 1000;
    }
}

var exports = module.exports = Game;
