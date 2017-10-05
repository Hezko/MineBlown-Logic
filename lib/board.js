"use-strict";

var Square = require("./square.js");

var debug = require("debug")("MineBlown-board");

class Board {
	constructor(height, width, minesIndices) {
		this.height = height;
		this.width = width;
		this.minesIndices = minesIndices;
		this.minesCount = minesIndices.length;
		this.flagsIndices = [];
		this.flagsCount = 0;

		this.totalSquares = width * height;
		this.discoveredSquares = 0;

		this.revealAll = false;

		this._board = this.getInitialBoard(this.height, this.width, this.minesIndices);
		this.minesSquares = this.minesIndices.map(indices => this._board[indices.y][indices.x]);
	}

	discoverAndGetAllMines() {
		let mines = this.minesSquares;
		let minesViews = [];
		for (let i = 0; i < mines.length; i++) {
			let mineView = this.getSquareView(mines[i]);
			mineView.isMine = true;
			minesViews[i] = mineView;
		}
		let result = minesViews;

		return result;
	}

	revealAllMines() {
		this.revealAll = true;
	}

	getSquare(y, x) {
		this.validateIndices(y, x);

		return this._board[y][x];
	}

	print() {
		for (let i = 0; i < this.height; i++) {
			let s = "|";
			for (let j = 0; j < this.width; j++) {
				let temp = this._board[i][j];
				if (temp.hiddenData.isMine) {
					s += "x|";
				}
				else {
					s += temp.hiddenData.nearbyMines + "|";
				}
			}
			debug(s);
		}
	}

	getSettings() {
		return {
			height: this.height,
			width: this.width,
			minesCount: this.minesCount
		};
	}

	getView() {
		let result = [];
		for (let i = 0; i < this.height; i++) {
			result[i] = [];
			for (let j = 0; j < this.width; j++) {
				let s = this._board[i][j];
				let view = this.getSquareView(s);
				result[i][j] = view;
			}
		}
		return result;
	}

	toggleFlag(y, x) {
		this.validateIndices(y, x);

		let square = this.getSquare(y, x);
		if (square.exposedData.isDiscovered === true) {
			throw "square is already discovered";
		}
		debug("flagging  y=" + y + ", x=" + x);

		if (square.exposedData.isFlagged === false) {
			square.exposedData.isFlagged = true;
			this.flagsIndices.push({ x: square.location.x, y: square.location.y });
			this.flagsCount = this.flagsCount + 1;
			this.incrementNeighboursNearbyFlags(y, x);
		}
		else {
			square.exposedData.isFlagged = false;
			this.flagsIndices = this.flagsIndices.filter(indices => indices.x === square.location.x && indices.y === square.location.y);
			this.flagsCount = this.flagsCount - 1;
			this.decreaseNeighboursNearbyFlags(y, x);
		}

		const result = {
			clickedSquare: this.getSquareView(square),
			neighbours: square.neighbours.map((square) => this.getSquareView(square))
		};

		return result;
	}

	decreaseNeighboursNearbyFlags(y, x) {
		this.updateNeighboursNearbyFlags(y, x, -1);
	}

	incrementNeighboursNearbyFlags(y, x) {
		this.updateNeighboursNearbyFlags(y, x, 1);
	}

	updateNeighboursNearbyFlags(y, x, diff) {
		const square = this.getSquare(y, x);

		for (let neighbour of square.neighbours) {
			neighbour.exposedData.nearbyFlags += diff;
		}
	}

	discover(y, x) {
		this.validateIndices(y, x);
		let square = this.getSquare(y, x);
		if (square.exposedData.isFlagged === true) {
			throw "square is already flagged";
		}

		debug("discovering for y=" + y + ", x=" + x + ", totalSquares=" + this.totalSquares + ", discoveredSquares=" + this.isDiscovered);
		let newlyDiscovered = [];
		square = this.recursiveDiscover(square, newlyDiscovered);
		debug("discovered for y=" + y + ", x=" + x + ", totalSquares=" + this.totalSquares + ", discoveredSquares=" + this.isDiscovered);

		let newlyDiscoveredView = newlyDiscovered.map((square) => this.getSquareView(square));
		let clickedSquare = this.getSquareView(square);

		let result = {
			newlyDiscovered: newlyDiscoveredView,
			clickedSquare: clickedSquare,
		};

		return result;
	}

	multiDiscover(y, x) {
		this.validateIndices(y, x);
		let square = this.getSquare(y, x);
		if (square.exposedData.isFlagged === true) {
			throw "square is already flagged";
		}
		else if (square.exposedData.isDiscovered === false) {
			throw "square is not discovered yet";
		}
		const neighboursToDiscoverResult = this.getNeighboursToDiscover(y, x);
		if (square.hiddenData.nearbyMines !== neighboursToDiscoverResult.flagsCount || neighboursToDiscoverResult.neighboursToDiscover.length === 0) {
			throw "square is not satisfied";
		}
		let newlyDiscovered = [];
		for (let i = 0; i < neighboursToDiscoverResult.neighboursToDiscover.length; i++) {
			const currSquare = neighboursToDiscoverResult.neighboursToDiscover[i];
			const discoverResult = this.discover(currSquare.location.y, currSquare.location.x);
			newlyDiscovered = newlyDiscovered.concat(discoverResult.newlyDiscovered);
		}

		const newlyDiscoveredNeighboursView = neighboursToDiscoverResult.neighboursToDiscover.map((square) => this.getSquareView(square));
		const clickedSquareView = this.getSquareView(square);

		const result = {
			newlyDiscovered: newlyDiscovered,
			newlyDiscoveredNeighbours: newlyDiscoveredNeighboursView,
			clickedSquare: clickedSquareView
		};

		return result;
	}

