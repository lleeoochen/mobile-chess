import { createStore } from 'redux';
import Reducer, { HomeReducer, GameReducer, PopupReducer } from './Reducer';

var Store = createStore(Reducer);

function makeDispatch(reducer) {
	let store = {};
	for (let name in reducer) {
		store[name] = (data) => {
			Store.dispatch(reducer[name](data));
		};
	}
	return store;
}

export const HomeStore = makeDispatch(HomeReducer);
export const GameStore = makeDispatch(GameReducer);
export const PopupStore = makeDispatch(PopupReducer);
export default Store;
