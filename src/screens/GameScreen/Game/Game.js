import { GameStore } from 'chessvibe/src/redux/Store';
import * as Const    from 'chessvibe/src/Const';
import Util          from 'chessvibe/src/Util';
import Backend       from 'chessvibe/src/GameBackend';
import PieceFactory  from './Pieces/piecefactory';
import Grid          from './Pieces/grid';

import ChessMover    from './Workers/ChessMover';
import ChessUnmover  from './Workers/ChessUnmover';
import ChessReviewer from './Workers/ChessReviewer';
import TouchHandler  from './Workers/TouchHandler';
import DataUpdater   from './Workers/DataUpdater';

export default class Game {

	constructor(team, match_id, match, isMountedRef) {
		// White's side of chessboard
		this.chessboard = [[],[],[],[],[],[],[],[]];
		this.baseboard = [[],[],[],[],[],[],[],[]];
		this.moves = [];
		this.moves_applied = 0;

		this.king_grid = {};
		this.white_king_moved = false;
		this.black_king_moved = false;

		this.passant_pawn = null;
		this.moves_stack = [];
		this.passant_stack = [];
		this.id = 0;
		this.pieces = {};
		this.turn = Const.TEAM.W;
		this.team = team;
		this.enemy = team == Const.TEAM.W ? Const.TEAM.B : Const.TEAM.W;
		this.downward = false;

		this.oldGrid = null;
		this.newGrid = null;

		this.black_timer = match.white_timer;
		this.white_timer = match.black_timer;

		this.match_id = match_id;
		this.match = match;
		this.ended = false;

		// Review variables
		this.stopPlayBack = false;
		this.playTimeout = null;

		// React native related
		this.isMountedRef = isMountedRef;
		this.firstLoad = true;
		this.started = match.white && match.black;

		this.stats = {
			B: Const.STATS_MAX,
			W: Const.STATS_MAX
		};

		this.eaten = {
			B: [],
			W: []
		};

		this.initBoard();
		this.initPieces();

		this.ChessMover = new ChessMover(this);
		this.ChessUnmover = new ChessUnmover(this);
		this.ChessReviewer = new ChessReviewer(this);
		this.TouchHandler = new TouchHandler(this);
		this.DataUpdater = new DataUpdater(this);
	}

	//Intialize chessboard background
	initBoard(){
		for (let x = 0; x < Const.BOARD_SIZE; x++) {
			for (let y = 0; y < Const.BOARD_SIZE; y++) {
				//Grid instance
				this.chessboard[x][y] = new Grid(x, y, -1, null);
			}
		}
	}

	//Intialize all chess pieces
	initPieces() {
		let black_pos = 0;
		let black_pawn_pos = 1;
		let white_pos = 7;
		let white_pawn_pos = 6;

		let downward = this.team == Const.TEAM.W ? this.downward : !this.downward;
		let king_x = downward ? 3 : 4;
		let queen_x = downward ? 4 : 3;

		if (downward) {
			black_pos = 7;
			black_pawn_pos = 6;
			white_pos = 0;
			white_pawn_pos = 1;
		}

		this.initEachPiece(this.id++, 0, black_pos, Const.TEAM.B, Const.CHESS.Rook);
		this.initEachPiece(this.id++, 7, black_pos, Const.TEAM.B, Const.CHESS.Rook);
		this.initEachPiece(this.id++, 1, black_pos, Const.TEAM.B, Const.CHESS.Knight);
		this.initEachPiece(this.id++, 6, black_pos, Const.TEAM.B, Const.CHESS.Knight);
		this.initEachPiece(this.id++, 2, black_pos, Const.TEAM.B, Const.CHESS.Bishop);
		this.initEachPiece(this.id++, 5, black_pos, Const.TEAM.B, Const.CHESS.Bishop);

		this.initEachPiece(this.id++, queen_x, black_pos, Const.TEAM.B, Const.CHESS.Queen);
		this.initEachPiece(this.id++, king_x, black_pos, Const.TEAM.B, Const.CHESS.King);

		this.initEachPiece(this.id++, 0, white_pos, Const.TEAM.W, Const.CHESS.Rook);
		this.initEachPiece(this.id++, 7, white_pos, Const.TEAM.W, Const.CHESS.Rook);
		this.initEachPiece(this.id++, 1, white_pos, Const.TEAM.W, Const.CHESS.Knight);
		this.initEachPiece(this.id++, 6, white_pos, Const.TEAM.W, Const.CHESS.Knight);
		this.initEachPiece(this.id++, 2, white_pos, Const.TEAM.W, Const.CHESS.Bishop);
		this.initEachPiece(this.id++, 5, white_pos, Const.TEAM.W, Const.CHESS.Bishop);

		this.initEachPiece(this.id++, queen_x, white_pos, Const.TEAM.W, Const.CHESS.Queen);
		this.initEachPiece(this.id++, king_x, white_pos, Const.TEAM.W, Const.CHESS.King);

		for (var x = 0; x < Const.BOARD_SIZE; x++) {
			this.initEachPiece(this.id++, x, black_pawn_pos, Const.TEAM.B, Const.CHESS.Pawn);
			this.initEachPiece(this.id++, x, white_pawn_pos, Const.TEAM.W, Const.CHESS.Pawn);
		}
	}

