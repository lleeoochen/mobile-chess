import * as React from 'react';
import { StatusBar, SafeAreaView, StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { StackActions } from 'react-navigation';
import Animated from 'react-native-reanimated'
import { isIphoneX, getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { ActionBar } from 'chessvibe/src/widgets';

import Store, { GameStore } from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';

import { THEME, TEAM, IMAGE, MAX_TIME } from 'chessvibe/src/Const';
import Util, { vw, vh } from 'chessvibe/src/Util';

import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/GameBackend';
import { BaseBoard, BaseBorder } from './BaseBoard';
import ChessBoard from './ChessBoard';
import ClickBoard from './ClickBoard';
import BackImage from './BackImage';
import UtilityArea from './UtilityArea';

import Game from './Game';
import GameAI from './Game/GameAI';

// Navigation
GameScreen.navigationOptions = ({ navigation }) => {
	const { params = {} } = navigation.state;
	return ActionBar('Match', 'BACK', params.goBack, 'THEME', params.changeTheme, params.isDarkTheme);
};

// Game Screen
export default function GameScreen(props) {
	const isDarkTheme = useSelector(state => state.isDarkTheme);

	let [game, setGame] = React.useState(null);
	let match_id = props.navigation.getParam('match');
	let fall = new Animated.Value(1);
	const isMountedRef = React.useRef(null);

	// Mount
	React.useEffect(() => {
		isMountedRef.current = true;

		GameStore.updateTheme(Util.unpackTheme(Cache.theme[match_id]));

		Backend.init();

		props.navigation.setParams({
			isDarkTheme: isDarkTheme,
			goBack: () => {
				if (game)
					game.ends();
				GameStore.reset();
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
				GameStore.updateTheme(theme);
			},
		});

		// Initialize game
		Backend.listenMatch(Cache.userID, match_id, async (match, team) => {
			if (!game) {
				// Logic to choose between Game and GameAI
				if (match.white == 'AI')
					game = new GameAI(team, match_id, match, isMountedRef);
				else
					game = new Game(team, match_id, match, isMountedRef);

				setGame(game);

				if (isMountedRef.current) {
					GameStore.updatePlayer({
						blackPlayer: Cache.users[match.black],
						whitePlayer: Cache.users[match.white],
					});
					GameStore.initGame(game);
				}

				await new Promise((resolve, reject) => {
					setTimeout(() => { resolve() }, 500);
				});
			}
			else {
				game.firstLoad = false;
			}

			game.match = match;

			if (isMountedRef.current) {
				GameStore.initGame(game);
				GameStore.updateTheme(Util.unpackTheme(match.theme));
			}

			await game.updatePlayerData(match);

			// updateMatchChat();

			// updateUtilityButtons();

			if (match.moves.length > 0 && Util.gameFinished(match)) {
				clearInterval(game.interval);

				// Game just ended
				if (!game.firstLoad) {
					props.navigation.state.params.refresh();
				}

				game.ends();
				if (isMountedRef.current) {
					GameStore.initGame(game);
				}
				return false;
			}

			if (!game.started && match.white && match.black) {
				props.navigation.state.params.refresh();
				game.started = true;
			}

			// updateMatchUndo();

			// updateMatchDraw();


			let timerEnable = match.black_timer < MAX_TIME && match.white_timer < MAX_TIME;
			if (match.black && match.white && timerEnable) {
				game.updateMatchTimer(match);
			}

			await game.updateMatchMoves(match);
		});

		return () => isMountedRef.current = false;
	}, [isDarkTheme]);

	function handleChessEvent(x, y) {
		if (game) {
			game.handleChessEvent(x, y);
		}
	}

	const animatedShadowOpacity = fall.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 1],
	});

	var isIOS = Platform.OS === 'ios';
	var topSpace = isIOS ? getStatusBarHeight() : 0;
	var bottomSpace = isIOS ? getBottomSpace() : 0;
	var offset = vw(15);

	if (isIOS) {
		if (isIphoneX()) {
			offset = vw(10);
		}
		else {
			offset = vw(9.7);
		}
	}

	const keyboardOffset = topSpace + offset + bottomSpace;

	// Render
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS == "ios" ? "padding" : "height"}
			keyboardVerticalOffset={ keyboardOffset }
			style={styles.container}>

			<StatusBar hidden={ true }/>
			<SafeAreaView style={{ flex: 1 }}>

				<BackImage>
					<Animated.View style={ [{ flex: 1, opacity: animatedShadowOpacity }] }>
						<ScrollView contentContainerStyle={ styles.outerCanvas }>
							<BaseBorder style={ styles.gradient }/>
							<BaseBoard/>
							<ChessBoard style={ styles.board }/>
							<ClickBoard style={ styles.board } onPress={ handleChessEvent }/>
						</ScrollView>
					</Animated.View>
					<UtilityArea
						isDarkTheme={ isDarkTheme }
						style={ styles.utilityArea }
						callbackNode={ fall }
						gameRef={ game }/>
				</BackImage>

			</SafeAreaView>
		</KeyboardAvoidingView>
	);
}



const margin_size = vw(1);
const cell_size = (vw(100) - 4 * margin_size) / 8;
const canvas_size = margin_size * 2 + cell_size * 8;
const borderRadius = vw();


const handle_height = 20 + vw(3);
const panel_height = vw(12);
const header_height = panel_height + handle_height;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

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
	},
	utilityArea: {
		height: panel_height,
		// marginHorizontal: vw(),
		backgroundColor: 'black',
	},
	shadowContainer: {
		backgroundColor: 'white',
		position: 'absolute',
		flex: 1,
		width: vw(100),
		height: vh(100),
	},
});
