import { THEME, TEAM, STORAGE_IS_DARK_THEME } from 'chessvibe/src/Const';
import Storage from 'chessvibe/src/Storage';

// Initial store state
const initState = {
	game: {
		chessboard: [[], [], [], [], [], [], [], []],
		baseboard: [[], [], [], [], [], [], [], []],
	},
	theme: THEME.METAL,
	blackPlayer: null,
	whitePlayer: null,

	user: null,
	isDarkTheme: false,
};



// Home Action Reducers
export const HomeReducer = {
	updateUser: createReducer((state, data) => {
		return {...state, ...{ user: data }};
	}),
	setIsDarkTheme: createReducer((state, data) => {
		return {...state, ...{ isDarkTheme: data }};
	}),
};

// Game Action Reducers
export const GameReducer = {
	initGame: createReducer((state, data) => {
		let game = { ...state.game, ...data };
		return { ...state, game: game };
	}),
	reset: createReducer((state, data) => {
		state.game = initState.game;
		state.theme = initState.theme;
		state.blackPlayer = initState.blackPlayer;
		state.whitePlayer = initState.whitePlayer;
		return { ...state };
	}),
	updateTheme: createReducer((state, data) => {
		return {...state, ...{ theme: data }};
	}),
	updatePlayer: createReducer((state, data) => {
		return {...state, ...data};
	}),
};



// App Reducer
export default function Reducer(state = initState, action) {
	const AppReducer = {
		home: HomeReducer,
		game: GameReducer,
	};

	if (action.reduce) {
		return action.reduce(state, action.data);
	}
	return state;
}



// Action helper
function createReducer(reduce) {
	return function (data) {
		return { type: '', data, reduce };
	};
}
