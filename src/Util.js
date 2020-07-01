import { Dimensions } from 'react-native';
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

	THEME_CLASSIC,
	THEME_WINTER,
	THEME_METAL,
	THEME_NATURE,

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

			let result = await response.json();
			resolve(result);
		});
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
			move.old_x = BOARD_SIZE - move.old_x - 1;
			move.new_x = BOARD_SIZE - move.new_x - 1;
			move.old_y = BOARD_SIZE - move.old_y - 1;
			move.new_y = BOARD_SIZE - move.new_y - 1;
		}

		return move;
	}

	static packTheme(theme) {
		if (theme == THEME_CLASSIC) {
			return DB_THEME_CLASSIC;
		}
		else if (theme == THEME_WINTER) {
			return DB_THEME_WINTER;
		}
		else if (theme == THEME_METAL) {
			return DB_THEME_METAL;
		}
		else if (theme == THEME_NATURE) {
			return DB_THEME_NATURE;
		}
		return DB_THEME_CLASSIC;
	}

	static unpackTheme(data) {
		if (data == DB_THEME_CLASSIC) {
			return THEME_CLASSIC;
		}
		else if (data == DB_THEME_WINTER) {
			return THEME_WINTER;
		}
		else if (data == DB_THEME_METAL) {
			return THEME_METAL;
		}
		else if (data == DB_THEME_NATURE) {
			return THEME_NATURE;
		}
		return THEME_CLASSIC;
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