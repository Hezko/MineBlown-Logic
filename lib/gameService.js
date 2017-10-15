const Board = require("./board");
const Game = require("./game");
const RandomBoardLocationsProvider = require("./randomBoardLocationsProvider");

class gameService {

    constructor(host) {
        this.games = {};
    }

    getGame(gameId) {
        const game = this.games[gameId];
        if (game === undefined) {
            return "game " + gameId + " does not exist";
        }
        else {
            return Promise.resolve(game.getView());
        }
    }

    createGame(height, width, mines) {
        const minesIndices = RandomBoardLocationsProvider.getRandomIndexesByBoardSize(height, width, mines);
        const board = new Board(height, width, minesIndices);

        const game = new Game(board);
        const id = this.generateId();
        this.games[id] = game;
        return Promise.resolve(id);
    }

    discoverAndGetAllMines(gameId) {
        const game = this.games[gameId];
        if (typeof game === "undefined") {
            throw "game with the specified id:" + gameId + " is not available";
        }
        else if (game.state.isFinished === false) {
            throw "getAllBomb call is valid only when the game is finished";
        }

        const result = { mines: game.discoverAndGetAllMines() };

        return Promise.resolve(result);
    }

    discover(gameId, y, x) {
        const game = this.games[gameId];
        if (typeof game === "undefined") {
            throw "game with the specified id:" + gameId + " is not available";
        }
        const result = game.discover(y, x);

        return Promise.resolve(result);
    }

    multiDiscover(gameId, y, x) {
        const game = this.games[gameId];
        if (typeof game === "undefined") {
            throw "game with the specified id:" + gameId + " is not available";
        }
        const result = game.multiDiscover(y, x);

        return Promise.resolve(result);
    }

    toggleFlag(gameId, y, x) {
        const game = this.games[gameId];
        if (typeof game === "undefined") {
            throw "game with the specified id:" + gameId + " is not available";
        }
        const result = game.toggleFlag(y, x);

        return Promise.resolve(result);
    }

    generateId() {
        return Math.random().toString(36).substr(2, 16);
    }

    handleError(logMessage, error) {
        console.log(logMessage);
        console.log(error);
        throw error;
    }
}

module.exports = gameService;

