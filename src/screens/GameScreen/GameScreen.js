import * as React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';

import { initGame, updateTheme } from 'chessvibe/src/redux/Reducer';
import { ActionBar } from 'chessvibe/src/widgets';
import Store from 'chessvibe/src/redux/Store';
import { THEME, TEAM } from 'chessvibe/src/Const';
import { vw } from 'chessvibe/src/Util';

import BaseBoard from './_BaseBoard';
import ChessBoard from './_ChessBoard';
import ClickBoard from './_ClickBoard';
import BackImage from './_BackImage';
import Game from './Game';

var back_img = require('chessvibe/assets/back.png');
var theme_img = require('chessvibe/assets/palette.png');
var game;

// Navigation
GameScreen.navigationOptions = ({ navigation }) => {
	const { params = {} } = navigation.state;
	return ActionBar('Match', back_img, params.goBack, theme_img, params.changeTheme);
};

// Game Screen
export default function GameScreen(props) {
	let webref = React.useRef(null);
	let match_id = props.navigation.getParam('match');

	// Mount
	React.useEffect(() => {
		props.navigation.setParams({
			goBack: () => {
				// props.navigation.goBack();
				console.log(Store.getState().game.chessboard[0][4]);
				console.log(Store.getState().game.chessboard[0][6]);
				// console.log(Store.getState());
			},
			changeTheme: () => {
				let theme = Store.getState().theme;
				if (theme == THEME.CLASSIC) theme = THEME.WINTER;
				else if (theme == THEME.WINTER) theme = THEME.METAL;
				else if (theme == THEME.METAL) theme = THEME.NATURE;
				else if (theme == THEME.NATURE) theme = THEME.CLASSIC;

				Store.dispatch(updateTheme( theme ));
			},
		});

		// Initialize game
		game = new Game(TEAM.B);
		Store.dispatch(initGame(game));
	}, []);

	function handleChessEvent(x, y) {
		if (game) {
			game.handleChessEvent(x, y);
		}
	}

	// Render
	function render() {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<StatusBar hidden={ true }/>

				<BackImage style={ styles.outerCanvas }>
					<BaseBoard style={ styles.baseBoard }/>
					<ChessBoard style={ styles.baseBoard }/>
					<ClickBoard style={ styles.baseBoard } onPress={ handleChessEvent }/>
				</BackImage>
			</SafeAreaView>
		);
	}

	// ====================== Functions ======================


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
		position: 'absolute'
	}
});
