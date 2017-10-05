const game = require("./game");
const board = require("./board");
const square = require("./square");
const boardMineSetter = require("./boardMineSetter");
const randomBoardLocationsProvider = require("./randomBoardLocationsProvider");

module.exports = {
    "game": game,
    "board": board,
    "square": square,
    "boardMineSetter": boardMineSetter,
    "randomBoardLocationsProvider": randomBoardLocationsProvider
};
