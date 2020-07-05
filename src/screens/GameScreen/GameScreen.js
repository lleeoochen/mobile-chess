import * as React from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { StackActions } from 'react-navigation';

import { initGame, updateTheme, reset } from 'chessvibe/src/redux/Reducer';
import { ActionBar } from 'chessvibe/src/widgets';
import Store from 'chessvibe/src/redux/Store';
import { THEME, TEAM } from 'chessvibe/src/Const';
import Util, { vw } from 'chessvibe/src/Util';

import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/GameBackend';
import BaseBorder from './_BaseBorder';
import BaseBoard from './_BaseBoard';
import ChessBoard from './_ChessBoard';
import ClickBoard from './_ClickBoard';
import BackImage from './_BackImage';
import Game from './Game';

var back_img = require('chessvibe/assets/back.png');
var theme_img = require('chessvibe/assets/palette.png');

// Navigation
GameScreen.navigationOptions = ({ navigation }) => {
	const { params = {} } = navigation.state;
	return ActionBar('Match', back_img, params.goBack, theme_img, params.changeTheme);
};

// Game Screen
export default function GameScreen(props) {
	let gameRef = React.useRef(null);
	let match_id = props.navigation.getParam('match');

	// Mount
	React.useEffect(() => {
		Store.dispatch(updateTheme( Util.unpackTheme(Cache.theme[match_id]) ));

		let game = gameRef.current;
		Backend.init();

		props.navigation.setParams({
			goBack: () => {
				if (game)
					game.ends();
				Store.dispatch(reset());
				Backend.socket.disconnect();
				props.navigation.dispatch(StackActions.pop());
			},
			changeTheme: () => {
				let theme = Store.getState().theme;
				if (theme == THEME.CLASSIC) theme = THEME.WINTER;
				else if (theme == THEME.WINTER) theme = THEME.METAL;
				else if (theme == THEME.METAL) theme = THEME.NATURE;
				else if (theme == THEME.NATURE) theme = THEME.CLASSIC;

				Backend.changeTheme( theme );

				Cache.theme[match_id] = Util.packTheme(theme);
				Store.dispatch(updateTheme( theme ));
			},
		});

		// Initialize game
		Backend.listenMatch(Cache.userID, match_id, async (match, team) => {
			if (!game) {
				gameRef.current = new Game(team);
				game = gameRef.current;
				Store.dispatch(initGame(game));
			}

			Store.dispatch(updateTheme( Util.unpackTheme(match.theme) ));

			// await game.updatePlayerData();

			// updateMatchChat();

			// updateUtilityButtons();

			if (match.moves.length > 0 && Util.gameFinished(match)) {
				clearInterval(game.interval);

				// showHtml('#invite-panel', false);
				// showHtml('#game-panel', false);
				// showHtml('#theme-panel', false);
				// showHtml('#review-panel', true);
				// updateReviewButtons();
				// showEnding();
				return false;
			}

			// if (first_load) {
			// 	await new Promise((resolve, reject) => {
			// 		setTimeout(() => { resolve() }, 500);
			// 	});
			// 	first_load = false;
			// }

			await game.updateMatchMoves(match);

			// updateMatchUndo();
			
			// updateMatchDraw();

			// if (match.black && match.white && game.timer_enable) {
			if (match.black && match.white) {
				game.updateMatchTimer(match);
			}
		});
	}, []);

	function handleChessEvent(x, y) {
		if (gameRef.current) {
			gameRef.current.handleChessEvent(x, y);
		}
	}

	// Render
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<StatusBar hidden={ true }/>

			<BackImage style={ styles.outerCanvas }>
				<BaseBorder style={ styles.gradient }/>
				<BaseBoard style={ styles.board }/>
				<ChessBoard style={ styles.board }/>
				<ClickBoard style={ styles.board } onPress={ handleChessEvent }/>
			</BackImage>
		</SafeAreaView>
	);
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
	board: {
		width: canvas_size,
		height: canvas_size,
		position: 'absolute',
		borderWidth: margin_size,
		borderColor: 'transparent',
	},
	gradient: {
		width: canvas_size,
		height: canvas_size,
	}
});
