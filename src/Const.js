export const URL = Object.freeze({
	FRONTEND: 'https://www.chessvibe.net',
	BACKEND: 'https://api.chessvibe.net',
});

// export const URL = Object.freeze({
// 	FRONTEND: 'http://10.0.0.59:4000',
// 	BACKEND: 'http://10.0.0.59:8000',
// });

export const TEAM = {B: "B", W: "W", None:"N"};
export const BOARD_SIZE = 8;

export const DB_CHECKMATE_WHITE = 0;
export const DB_CHECKMATE_BLACK = 1;
export const DB_STALEMATE = 2;
export const DB_TIMESUP_WHITE = 3;
export const DB_TIMESUP_BLACK = 4;
export const DB_RESIGN_WHITE = 5;
export const DB_RESIGN_BLACK = 6;
export const DB_DRAW = 7;

export const DB_THEME_CLASSIC = 0;
export const DB_THEME_WINTER = 1;
export const DB_THEME_METAL = 2;
export const DB_THEME_NATURE = 3;
