# MineBlown-Logic
Minesweeper game logic implementation easy for use.
Created as part of [MineBlown](http://minesweeper.mineblown.com) project (http://minesweeper.mineblown.com)

## About MineBlown Project
MineBlown is a free to play retro looking cutting edge minesweeper online game.
The project started in order to fix the current abusive attitude toward minesweeper as an old irrelevant game, by providing twists in a way that reaches its full potential.

### Features

- [x] Custom game board.
- [x] Stopwatch.
- [x] Mines left.
- [x] Set flags.

### Install
 `npm install mineblown-logic --save` 

### Require
 `var mineblown = require("mineblown-logic");` 

## Usage

### Board Game Initialization
`var { Board, Game, RandomBoardLocationsProvider } = require("mineblown-logic");` 

` var minesIndices = RandomBoardLocationsProvider.getRandomIndexesByBoardSize(10, 10, 10);` 
` var board = new Board(10, 10, minesIndices);` 

` var g = new Game(board); `

## Contribution

Issue, idea, PR are welcomed.

 ## License

MIT
