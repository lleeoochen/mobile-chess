export const URL = Object.freeze({
	FRONTEND: 'https://www.chessvibe.net',
	BACKEND: 'https://api.chessvibe.net',
});


export const CHESS = {King: "King", Queen: "Queen", Rook: "Rook", Bishop: "Bishop", Knight: "Knight", Pawn: "Pawn", None: "None"};
export const VALUE = {King: 200, Queen: 9, Rook: 5, Bishop: 3, Knight: 3, Pawn: 1, None: 0};
export const TEAM = {B: "B", W: "W", None:"N"};

export const BOARD_SIZE = 8;

export const MATCHES_TABLE = "chess_matches";
export const USERS_TABLE = "chess_users";

export const CHESS_IMAGE = {
	BKing:   require("chessvibe/assets/BKing.png"),
	BQueen:  require("chessvibe/assets/BQueen.png"),
	BRook:   require("chessvibe/assets/BRook.png"),
	BBishop: require("chessvibe/assets/BBishop.png"),
	BKnight: require("chessvibe/assets/BKnight.png"),
	BPawn:   require("chessvibe/assets/BPawn.png"),

	WKing:   require("chessvibe/assets/WKing.png"),
	WQueen:  require("chessvibe/assets/WQueen.png"),
	WRook:   require("chessvibe/assets/WRook.png"),
	WBishop: require("chessvibe/assets/WBishop.png"),
	WKnight: require("chessvibe/assets/WKnight.png"),
	WPawn:   require("chessvibe/assets/WPawn.png"),
};

export const THEME = Object.freeze({
	CLASSIC: {
		ID:                     "classic",
		COLOR_BOARD_LIGHT:      "#E6BF83",
		COLOR_BOARD_DARK:       "#8B4513",
		COLOR_HIGHLIGHT_LIGHT:  "#9E93E1",
		COLOR_HIGHLIGHT_DARK:   "#7B68EE",
		COLOR_LAST_MOVE_LIGHT:  "#FDFD84",
		COLOR_LAST_MOVE_DARK:   "#EFEF6E",
		COLOR_UTILITY: {
			DESKTOP:            "#494949",
			MOBILE:             "#89898980",
		},
		BACKGROUND_IMAGE:       require("chessvibe/assets/background.jpg"),
		NAME_TITLE_COLOR:       "white"
	},

	WINTER: {
		ID:                     "winter",
		COLOR_BOARD_LIGHT:      "#00B3DE",
		COLOR_BOARD_DARK:       "#3D507B",
		COLOR_HIGHLIGHT_LIGHT:  "#CC5E7C",
		COLOR_HIGHLIGHT_DARK:   "#D63460",
		COLOR_LAST_MOVE_LIGHT:  "#FDFD84",
		COLOR_LAST_MOVE_DARK:   "#EFEF6E",
		COLOR_UTILITY: {
			DESKTOP:            "#494949",
			MOBILE:             "#FFFFFF33",
		},
		BACKGROUND_IMAGE:       require("chessvibe/assets/background_winter.jpg"),
		NAME_TITLE_COLOR:       "white",
	},

	METAL: {
		ID:                     "metal",
		COLOR_BOARD_LIGHT:      "#d2d2d2",
		COLOR_BOARD_DARK:       "#5a5858",
		COLOR_HIGHLIGHT_LIGHT:  "#9e93e1",
		COLOR_HIGHLIGHT_DARK:   "#7B68EE",
		COLOR_LAST_MOVE_LIGHT:  "#FDFD84",
		COLOR_LAST_MOVE_DARK:   "#EFEF6E",
		COLOR_UTILITY: {
			DESKTOP:            "#494949",
			MOBILE:             "#89898980",
		},
		BACKGROUND_IMAGE:       require("chessvibe/assets/background_metal.jpg"),
		NAME_TITLE_COLOR:       "white"
	},

	NATURE: {
		ID:                     "nature",
		COLOR_BOARD_LIGHT:      "#c7da61",
		COLOR_BOARD_DARK:       "#437149",
		COLOR_HIGHLIGHT_LIGHT:  "#9e93e1",
		COLOR_HIGHLIGHT_DARK:   "#7B68EE",
		COLOR_LAST_MOVE_LIGHT:  "#BB92AB",
		COLOR_LAST_MOVE_DARK:   "#905E7C",
		COLOR_UTILITY: {
			DESKTOP:            "#494949",
			MOBILE:             "#00000080",
		},
		BACKGROUND_IMAGE:       require("chessvibe/assets/background_nature.jpg"),
		NAME_TITLE_COLOR:       "white",
	},
});

export const COLOR_ORIGINAL = 0;
export const COLOR_HIGHLIGHT = 1;
export const COLOR_LAST_MOVE = 2;

export const STATUS_NONE = 0;
export const STATUS_CHECKMATE = 1;
export const STATUS_STALEMATE = 2;

export const DB_CHECKMATE_WHITE = 0;
export const DB_CHECKMATE_BLACK = 1;
export const DB_STALEMATE = 2;
export const DB_TIMESUP_WHITE = 3;
export const DB_TIMESUP_BLACK = 4;
export const DB_RESIGN_WHITE = 5;
export const DB_RESIGN_BLACK = 6;
export const DB_DRAW = 7;

export const DB_REQUEST_NONE = 0;
export const DB_REQUEST_ASK = 1;
export const DB_REQUEST_DONE = 2;

export const DB_THEME_CLASSIC = 0;
export const DB_THEME_WINTER = 1;
export const DB_THEME_METAL = 2;
export const DB_THEME_NATURE = 3;

export const FLAG_NONE = 0;
export const FLAG_KING_CASTLE = 1;
export const FLAG_PASSANT_PAWN = 2;
export const FLAG_PAWN_TO_QUEEN = 3;

export const MAX_TIME = 60 * 60; // 1 Hour Max (Infinite time otherwise)
export const STATS_MAX = 42; // treat king as 3 score
export const LAST_VISITED_KEY = 'last_visited';
export const SESSION_TOKEN = 'session_token';


export const THEME_ID = {
	CLASSIC: 0,
	WINTER: 1,
	METAL: 2,
	NATURE: 3,
};

export const TIME = {
	FIVE: 5 * 60,
	FIFTEEN: 15 * 60,
	THIRTY: 30 * 60,
	INFINITE: 100 * 60,
};