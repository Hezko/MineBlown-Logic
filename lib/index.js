const game = require("./game");
const board = require("./board");
const square = require("./square");
const boardMineSetter = require("./boardMineSetter");
const randomBoardLocationsProvider = require("./randomBoardLocationsProvider");

module.exports = {
    "Game": game,
    "Board": board,
    "Square": square,
    "BoardMineSetter": boardMineSetter,
    "RandomBoardLocationsProvider": randomBoardLocationsProvider
};
