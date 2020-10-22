export const URL = Object.freeze({
	FRONTEND: 'https://www.chessvibe.net',
	BACKEND: 'https://api.chessvibe.net',
});


export const CHESS = {King: 'King', Queen: 'Queen', Rook: 'Rook', Bishop: 'Bishop', Knight: 'Knight', Pawn: 'Pawn', None: 'None'};
export const VALUE = {King: 200, Queen: 9, Rook: 5, Bishop: 3, Knight: 3, Pawn: 1, None: 0};
export const TEAM = {B: 'B', W: 'W', None:'N'};

export const BOARD_SIZE = 8;

export const MATCHES_TABLE = 'chess_matches';
export const USERS_TABLE = 'chess_users';

export const IMAGE = {
	// General images
	BACK:      require('chessvibe/assets/back.png'),
	THEME:     require('chessvibe/assets/palette.png'),
	MENU:      require('chessvibe/assets/menu.png'),
	NEW_GAME:  require('chessvibe/assets/new_game.png'),
	NEW_MATCH: require('chessvibe/assets/new_match.png'),
	SEND:      require('chessvibe/assets/send.png'),
	LOGOUT:    require('chessvibe/assets/logout.png'),
	HISTORY:   require('chessvibe/assets/history.png'),
	FRIENDS:   require('chessvibe/assets/friends.png'),
	SETTINGS:  require('chessvibe/assets/settings.png'),
	HALFMOON:  require('chessvibe/assets/halfmoon.png'),
	BELL:      require('chessvibe/assets/bell.png'),

	BACK_DARK:     require('chessvibe/assets/dark/back.png'),
	THEME_DARK:    require('chessvibe/assets/dark/palette.png'),
	MENU_DARK:     require('chessvibe/assets/dark/menu.png'),
	NEW_GAME_DARK: require('chessvibe/assets/new_game.png'),
	DRAW_DARK:     require('chessvibe/assets/dark/draw.png'),
	HISTORY_DARK:  require('chessvibe/assets/dark/history.png'),
	FRIENDS_DARK:  require('chessvibe/assets/dark/friends.png'),
	SETTINGS_DARK: require('chessvibe/assets/dark/settings.png'),
	LOGOUT_DARK:   require('chessvibe/assets/dark/logout.png'),
	HALFMOON_DARK: require('chessvibe/assets/dark/halfmoon.png'),
	BELL_DARK:     require('chessvibe/assets/dark/bell.png'),

	// Theme images
	CLASSIC: require('chessvibe/assets/background.jpg'),
	WINTER:  require('chessvibe/assets/background_winter.jpg'),
	METAL:   require('chessvibe/assets/background_metal.jpg'),
	NATURE:  require('chessvibe/assets/background_nature.jpg'),

	// Preview images
	PREVIEW_CLASSIC: require('chessvibe/assets/preview/classic.png'),
	PREVIEW_WINTER:  require('chessvibe/assets/preview/winter.png'),
	PREVIEW_METAL:   require('chessvibe/assets/preview/metal.png'),
	PREVIEW_NATURE:  require('chessvibe/assets/preview/nature.png'),

	// Chess pieces
	BKing:   require('chessvibe/assets/BKing.png'),
	BQueen:  require('chessvibe/assets/BQueen.png'),
	BRook:   require('chessvibe/assets/BRook.png'),
	BBishop: require('chessvibe/assets/BBishop.png'),
	BKnight: require('chessvibe/assets/BKnight.png'),
	BPawn:   require('chessvibe/assets/BPawn.png'),

	WKing:   require('chessvibe/assets/WKing.png'),
	WQueen:  require('chessvibe/assets/WQueen.png'),
	WRook:   require('chessvibe/assets/WRook.png'),
	WBishop: require('chessvibe/assets/WBishop.png'),
	WKnight: require('chessvibe/assets/WKnight.png'),
	WPawn:   require('chessvibe/assets/WPawn.png'),

	// Review buttons
	FORWARD:      require('chessvibe/assets/forward.png'),
	FASTFORWARD:  require('chessvibe/assets/fast-forward.png'),
	BACKWARD:     require('chessvibe/assets/backward.png'),
	FASTBACKWARD: require('chessvibe/assets/fast-backward.png'),
	PLAY:         require('chessvibe/assets/play.png'),
	PAUSE:        require('chessvibe/assets/pause.png'),

	// Action buttons
	RESIGN: require('chessvibe/assets/resign.png'),
	DRAW:   require('chessvibe/assets/draw.png'),
	MERCY:  require('chessvibe/assets/mercy.png'),
	TIME:   require('chessvibe/assets/time.png'),
	INVITE: require('chessvibe/assets/invite.png'),
};

