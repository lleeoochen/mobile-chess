import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { updateBoardPieces, updateTheme } from 'chessvibe/src/redux/Reducer';
import { WebVibe, ActionBar } from 'chessvibe/src/widgets';
import { URL, REDUX, THEME_WINTER, THEME_CLASSIC } from 'chessvibe/src/Const';
import { vw, vh } from 'chessvibe/src/Util';
import store from 'chessvibe/src/redux/Store';

import BaseBoard from './_BaseBoard';
import BackImage from './_BackImage';

var back_img = require('chessvibe/assets/back.png');
var theme_img = require('chessvibe/assets/palette.png');

// Navigation
GameScreen.navigationOptions = ({ navigation }) => {
	const { params = {} } = navigation.state;
	return ActionBar('Match', back_img, params.goBack, theme_img, params.changeTheme);
};

// Game Screen
export default function GameScreen(props) {
	let webref = React.useRef(null);
	let match_id = props.navigation.getParam('match');
	const dispatch = useDispatch();

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			goBack: () => {
				// props.navigation.goBack();
				dispatch(updateBoardPieces( ['piece'] ));
			},
			changeTheme: () => {
				let theme = store.getState().theme;
				dispatch(updateTheme( theme == THEME_WINTER ? THEME_CLASSIC : THEME_WINTER ));
			},
		});
	}, []);

	// Render
	function render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar hidden={ true }/>

				<BackImage style={ styles.outerCanvas }>
					<BaseBoard style={ styles.baseBoard }/>
					<View></View>
					<View></View>
				</BackImage>
			</SafeAreaView>
		);
	}

	// ====================== Functions ======================

	//Intialize chessboard background
	function initBoard() {
		for (var x = 0; x < BOARD_SIZE; x++) {
			for (var y = 0; y < BOARD_SIZE; y++) {
				//Grid instance
				chessboard[x][y] = new Grid(x, y, -1, null);

				//Grid Background
				let backgroundGrid = document.createElement("div");
				backgroundGrid.setAttribute("class", "grid x" + x + " y" + y);
				canvasLayer.append(backgroundGrid);
				background[x][y] = backgroundGrid;

				//Grid Listener for onclick event
				let gridListener = document.createElement("div");
				gridListener.setAttribute("class", "grid x" + x + " y" + y);
				gridListener.setAttribute("style", `z-index: 10;`);
				gridListener.setAttribute("onClick", `onClick(event, ${x}, ${y})`);
				gridsLayer.append(gridListener);
			}
		}

		for (var x = 0; x < BOARD_SIZE; x++) {
			for (var y = 0; y < BOARD_SIZE; y++) {
				fillNumbering(x, y);
			}
		}
	}

	// ====================== Redux Functions ======================

	// Render
	return render();
}

const margin_size = vw(1);
const cell_size = (vw(100) - 4 * margin_size) / 8;
const canvas_size = margin_size * 2 + cell_size * 8;

const styles = StyleSheet.create({
	outerCanvas: {
		flex: 1,
		height: canvas_size,
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
	},
	baseBoard: {
		width: canvas_size,
		height: canvas_size,
		borderColor: 'white',
		borderWidth: margin_size,
	}
});
