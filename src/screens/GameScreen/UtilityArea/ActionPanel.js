import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { TEAM, MAX_TIME, DB_REQUEST_ASK, DIALOG } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe, DialogVibe } from 'chessvibe/src/widgets';
import Backend from 'chessvibe/src/GameBackend';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

export default function ActionPanel(props) {
	const { theme, whitePlayer, blackPlayer, setResignState } = props;
	const game = useSelector(state => state.game);
	const { minimizeDrawer=() => {} } = props;
	const modeAI = game != null && game.modeAI;

	function askDraw() {
		Backend.askDraw();
	}

	function askMercy() {
		Backend.askUndo();
	}

	function addTime() {
		let { team, match } = game;

		if (team == TEAM.W) {
			game.black_timer += 16;
			Backend.updateTimer(match.black_timer + 15, match.white_timer);
		}
		else {
			game.white_timer += 16;
			Backend.updateTimer(match.black_timer, match.white_timer + 15);
		}
	}


	// Undo button enable/disable
	let undoDisabled = game == null || game.match == null;

	if (!undoDisabled) {
		let { turn, team, match } = game;
		undoDisabled = (
			match.moves.length == 0 ||
			turn == team ||
			(team == TEAM.B && match.black_undo == DB_REQUEST_ASK) ||
			(team == TEAM.W && match.white_undo == DB_REQUEST_ASK)
		);
	}

	// Draw button enable/disable
	let drawDisabled = game == null || game.match == null;

	if (!drawDisabled) {
		let { team, match } = game;
		drawDisabled = (
			(team == TEAM.B && match.black_draw == DB_REQUEST_ASK) ||
			(team == TEAM.W && match.white_draw == DB_REQUEST_ASK)
		);
	}

	// Configure action buttons
	let buttons = [
		{
			text: 'Resign',
			disabled: game == null,
			onPress: () => {
				setResignState(DIALOG.REQUEST_SHOW);
				minimizeDrawer();
			},
		},
		{
			text: 'Draw',
			disabled: drawDisabled || modeAI,
			onPress: () => {
				askDraw();
			},
		},
		{
			text: 'Mercy',
			disabled: undoDisabled || modeAI,
			onPress: () => {
				askMercy();
			},
		},
		{
			text: '+15 sec',
			disabled: game == null || modeAI || game.black_timer >= MAX_TIME || game.white_timer >= MAX_TIME,
			onPress: () => {
				addTime();
			},
		},
	];

	// Render action buttons
	buttons = buttons.map((button, index) => {
		let { text, disabled, onPress } = button;

		let btnStyle = {...styles.btn, ...{
			backgroundColor: theme.COLOR_BOARD_DARK + (disabled ? 'a6' : ''),
			color: theme.COLOR_BOARD_LIGHT,
		}};

		return (
			<ButtonVibe
				key={ index }
				disabled={ disabled }
				style={ btnStyle }
				useGestureButton={ Platform.OS === "android" }
				onPress={ onPress }>
				<TextVibe style={ styles.btnText }> { text } </TextVibe>
			</ButtonVibe>
		);
	});

	// console.log(resignState);
	return (
		<Animated.View style={ props.style }>
			{ buttons }
		</Animated.View>
	);
}




const styles = StyleSheet.create({

	btnContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingHorizontal: vw(2),
		backgroundColor: 'darkslategrey',
	},

		btn: {
			flex: 1,
			marginRight: vw(0.5),
			width: vw(25 - 3.5 / 4),
		},

			btnText: {
				fontSize: vw(5),
				textAlign: 'center',
				color: 'white',
			},

			cancelBtn: {
				backgroundColor: 'white',
				paddingVertical: vw(),
				paddingHorizontal: vw(3),
				margin: vw(),
			},

			confirmBtn: {
				backgroundColor: '#57bf69',
				paddingVertical: vw(),
				paddingHorizontal: vw(3),
				margin: vw(),
				fontWeight: 'bold',
			},

	text: {
		fontSize: vw(5),
		textAlign: 'center',
		color: 'white',
		backgroundColor: 'darkslategrey',
		paddingHorizontal: vw(2),
		marginBottom: vw(5),
	},

	black: {
		color: 'black',
	},
});
