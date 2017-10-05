"use-strict";
//deprecated 


var log4js = require("log4js");
var log = log4js.getLogger("boardMineSetter");
var Square = require("./square.js");

function trySetMine(board) {
	var i = Math.floor(Math.random() * board.width);
	var j = Math.floor(Math.random() * board.height);
	log.debug("random results:i=%s, j=%s", i, j);

	var t = board.getSquare(i, j);
	if (!t.hiddenData.isMine) {
		// t = new Square(true, false, -1);
		t.hiddenData.isMine = true;
		log.debug("mine was set in board[%s][%s]. square:%s", i, j, t.toString());

		log.debug("updating neighbors for mine at i=%s, j=%s", i, j);
		updateNeighbors(board, i, j);
		log.debug("updated neighbors for mine at i=%s, j=%s", i, j);
		return true;
	}
	log.debug("mine already exists and wasn't set in board[%s][%s]", i, j);
	return false;
}

function updateNeighbors(board, i, j) {
	updateNearbyMines(board, i, j + 1);
	updateNearbyMines(board, i, j - 1);

	updateNearbyMines(board, i + 1, j + 1);
	updateNearbyMines(board, i + 1, j);
	updateNearbyMines(board, i + 1, j - 1);

	updateNearbyMines(board, i - 1, j + 1);
	updateNearbyMines(board, i - 1, j);
	updateNearbyMines(board, i - 1, j - 1);
}

function updateNearbyMines(board, i, j) {
	if (board.isValidIndices(i, j)) {
		var til = board.getSquare(i, j);
		if (!til.hiddenData.isMine) {
			til.hiddenData.nearbyMines +=1;
			return true;
		}
	}
	return false;
}
var exports = module.exports = {};

exports.setMines = function setMines(board, mines) {
	var totalSquares = board.width * board.height;
	if (mines > totalSquares) {
		log.error("too many mines for boardBombSetter.js");
		throw "too many mines for boardBombSetter.js";
	}
	var minesSetSoFar = 0;
	while (minesSetSoFar < mines) {
		var isSucceed = trySetMine(board);
		if (isSucceed) {
			minesSetSoFar += 1;
		}
	}
	board.minesCount = minesSetSoFar;
	log.info("requested mines are:" + mines + ". mines set are:" + minesSetSoFar);
};