export const APP_THEME = Object.freeze({
	LIGHT: {
		APP_BACKGROUND:     '#559df7', // Top bar, app background color
		CONTENT_BACKGROUND: '#b7ceea', // Main container background color
		MENU_BACKGROUND:    '#90b7e6', // Side menu background color
		COLOR:              'black', // Text color
		SUB_COLOR:          'darkslategrey', // Subtext color
		SETTING_BACKGROUND: 'white',  // Setting item color
		SETTING_BORDER:     'grey', // Setting item border
		ACTION_BUTTON:      '#5bad29', // Action button background color
	},

	DARK: {
		APP_BACKGROUND:     'black', // Top bar, app background color
		CONTENT_BACKGROUND: '#1A283A', // Main container background color
		MENU_BACKGROUND:    '#0D151F', // Side menu background color
		COLOR:              'white', // Text color
		SUB_COLOR:          '#949494', // Subtext color
		SETTING_BACKGROUND: '#2a4261', // Setting item color
		SETTING_BORDER:     '#1a283a', // Setting item border
		ACTION_BUTTON:      '#437149', // Action button background color
	},
});

export const THEME = Object.freeze({
	CLASSIC: {
		ID:                     'classic',
		COLOR_BOARD_LIGHT:      '#E6BF83',
		COLOR_BOARD_DARK:       '#8B4513',
		COLOR_HIGHLIGHT_LIGHT:  '#9E93E1',
		COLOR_HIGHLIGHT_DARK:   '#7B68EE',
		COLOR_LAST_MOVE_LIGHT:  '#FDFD84',
		COLOR_LAST_MOVE_DARK:   '#EFEF6E',
		COLOR_UTILITY: {
			DESKTOP:            '#494949',
			MOBILE:             '#89898980',
		},
		BACKGROUND_IMAGE:       IMAGE.CLASSIC,
		NAME_TITLE_COLOR:       'white'
	},

	WINTER: {
		ID:                     'winter',
		COLOR_BOARD_LIGHT:      '#00B3DE',
		COLOR_BOARD_DARK:       '#3D507B',
		COLOR_HIGHLIGHT_LIGHT:  '#CC5E7C',
		COLOR_HIGHLIGHT_DARK:   '#D63460',
		COLOR_LAST_MOVE_LIGHT:  '#FDFD84',
		COLOR_LAST_MOVE_DARK:   '#EFEF6E',
		COLOR_UTILITY: {
			DESKTOP:            '#494949',
			MOBILE:             '#FFFFFF33',
		},
		BACKGROUND_IMAGE:       IMAGE.WINTER,
		NAME_TITLE_COLOR:       'white',
	},

	METAL: {
		ID:                     'metal',
		COLOR_BOARD_LIGHT:      '#d2d2d2',
		COLOR_BOARD_DARK:       '#5a5858',
		COLOR_HIGHLIGHT_LIGHT:  '#9e93e1',
		COLOR_HIGHLIGHT_DARK:   '#7B68EE',
		COLOR_LAST_MOVE_LIGHT:  '#FDFD84',
		COLOR_LAST_MOVE_DARK:   '#EFEF6E',
		COLOR_UTILITY: {
			DESKTOP:            '#494949',
			MOBILE:             '#89898980',
		},
		BACKGROUND_IMAGE:       IMAGE.METAL,
		NAME_TITLE_COLOR:       'white'
	},

	NATURE: {
		ID:                     'nature',
		COLOR_BOARD_LIGHT:      '#c7da61',
		COLOR_BOARD_DARK:       '#437149',
		COLOR_HIGHLIGHT_LIGHT:  '#9e93e1',
		COLOR_HIGHLIGHT_DARK:   '#7B68EE',
		COLOR_LAST_MOVE_LIGHT:  '#BB92AB',
		COLOR_LAST_MOVE_DARK:   '#905E7C',
		COLOR_UTILITY: {
			DESKTOP:            '#494949',
			MOBILE:             '#00000080',
		},
		BACKGROUND_IMAGE:       IMAGE.NATURE,
		NAME_TITLE_COLOR:       'white',
	},
});

export const DIALOG = Object.freeze({
	HIDE: 0,
	SHOW: 1,
	REQUEST_SHOW: 2,
	CLOSING: 3,
});

export const FRIEND = Object.freeze({
	REQUEST_SENT: 1,
	REQUEST_RECEIVED: 2,
	FRIENDED: 3,
});

export const NOTIFICATION_TYPE = Object.freeze({
	INFO: 1,
	FRIEND_REQUEST: 2,
	FRIEND_ACCEPTED: 3,
	CHALLENGE: 4,
});

export const MATCH_MODE = Object.freeze({
	COMPUTER: 1,
	FRIEND: 2,
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

export const STORAGE_IS_DARK_THEME = 'STORAGE_IS_DARK_THEME';
export const STORAGE_APP_CACHE = 'STORAGE_APP_CACHE';

export const THEME_ID = {
	CLASSIC: 0,
	WINTER: 1,
	METAL: 2,
	NATURE: 3,
};

export const TIME = {
	FIVE: 5 * 60,
	TEN: 10 * 60,
	FIFTEEN: 15 * 60,
	THIRTY: 30 * 60,
	INFINITE: 100 * 60,
};