	//Intialize each chess piece
	initEachPiece(id, x, y, team, type) {
		this.chessboard[x][y].piece = id;
		this.pieces[id] = PieceFactory.createPiece(team, type, Const.IMAGE[team + type]);

		if (type == Const.CHESS.King)
			this.king_grid[team] = this.chessboard[x][y];
	}






	// Check if old grid => new grid is valid
	isValidMove(oldGrid, newGrid) {
		if (!this.get_piece(oldGrid))
			return;

		let team = this.get_piece(oldGrid).team;
		this.updateMoves(oldGrid);
		let isLegal = this.isLegalMove(newGrid);
		isLegal = isLegal && this.isKingSafe(team, oldGrid, newGrid);

		if (this.canCastle(oldGrid, newGrid))
			return true;

		if (isLegal)
			return true;

		return false;
	}

	// Get all valid friends and enemies that can eat keyGrid
	getReachablePieces(board, keyGrid, team) {
		let friends = [];
		let enemies = [];

		let keyPiece = keyGrid.piece;
		keyGrid.piece = 100;
		this.pieces[100] = PieceFactory.createPiece(team, Const.CHESS.None, null);

		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				let grid = board[i][j];
				if (this.get_piece(grid) != null) {
					let downward = this.get_piece(grid).team == this.team ? this.downward : !this.downward;
					let validMoves = this.get_piece(grid).getPossibleMoves(this, board, grid, downward);
					let found = false;

					for (let k = 0; k < validMoves.length && !found; k++)
						if (validMoves[k].x == keyGrid.x && validMoves[k].y == keyGrid.y)
							found = true;

					if (found) {
						if (this.get_piece(grid).team == team)
							friends.push(grid);
						else
							enemies.push(grid);
					}

				}
			}
		}

		keyGrid.piece = keyPiece;
		return {friends: friends, enemies: enemies};
	}

	isCheckmate(team) {
		for (let i = 0; i < this.chessboard.length; i++) {
			for (let j = 0; j < this.chessboard.length; j++) {
				let grid = this.chessboard[i][j];
				if (this.get_piece(grid) != null && this.get_piece(grid).team == team) {
					let validMoves = this.get_piece(grid).getPossibleMoves(this, this.chessboard, grid);

					for (let k = 0; k < validMoves.length; k++) {
						if (this.isKingSafe(team, grid, this.chessboard[validMoves[k].x][validMoves[k].y])) {
							return Const.STATUS_NONE;
						}
					}
				}
			}
		}

		if (this.isKingSafe(team)) {
			return Const.STATUS_STALEMATE;
		}
		return Const.STATUS_CHECKMATE;
	}

	// Update and show all possible moves based on a specific grid
	updateMoves(grid) {
		// let downward = this.get_piece(grid).team == Const.TEAM.B;
		this.moves = this.get_piece(grid).getPossibleMoves(this, this.chessboard, grid, this.downward);

		if ((!this.white_king_moved && grid == this.king_grid[Const.TEAM.W]) ||
			(!this.black_king_moved && grid == this.king_grid[Const.TEAM.B])) {

			//Show left castle move for king
			if (this.canCastle(grid, this.chessboard[grid.x - 2][grid.y]))
				this.moves.push(this.chessboard[grid.x - 2][grid.y]);

			//Show right castle move for king
			if (this.canCastle(grid, this.chessboard[grid.x + 2][grid.y]))
				this.moves.push(this.chessboard[grid.x + 2][grid.y]);
		}

		//Show en passant move for pawn
		if (this.passant_pawn) {
			if (this.get_piece(grid).team != this.get_piece(this.passant_pawn).team) {
				if (Math.abs(grid.x - this.passant_pawn.x) == 1 && grid.y == this.passant_pawn.y) {
					if (downward)
						this.moves.push(this.chessboard[this.passant_pawn.x][this.passant_pawn.y + 1]);
					else
						this.moves.push(this.chessboard[this.passant_pawn.x][this.passant_pawn.y - 1]);
				}
			}
		}
		this.setMovesColor(Const.COLOR_HIGHLIGHT, grid);
	}

	// Check if grid is part of legal moves
	isLegalMove(grid) {
		let legalMove = false;
		for (let i = 0; i < this.moves.length && !legalMove; i++)
			if (grid.x == this.moves[i].x && grid.y == this.moves[i].y)
				legalMove = true;
		return legalMove;
	}

	// Check if king is safe
	isKingSafe(team, oldGrid, newGrid) {
		let board = this.copyBoard(this.chessboard);

		let target_grid = this.king_grid[team];

		if (oldGrid && newGrid) {
			board[newGrid.x][newGrid.y].piece = board[oldGrid.x][oldGrid.y].piece;
			board[oldGrid.x][oldGrid.y].piece = -1;

			if (oldGrid == this.king_grid[team])
				target_grid = newGrid;
		}

		let validPieces = this.getReachablePieces(board, target_grid, team);
		let enemies = validPieces.enemies;

		return enemies.length == 0;
	}

	// Check if can castle
	canCastle(oldGrid, newGrid) {
		if (!this.get_piece(oldGrid)) return;
		let team = this.get_piece(oldGrid).team;

		// Check piece type
		if (this.get_piece(oldGrid) == null) return false;
		if (this.get_piece(oldGrid).type != Const.CHESS.King) return false;

		// Check piece location
		if (newGrid.y != 0 && newGrid.y != Const.BOARD_SIZE - 1) return false;
		if (Math.abs(newGrid.x - oldGrid.x) != 2) return false;

		// Check if king moved
		if (team == Const.TEAM.W && this.white_king_moved) return false;
		if (team == Const.TEAM.B && this.black_king_moved) return false;

		// Check if king is targeted/safe
		if (!this.isKingSafe(team)) return false;


		// Validate left/right castle
		let leftSide = newGrid.x - oldGrid.x < 0;
		if (leftSide) {
			for (let x = 1; x < oldGrid.x; x++)
				if (this.get_piece(this.chessboard[x][this.king_grid[team].y]))
					return false;
			return this.isKingSafe(team, this.king_grid[team], this.chessboard[this.king_grid[team].x - 1][this.king_grid[team].y])
				&& this.isKingSafe(team, this.king_grid[team], this.chessboard[this.king_grid[team].x - 2][this.king_grid[team].y]);
		}
		else {
			for (let x = oldGrid.x + 1; x < Const.BOARD_SIZE - 1; x++)
				if (this.get_piece(this.chessboard[x][this.king_grid[team].y]))
					return false;
			return this.isKingSafe(team, this.king_grid[team], this.chessboard[this.king_grid[team].x + 1][this.king_grid[team].y])
				&& this.isKingSafe(team, this.king_grid[team], this.chessboard[this.king_grid[team].x + 2][this.king_grid[team].y]);
		}
	}


	//Switch active team turn
	switchTurn() {
		if (this.turn == Const.TEAM.B) {
			this.turn = Const.TEAM.W;
		}
		else {
			this.turn = Const.TEAM.B;
		}
	}

	countDown() {
		if (this.turn == Const.TEAM.W) {
			if (this.white_timer <= 0) {
				Backend.timesup(Const.TEAM.B);
			}
			else {
				this.white_timer --;
			}
		}

		if (this.turn == Const.TEAM.B) {
			if (this.black_timer <= 0) {
				Backend.timesup(Const.TEAM.W);
			}
			else {
				this.black_timer --;
			}
		}

		this.updateGame();
	}


	//======================================================================== 
	//============================= Helper ===================================
	//======================================================================== 


	copyBoard(board) {
		let newBoard = [[],[],[],[],[],[],[],[]];
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				newBoard[i][j] = new Grid(i, j, board[i][j].piece, board[i][j].color);
			}
		}
		return newBoard;
	}

	//Clear and hide all possible moves
	clearMoves() {
		this.baseboard = [[],[],[],[],[],[],[],[]];
		this.moves = [];
	}


	get_piece(grid) {
		if (!grid || grid.piece == -1) return null;
		return this.pieces[grid.piece];
	}

	fillGrid(grid, color) {
		this.baseboard[grid.x][grid.y] = color;
		this.updateGame();
	}

	unpackNextMove() {
		const flipped = this.turn == this.team ? this.downward : !this.downward;
		return Util.unpack(this.match.moves[this.moves_applied], flipped);
	}


	//Set grid color for all possible moves
	setMovesColor(color, newGrid) {
		for (let i = 0; i < this.moves.length; i++) {
			this.baseboard[this.moves[i].x][this.moves[i].y] = color;
		}
		this.baseboard[newGrid.x][newGrid.y] = color;

		this.updateGame();
	}

	//Set last move grid color
	colorLatestMove(oldGrid, newGrid) {
		this.clearMoves();

		this.baseboard[oldGrid.x][oldGrid.y] = Const.COLOR_LAST_MOVE;
		this.baseboard[newGrid.x][newGrid.y] = Const.COLOR_LAST_MOVE;

		this.updateGame();
	}

	delay(ms) {
		return new Promise(res => this.playTimeout = setTimeout(res, ms));
	}


	//======================================================================== 
	//========================= Update Game State ============================
	//========================================================================

	updateGame() {
		if (this.isMountedRef.current) {
			GameStore.initGame(this);
		}
	}

	ends() {
		this.ended = true;
	}
}
