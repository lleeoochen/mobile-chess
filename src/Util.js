import { Dimensions } from 'react-native';
import Store, { HomeStore } from 'chessvibe/src/redux/Store';
import Cache from './Cache';
import {
	DB_CHECKMATE_WHITE,
	DB_CHECKMATE_BLACK,
	DB_STALEMATE,
	DB_TIMESUP_WHITE,
	DB_TIMESUP_BLACK,
	DB_RESIGN_WHITE,
	DB_RESIGN_BLACK,
	DB_DRAW,

	TEAM,
	BOARD_SIZE,

	THEME,
	IMAGE,

	DB_THEME_CLASSIC,
	DB_THEME_WINTER,
	DB_THEME_METAL,
	DB_THEME_NATURE,
} from './Const';

export default class Util {

	static request(method, url, body) {
		return new Promise(async (resolve, reject) => {
			let time_start = new Date().getTime();

			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': Cache.sessionToken
				},
				body: JSON.stringify(body)
			});

			let short_url = url.split('?')[0];
			let result = await response.json();

			if (response.status >= 400) {
				console.error('Network Error ' + short_url + ': ' + result);
				if (response.status == 401) {
					// Store.dispatch()
					HomeStore.toLogout(true);
				}
			}

			resolve(result, response.status);
		});
	}

	static checkPosition(pos) {
		if (pos != null && this.inBound(pos.x) && this.inBound(pos.y))
			return pos;
		else
			return null;
	}
	static inBound(i) {
		return i >= 0 && i < BOARD_SIZE;
	}

	static pack(oldGrid, newGrid, turn) {
		return oldGrid.x * 10000 + oldGrid.y * 1000 + newGrid.x * 100 + newGrid.y * 10 + (turn == TEAM.W ? 1 : 0);
	}

	static unpack(data, flipped) {
		let move = {
			old_x: Math.floor(data / 10000),
			old_y: Math.floor((data % 10000) / 1000),
			new_x: Math.floor((data % 1000) / 100),
			new_y: Math.floor((data % 100) / 10),
			turn: (Math.floor((data % 10) / 1) == 1) ? TEAM.W : TEAM.B
		};

		if (flipped) {
			move.old_x = this.flipCoord(move.old_x);
			move.new_x = this.flipCoord(move.new_x);
			move.old_y = this.flipCoord(move.old_y);
			move.new_y = this.flipCoord(move.new_y);
		}

		return move;
	}

	static flipCoord(x) {
		return BOARD_SIZE - x - 1;
	}

	static packTheme(theme) {
		if (theme == THEME.CLASSIC) {
			return DB_THEME_CLASSIC;
		}
		else if (theme == THEME.WINTER) {
			return DB_THEME_WINTER;
		}
		else if (theme == THEME.METAL) {
			return DB_THEME_METAL;
		}
		else if (theme == THEME.NATURE) {
			return DB_THEME_NATURE;
		}
		return DB_THEME_CLASSIC;
	}

	static unpackTheme(data) {
		if (data == DB_THEME_CLASSIC) {
			return THEME.CLASSIC;
		}
		else if (data == DB_THEME_WINTER) {
			return THEME.WINTER;
		}
		else if (data == DB_THEME_METAL) {
			return THEME.METAL;
		}
		else if (data == DB_THEME_NATURE) {
			return THEME.NATURE;
		}
		return THEME.CLASSIC;
	}

	static packMessage(message, my_team) {
		return my_team + message;
	}

	static unpackMessage(data) {
		return {
			team: data[0],
			message: data.slice(1)
		};
	}

	static gameFinished(match) {
		return Math.floor(match.moves[match.moves.length - 1] / 10) == 0;
	}
}

export function vw(size=1) {
	return size * Dimensions.get('window').width / 100.0;
}

export function vh(size=1) {
	return size * Dimensions.get('window').height / 100.0;
}

// https://stackoverflow.com/a/8888498
export function formatDate(date, format='%M/%D %h:%m %z') {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	var strTime = format.replace('%M', (date.getMonth() + 1) || '')
						.replace('%D', date.getDate() || '')
						.replace('%h', hours || '')
						.replace('%m', minutes || '')
						.replace('%z', ampm || '');
	return strTime;
}

export function formatTimer(timer) {
	let min = Math.floor(timer / 60);
	let sec = timer - min * 60;
	min = min < 10 ? '0' + min : min;
	sec = sec < 10 ? '0' + sec : sec;
	return min + ":" + sec;
}

export function winType(move, team) {
	if (move == DB_DRAW) {
		return 0;
	}
	else if (move == DB_STALEMATE) {
		return 1;
	}
	else if (move == DB_CHECKMATE_BLACK) {
		return team == TEAM.B;
	}
	else if (move == DB_CHECKMATE_WHITE) {
		return team == TEAM.W;
	}
	else if (move == DB_TIMESUP_BLACK) {
		return team == TEAM.B;
	}
	else if (move == DB_TIMESUP_WHITE) {
		return team == TEAM.W;
	}
	else if (move == DB_RESIGN_BLACK) {
		return team == TEAM.B ? 2 : undefined;
	}
	else if (move == DB_RESIGN_WHITE) {
		return team == TEAM.W ? 2 : undefined;
	}
}

export function getWinMessage(match) {
	if (!match || !match.moves) return '';

	let move = match.moves[match.moves.length - 1];

	if (move == DB_STALEMATE) {
		return 'Stalemate.';
	}
	else if (move == DB_DRAW) {
		return 'Draw.';
	}
	else if (move == DB_CHECKMATE_BLACK) {
		return 'Checkmate. Black Team Wins!';
	}
	else if (move == DB_CHECKMATE_WHITE) {
		return 'Checkmate. White Team Wins!';
	}
	else if (move == DB_TIMESUP_BLACK) {
		return 'Time\'s Up. Black Team Wins!';
	}
	else if (move == DB_TIMESUP_WHITE) {
		return 'Time\'s Up. White Team Wins!';
	}
	else if (move == DB_RESIGN_BLACK) {
		return 'White Resigned. Black Team Wins!';
	}
	else if (move == DB_RESIGN_WHITE) {
		return 'Black Resigned. White Team Wins!';
	}

	return 'Game Over.'
}

export function piece(grid) {
	if (grid != null && grid.piece != null)
		return Store.getState().game.pieces[grid.piece];
	return null;
}

export function strict_equal(a, b) {
	return JSON.stringify(a) === JSON.stringify(b);
};

export function formatImage(imgUrl) {
	if (!imgUrl) return IMAGE.NEW_MATCH;
	return { uri: imgUrl.replace(/(.*)=.*/, '$1') + '=c' };
}