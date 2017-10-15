const game = require("./game");
const board = require("./board");
const square = require("./square");
const boardMineSetter = require("./boardMineSetter");
const randomBoardLocationsProvider = require("./randomBoardLocationsProvider");
const gameService = require("./gameService");

module.exports = {
    "Game": game,
    "Board": board,
    "Square": square,
    "BoardMineSetter": boardMineSetter,
    "RandomBoardLocationsProvider": randomBoardLocationsProvider,
    "GameService": gameService
};
