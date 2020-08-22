import { shallowEqual } from 'react-redux';
import { THEME, TEAM, STORAGE_IS_DARK_THEME } from 'chessvibe/src/Const';
import Storage from 'chessvibe/src/Storage';

// Initial store state
const initState = {
	home: {
		user: null,
		isDarkTheme: false,
		toLogout: false,
	},
	game: {
		chessboard: [[], [], [], [], [], [], [], []],
		baseboard: [[], [], [], [], [], [], [], []],
		theme: THEME.METAL,
		blackPlayer: null,
		whitePlayer: null,
	},
	popup: {
		profile: null,
	},
};



// Home Action Reducers
export const HomeReducer = {
	updateUser: createReducer((state, data) => {
		let home = { ...state.home, ...{ user: data } };
		return { ...state, ...{ home } };
	}),
	setIsDarkTheme: createReducer((state, data) => {
		let home = { ...state.home, ...{ isDarkTheme: data } };
		return { ...state, ...{ home } };
	}),
	toLogout: createReducer((state, data) => {
		let home = { ...state.home, ...{ toLogout: data } };
		return { ...state, ...{ home } };
	}),
};

// Game Action Reducers
export const GameReducer = {
	initGame: createReducer((state, data) => {
		let game = { ...state.game, ...data };
		return { ...state, ...{ game } };
	}),
	reset: createReducer((state, data) => {
		state.game = initState.game;
		return { ...state };
	}),
	updateTheme: createReducer((state, data) => {
		let game = { ...state.game, ...{ theme: data } };
		return { ...state, ...{ game } };
	}),
	updatePlayer: createReducer((state, data) => {
		let game = { ...state.game, ...data };
		return { ...state, ...{ game } };
	}),
};

// Game Popup Reducers
export const PopupReducer = {
	openProfile: createReducer((state, data) => {
		let popup = { ...state.popup, ...{ profile: data } };
		return { ...state, ...{ popup } };
	}),
	closeProfile: createReducer((state) => {
		let popup = { ...state.popup, ...{ profile: null } };
		return { ...state, ...{ popup } };
	}),
};



// App Reducer
export default function Reducer(state = initState, action) {
	const AppReducer = {
		home: HomeReducer,
		game: GameReducer,
		popup: PopupReducer,
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