	getNeighboursToDiscover(y, x) {
		const neighbours = this.getSquare(y, x).neighbours;
		const neighboursToDiscover = [];

		let flagsCount = 0;
		let discoveredCount = 0;

		for (let i = 0; i < neighbours.length; i++) {
			let neighbour = neighbours[i];
			if (neighbour.exposedData.isDiscovered) {
				discoveredCount += 1;
			}
			else if (neighbour.exposedData.isFlagged) {
				flagsCount += 1;
			}
			else {
				neighboursToDiscover.push(neighbour);
			}
		}

		return { flagsCount, discoveredCount, neighboursToDiscover };
	}

	recursiveDiscover(square, discoveredSoFar) {
		if (square.exposedData.isDiscovered === false && square.exposedData.isFlagged === false) {
			square.exposedData.isDiscovered = true;
			discoveredSoFar.push(square);
			this.discoveredSquares += 1;

			if ((square.hiddenData.nearbyMines === 0 && square.hiddenData.isMine === false)) {

				for (let i = 0; i < square.neighbours.length; i++) {
					this.recursiveDiscover(square.neighbours[i], discoveredSoFar);//calling recursive discover for all neighbors in case there are no mines nearby
				}

			}
		}
		return square;
	}

	validateIndices(y, x) {
		if (!this.isValidIndices(y, x)) {
			throw "indexes does not exists on board. y=" + y + ",x=" + x;
		}
	}

	isValidIndices(y, x) {
		let b = this._board;
		if (y >= this.height || x >= this.width || y < 0 || x < 0) {
			return false;
		}
		return true;
	}

	getNeighbors(y, x, board) {

		let b = board;
		let neighbours = [];
		this.optAddNeighbor(neighbours, y, x + 1, board);
		this.optAddNeighbor(neighbours, y, x - 1, board);

		this.optAddNeighbor(neighbours, y + 1, x + 1, board);
		this.optAddNeighbor(neighbours, y + 1, x, board);
		this.optAddNeighbor(neighbours, y + 1, x - 1, board);

		this.optAddNeighbor(neighbours, y - 1, x + 1, board);
		this.optAddNeighbor(neighbours, y - 1, x, board);
		this.optAddNeighbor(neighbours, y - 1, x - 1, board);

		return neighbours;

	}

	optAddNeighbor(neighbours, y, x, board) {
		if (this.isValidIndices(y, x)) {
			neighbours.push(board[y][x]);
		}
	}

	calculateNearbyMines(y, x, neighbours) {
		var nearbyMines = neighbours.filter(square => {
			return square.hiddenData.isMine === true;
		}).length;

		return nearbyMines;
	}

	getEmptyBoard(height, width) {
		let b = [];
		for (let i = 0; i < height; i++) {
			b[i] = [];
		}

		return b;
	}

	setMines(height, width, minesIndices, board) {
		let b = board;
		//set the mines according to minesIndices
		for (var i = 0; i < minesIndices.length; i++) {
			let MineLocation = minesIndices[i];
			let mineSquare = new Square();
			mineSquare.location.x = MineLocation.x;
			mineSquare.location.y = MineLocation.y;
			mineSquare.hiddenData.isMine = true;
			mineSquare.hiddenData.nearbyMines = -1;
			b[MineLocation.y][MineLocation.x] = mineSquare;
		}

		return b;
	}

	initBlankSquares(height, width, board) {
		let b = board;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				//mines are already defined and therefore the condition will be false for them.
				if (typeof b[i][j] === "undefined") {
					let s = new Square();
					s.location.y = i;
					s.location.x = j;
					b[i][j] = s;
				}
			}
		}

		return b;
	}

	initSquaresNeightbours(height, width, board) {
		let b = board;

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				let s = b[i][j];
				s.neighbours = this.getNeighbors(i, j, board);
				if (s.hiddenData.isMine === false) {
					s.hiddenData.nearbyMines = this.calculateNearbyMines(i, j, s.neighbours);
				}
				b[i][j] = s;
			}
		}

		return b;
	}

	getInitialBoard(height, width, minesIndices) {
		let board = this.getEmptyBoard(height, width);

		board = this.setMines(height, width, minesIndices, board);

		board = this.initBlankSquares(height, width, board);

		board = this.initSquaresNeightbours(height, width, board);

		return board;
	}

	getSquareView(square) {
		const view = {
			isFlagged: square.exposedData.isFlagged,
			isDiscovered: square.exposedData.isDiscovered,
			nearbyFlags: square.exposedData.nearbyFlags,
			y: square.location.y,
			x: square.location.x,
		};
		if (square.exposedData.isDiscovered === true || this.revealAll === true) {
			view.isMine = square.hiddenData.isMine;
			view.nearbyMines = square.hiddenData.nearbyMines;
		}
		return view;
	}
}

var exports = module.exports = Board;

