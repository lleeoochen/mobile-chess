import Store        from 'chessvibe/src/redux/Store';
import * as Reducer from 'chessvibe/src/redux/Reducer';
import * as Const   from 'chessvibe/src/Const';
import Util         from 'chessvibe/src/Util';
import PieceFactory from './piecefactory';
import Grid         from './grid';
import Backend      from 'chessvibe/src/GameBackend';
import Cache        from 'chessvibe/src/Cache';

export default class Game {

	constructor(team, match_id, match) {
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

		this.black_timer = Const.MAX_TIME;
		this.white_timer = Const.MAX_TIME;
		this.interval = null;

		this.match_id = match_id;
		this.match = match;
		this.ended = false;

		// Review variables
		this.stopPlayBack = false;
		this.playTimeout = null;

		function PlayingBack() {
		    var value;

		    this.set = function(v) {
		        value = v;

		        if (value == false)
			        Promise.resolve();
		    }

		    this.get = function() {
		        return value;
		    }

		    var promise = new Promise(this.set);
		}
		this.playingBack = new PlayingBack();
		this.playingBack.set(false);


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


	//Handle chess event with (x, y) click coordinate
	async handleChessEvent(x, y) {
		if (this.team != this.turn || this.ended)
			return;

		//Initalize important variables
		let newGrid = this.chessboard[x][y];
		let isLegal = this.isLegalMove(newGrid);
		isLegal = isLegal && this.isKingSafe(this.team, this.oldGrid, newGrid);

		first_move = false;

		//Action0 - Castle
		if (this.canCastle(this.oldGrid, newGrid)) {
			Backend.updateChessboard(this.oldGrid, newGrid, this.turn, this.black_timer, this.white_timer).catch(err => {
				this.clearMoves();
				this.fillGrid(this.oldGrid, Const.COLOR_ORIGINAL);
				this.unmoveChess();
				this.oldGrid = null;
			});

			this.moveChess(this.oldGrid, newGrid);
			this.oldGrid = null;
			return;
		}

		//Action1 - Deselect Piece by clicking on illegal grid
		if (this.oldGrid != null && !isLegal) {
			this.clearMoves();
			this.fillGrid(this.oldGrid, Const.COLOR_ORIGINAL);
			this.oldGrid = null;
		}

		//Action2 - Select Piece by clicking on grid with active team.
		if (this.get_piece(newGrid) != null && this.get_piece(newGrid).team == this.turn) {
			this.updateMoves(newGrid);
			this.oldGrid = newGrid;
		}

		//Action3 - Move Piece by clicking on empty grid or eat enemy by clicking on legal grid. Switch turn.
		else if (this.oldGrid != null && this.get_piece(this.oldGrid) != null && isLegal) {
			Backend.updateChessboard(this.oldGrid, newGrid, this.turn, this.black_timer, this.white_timer).catch(err => {
				this.clearMoves();
				this.fillGrid(this.oldGrid, Const.COLOR_ORIGINAL);
				this.unmoveChess();
				this.oldGrid = null;
			});

			this.moveChess(this.oldGrid, newGrid);
			if (this.team == Const.TEAM.B)
				this.black_timer += 1
			else
				this.white_timer += 1
			this.oldGrid = null;
		}
	}

	async updateMatchMoves(match) {
		// while (this.moves_applied > match.moves.length) {
		// 	unmoveChess();
		// }

		let breakloop = false;
		while (this.moves_applied < match.moves.length) {
			let flipped = this.turn == this.team ? this.downward : !this.downward;
			let move = Util.unpack(match.moves[this.moves_applied], flipped);

			await new Promise((resolve, reject) => {
				setTimeout(() => {
					breakloop = !this.moveChess(this.chessboard[move.old_x][move.old_y], this.chessboard[move.new_x][move.new_y]);
					resolve();
				}, 100);
			});
			if (breakloop) break;
		}
	}

	updateMatchTimer(match) {
		let t1 = new Date(match.updated);
		let t2 = new Date();
		let time_since_last_move = Math.floor((t2.getTime() - t1.getTime()) / 1000);

		if (this.turn == Const.TEAM.B) {
			this.white_timer = match.white_timer;
			this.black_timer = match.black_timer - time_since_last_move;
		}
		else {
			this.black_timer = match.black_timer;
			this.white_timer = match.white_timer - time_since_last_move;
		}

		// // Many magic numbers.. please fix in the future.
		// let network_delay = 1000 - new Date().getMilliseconds();
		// if (network_delay > 270) {
		// 	if (turn == TEAM.B) {
		// 		black_timer --;
		// 	}
		// 	else {
		// 		white_timer --;
		// 	}
		// }

		// setTimeout(() => {
		// 	clearInterval(this.interval);
		// 	this.countDown();
		// 	// enableHtml('#add-time-btn .utility-btn', true);

		// 	this.interval = setInterval(function() {
		// 		this.countDown();
		// 	}, 1000);
		// }, network_delay);
	}

	async updatePlayerData(match) {
		let blackPlayer = Store.getState().blackPlayer;
		let whitePlayer = Store.getState().whitePlayer;

		if (blackPlayer && whitePlayer) return;

		if (!blackPlayer && match.black) {
			blackPlayer = (await Backend.getUser(match.black)).data;
		}
		if (!whitePlayer && match.white) {
			whitePlayer = (await Backend.getUser(match.white)).data;
		}

		Cache.users[match.black] = blackPlayer;
		Cache.users[match.white] = whitePlayer;
		Store.dispatch(Reducer.updatePlayer( { blackPlayer, whitePlayer } ));
	}

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

	//Get all valid friends and enemies that can eat keyGrid
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
							return STATUS_NONE;
						}
					}
				}
			}
		}

		if (this.isKingSafe(team)) {
			return STATUS_STALEMATE;
		}
		return STATUS_CHECKMATE;
	}

	//Update and show all possible moves based on a specific grid
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

	//Check legal move of chess piece
	isLegalMove(grid) {
		let legalMove = false;
		for (let i = 0; i < this.moves.length && !legalMove; i++)
			if (grid.x == this.moves[i].x && grid.y == this.moves[i].y)
				legalMove = true;
		return legalMove;
	}

	//Check legal move of chess piece
	isKingSafe(team, oldGrid, newGrid) {
		let board = this.copyBoard(this.chessboard);

		let isKingSafe = true;
		let target_grid = this.king_grid[team];

		if (oldGrid && newGrid) {
			board[newGrid.x][newGrid.y].piece = board[oldGrid.x][oldGrid.y].piece;
			board[oldGrid.x][oldGrid.y].piece = -1;

			if (oldGrid == this.king_grid[team])
				target_grid = newGrid;
		}

		let validPieces = this.getReachablePieces(board, target_grid, team)
		let enemies = validPieces.enemies;
		let friends = validPieces.friends;

		return enemies.length == 0;
	}

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

	copyBoard(board) {
		let newBoard = [[],[],[],[],[],[],[],[]];
		for (let i = 0; i < board.length; i++) {
			for (let j = 0; j < board.length; j++) {
				newBoard[i][j] = new Grid(i, j, board[i][j].piece, board[i][j].color);
			}
		}
		return newBoard;
	}


	//======================================================================== 
	//============================= Move Chess =============================== 
	//======================================================================== 


	//Move chess from oldGrid to newGrid
	moveChess(oldGrid, newGrid) {
		if (this.get_piece(oldGrid) == null) return false;
		let team = this.get_piece(oldGrid).team;

		this.stackEatenPiece(oldGrid, newGrid, newGrid, newGrid.piece, false, Const.FLAG_NONE);

		//===================== Special Moves ========================

		// Passant Move
		this.movePassantPawn(oldGrid, newGrid);

		// Castle Move
		this.moveCastleKing(oldGrid, newGrid);

		// Remove newGrid piece if being eaten
		if (this.get_piece(newGrid)) {
			this.eaten[this.get_piece(oldGrid).team].push(this.get_piece(newGrid).image);
			this.stats[this.get_piece(newGrid).team] -= Const.VALUE[this.get_piece(newGrid).type];
		}
		newGrid.piece = oldGrid.piece;

		//====================== Update Miscs =======================

		// Pawn to Queen Move
		this.movePawnToQueen(oldGrid, newGrid);

		// Update king position
		if (oldGrid == this.king_grid[team])
			this.king_grid[team] = newGrid;

		// Clear old grid piece
		oldGrid.piece = -1;


		this.switchTurn();

		this.moves_applied ++;

		this.colorLatestMove(oldGrid, newGrid);

		return true;
	}

	movePassantPawn(oldGrid, newGrid) {
		let kill_passant_pawn = false;

		// Check passant pawn can be killed
		if (this.passant_pawn) {

			if (this.get_piece(oldGrid).team != this.get_piece(this.passant_pawn).team) {
				let downward = this.get_piece(oldGrid).team == this.team ? this.downward : !this.downward;

				if (downward
					&& newGrid.x == this.passant_pawn.x
					&& newGrid.y == this.passant_pawn.y + 1) {
					kill_passant_pawn = true;
				}
				else if (!downward
					&& newGrid.x == this.passant_pawn.x
					&& newGrid.y == this.passant_pawn.y - 1) {
					kill_passant_pawn = true;
				}
			}
		}

		// Kill passant pawn
		if (kill_passant_pawn && this.passant_pawn) {
			this.stackEatenPiece(oldGrid, newGrid, this.passant_pawn, this.passant_pawn.piece, true, Const.FLAG_PASSANT_PAWN);
			this.passant_pawn.piece = -1;
		}

		// Update passant pawns on 2 moves
		this.passant_pawn = undefined;
		if (this.get_piece(oldGrid).type == Const.CHESS.Pawn) {
			let downward = this.get_piece(oldGrid).team == this.team ? this.downward : !this.downward;

			if (!downward && oldGrid.y - newGrid.y == 2) {
				this.passant_pawn = newGrid;
			}
			else if (downward && newGrid.y - oldGrid.y == 2) {
				this.passant_pawn = newGrid;
			}
		}
		this.passant_stack.push(this.passant_pawn);
	}

	moveCastleKing(oldGrid, newGrid) {
		// If oldGrid is king
		if (this.get_piece(oldGrid).type == Const.CHESS.King) {

			// If either king hasn't move
			if (this.get_piece(oldGrid).team == Const.TEAM.W && !this.white_king_moved
				|| this.get_piece(oldGrid).team == Const.TEAM.B && !this.black_king_moved) {

				// Perform right castle
				if (newGrid.x - oldGrid.x == 2) {
					this.chessboard[oldGrid.x + 1][oldGrid.y].piece = this.chessboard[Const.BOARD_SIZE - 1][oldGrid.y].piece;
					this.chessboard[Const.BOARD_SIZE - 1][oldGrid.y].piece = -1;
					this.stackEatenPiece(oldGrid, newGrid, newGrid, newGrid.piece, true, Const.FLAG_KING_CASTLE);
				}

				// Perform left castle
				if (newGrid.x - oldGrid.x == -2) {
					this.chessboard[oldGrid.x - 1][oldGrid.y].piece = this.chessboard[0][oldGrid.y].piece;
					this.chessboard[0][oldGrid.y].piece = -1;
					this.stackEatenPiece(oldGrid, newGrid, newGrid, newGrid.piece, true, Const.FLAG_KING_CASTLE);
				}

			}
		}

		//King has moved, cannot castle anymore
		if (this.get_piece(oldGrid).team == Const.TEAM.W && this.get_piece(oldGrid).type == Const.CHESS.King) {
			this.white_king_moved = true;
		}

		//Other King has moved, cannot castle anymore
		if (this.get_piece(oldGrid).team == Const.TEAM.B && this.get_piece(oldGrid).type == Const.CHESS.King) {
			this.black_king_moved = true;
		}
	}

	movePawnToQueen(oldGrid, newGrid) {
		if (this.get_piece(newGrid).type == Const.CHESS.Pawn) {
			let downward = this.get_piece(newGrid).team == this.team ? this.downward : !this.downward;
			let whitePawnArrived = !downward && newGrid.y == 0;
			let blackPawnArrived = downward && newGrid.y == Const.BOARD_SIZE - 1;

			if (whitePawnArrived || blackPawnArrived) {
				let eatenPiece = this.moves_stack.pop().eaten_piece;
				this.stackEatenPiece(oldGrid, newGrid, newGrid, eatenPiece, false, Const.FLAG_PAWN_TO_QUEEN);

				this.initEachPiece(this.id++, newGrid.x, newGrid.y, this.get_piece(newGrid).team, Const.CHESS.Queen);
				this.stats[this.get_piece(newGrid).team] += Const.VALUE[Const.CHESS.Queen] - Const.VALUE[Const.CHESS.Pawn];
			}
		}
	}

	stackEatenPiece(oldGrid, newGrid, eatenGrid, eatenPiece, toPopOne, flag) {
		if (toPopOne) this.moves_stack.pop();
		this.moves_stack.push({
			old_x: oldGrid.x,
			old_y: oldGrid.y,
			new_x: newGrid.x,
			new_y: newGrid.y,
			eaten_x: eatenGrid.x,
			eaten_y: eatenGrid.y,
			eaten_piece: eatenPiece,
			flag: flag
		});
	}

	get_piece(grid) {
		if (!grid || grid.piece == -1) return null;
		return this.pieces[grid.piece];
	}

	fillGrid(grid, color) {
		this.baseboard[grid.x][grid.y] = color;
		this.updateGame();
	}


	//Clear and hide all possible moves
	clearMoves() {
		this.baseboard = [[],[],[],[],[],[],[],[]];
		this.moves = [];
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

	updateGame() {
		Store.dispatch(Reducer.initGame(this));
	}

	ends() {
		this.ended = true;
	}


	// Unmove chess piece from newGrid to oldGrid
	unmoveChess() {
		if (this.moves_stack.length == 0) return;

		this.passant_stack.pop();
		this.passant_pawn = this.passant_stack[this.passant_stack.length - 1];

		let prev_move = this.unstackEatenPiece();
		// {
		// 	old_x: oldGrid.x,
		// 	old_y: oldGrid.y,
		// 	new_x: newGrid.x,
		// 	new_y: newGrid.y,
		// 	eaten_x: eatenGrid.x,
		// 	eaten_y: eatenGrid.y,
		// 	eaten_piece: eatenPiece,
		// 	flag: flag
		// }

		let newGrid = this.chessboard[prev_move.new_x][prev_move.new_y];
		let oldGrid = this.chessboard[prev_move.old_x][prev_move.old_y];
		let eatenGrid = this.chessboard[prev_move.eaten_x][prev_move.eaten_y];
		let eaten_piece = prev_move.eaten_piece;
		let flag = prev_move.flag;
		// console.log("==================");
		// console.log("newGrid: " + JSON.stringify(newGrid));
		// console.log("oldGrid: " + JSON.stringify(oldGrid));
		// console.log("eaten_grid: " + JSON.stringify(eatenGrid));
		// console.log("eaten_piece: " + eaten_piece);

		// this.revertMoveHistory();

		//===================== Special Moves ========================

		//Castle Move
		if (flag == Const.FLAG_KING_CASTLE) {
			this.unmoveCastleKing(newGrid, oldGrid);
		}

		//====================== Redraw Pieces =======================

		//Copy newGrid piece for oldGrid.
		oldGrid.piece = newGrid.piece;

		//====================== Update Miscs =======================

		//Pawn to Queen Move
		if (flag == Const.FLAG_PAWN_TO_QUEEN) {
			this.unmovePawnToQueen(newGrid, oldGrid, eaten_piece);
		}

		//Update king position
		this.king_grid[this.get_piece(newGrid).team] = newGrid == this.king_grid[this.get_piece(newGrid).team] ? oldGrid : this.king_grid[this.get_piece(newGrid).team];

		//Clear new grid piece
		newGrid.piece = -1;

		//Restore piece if being eaten
		this.unmoveEatPiece(eatenGrid, eaten_piece);

		//Update move counter and switch turn
		this.moves_applied -= 1;

		//Switch turn
		this.switchTurn();

		//Show resulting stats
		// this.updateStats();

		//Color old and new grids
		this.colorLatestMove(newGrid, oldGrid);
	}

	unmoveEatPiece(eatenGrid, eaten_piece) {
		if (eaten_piece != -1) {
			this.stats[this.pieces[eaten_piece].team] += Const.VALUE[this.pieces[eaten_piece].type];

			var new_img = this.pieces[eaten_piece].image;
			var newGridTeam = this.pieces[eaten_piece].team;

			// piecesLayer.appendChild(new_img);
			// new_img.setAttribute("class", "piece x" + eatenGrid.x + " y" + eatenGrid.y);
			eatenGrid.piece = eaten_piece;

			// if (newGridTeam == Const.TEAM.B) {
			// 	$('#blacksEaten').children().last().remove();
			// }
			// else {
			// 	$('#whitesEaten').children().last().remove();
			// }

			let other_team = this.pieces[eaten_piece].team == Const.TEAM.W ? Const.TEAM.B : Const.TEAM.W;
			const index = this.eaten[other_team].indexOf(this.pieces[eaten_piece].image);
			if (index > -1) {
				this.eaten[other_team].splice(index, 1);
			}
		}
	}

	unmoveCastleKing(newGrid, oldGrid) {
		// Perform right castle
		if (oldGrid.x - newGrid.x == -2) {
			this.chessboard[Const.BOARD_SIZE - 1][newGrid.y].piece = this.chessboard[newGrid.x - 1][newGrid.y].piece;
			// this.chessboard[Const.BOARD_SIZE - 1][newGrid.y].get_piece().image.setAttribute("class", "piece x" + (Const.BOARD_SIZE - 1) + " y" + newGrid.y);
			this.chessboard[newGrid.x - 1][newGrid.y].piece = -1;
		}

		// Perform left castle
		if (oldGrid.x - newGrid.x == 2) {
			this.chessboard[0][newGrid.y].piece = this.chessboard[newGrid.x + 1][newGrid.y].piece;
			// this.chessboard[0][newGrid.y].get_piece().image.setAttribute("class", "piece x" + (0) + " y" + newGrid.y);
			this.chessboard[newGrid.x + 1][newGrid.y].piece = -1;
		}


		if (this.get_piece(newGrid).team == Const.TEAM.W && this.get_piece(newGrid).type == Const.CHESS.King) {
			this.white_king_moved = false;
		}

		if (this.get_piece(newGrid).team == Const.TEAM.B && this.get_piece(newGrid).type == Const.CHESS.King) {
			this.black_king_moved = false;
		}
	}

	unmovePawnToQueen(newGrid, oldGrid, eaten_piece) {
		oldGrid.piece = newGrid.piece;
		piecesLayer.removeChild(this.get_piece(newGrid).image);
		initEachPiece(this.id++, oldGrid.x, oldGrid.y, this.get_piece(oldGrid).team, Const.CHESS.Pawn);

		this.stats[this.get_piece(oldGrid).team] += Const.VALUE[Const.CHESS.Pawn] - Const.VALUE[Const.CHESS.Queen];
	}

	unstackEatenPiece() {
		return this.moves_stack.pop();
	}



	async reviewMove(moves_target, timeout=0) {
		this.playingBack.set(true);
		let breakloop = false;

		while (this.moves_applied > 0 && this.moves_applied > moves_target && !this.stopPlayBack) {

			await new Promise((resolve, reject) => {
				this.playTimeout = setTimeout(() => {
					if (!this.stopPlayBack) {
						this.unmoveChess();
					}

					resolve();
				}, timeout);
			});
			// updateReviewButtons();
		}

		while (this.moves_applied < this.match.moves.length - 1 && this.moves_applied < moves_target && !this.stopPlayBack) {
			let flipped = this.turn == this.team ? this.downward : !this.downward;
			let move = Util.unpack(this.match.moves[this.moves_applied], flipped);

			await new Promise((resolve, reject) => {
				this.playTimeout = setTimeout(() => {
					if (!this.stopPlayBack) {
						breakloop = !this.moveChess(this.chessboard[move.old_x][move.old_y], this.chessboard[move.new_x][move.new_y]);
					}

					resolve();
				}, timeout);
			});

			if (breakloop) break;
		}

		clearTimeout(this.playTimeout);
		this.playingBack.set(false);
		// this.updateGame();
	}

	async pausePlayback() {
		this.stopPlayBack = true;
		if (this.playingBack.get()) {
			// $('#playback-btn img').attr('src', 'assets/play.png');
			await this.playingBack.promise;
		}
	}
}
