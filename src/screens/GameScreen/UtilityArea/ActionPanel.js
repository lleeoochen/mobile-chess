import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { TEAM } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe } from 'chessvibe/src/widgets';
import Backend from 'chessvibe/src/GameBackend';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

export default function ActionPanel(props) {
	const theme = useSelector(state => state.theme);
	const [resignModalVisible, showResignModal] = React.useState(false);
	const [drawModalVisible, showDrawModal] = React.useState(false);
	const [mercyModalVisible, showMercyModal] = React.useState(false);
	const { game } = props;

	let buttons = [
		{
			text: 'Resign',
			disabled: game == null,
			onPress: () => {
				showResignModal(true);
			},
		},
		{
			text: 'Draw',
			disabled: game == null,
			onPress: () => {
				showDrawModal(true);
			},
		},
		{
			text: 'Mercy',
			disabled: game == null,
			onPress: () => {
				showMercyModal(true);
			},
		},
		{
			text: '+15 sec',
			disabled: game == null,
			onPress: () => {
				let { my_team, match } = game;

				if (my_team == TEAM.W) {
					game.black_timer += 16;
					Backend.updateTimer(match.black_timer + 15, match.white_timer);
				}
				else {
					game.white_timer += 16;
					Backend.updateTimer(match.black_timer, match.white_timer + 15);
				}
			},
		},
	];

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
				onPress={ onPress }>
				<TextVibe style={ styles.btnText }> { text } </TextVibe>
			</ButtonVibe>
		);
	});

	return (
		<View style={ props.style }>
			{ buttons }
			{ renderResignDialog(resignModalVisible, showResignModal) }
			{ renderDrawDialog(drawModalVisible, showDrawModal) }
			{ renderMercyDialog(mercyModalVisible, showMercyModal) }
		</View>
	);
}

function renderResignDialog(visible, setVisible) {
	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ () => setVisible(false) }>
			<View style={ styles.squareBack }></View>

			<TextVibe style={ styles.text }>Are you sure you want to resign match?</TextVibe>
			<View style={ styles.btnContainer }>
				<ButtonVibe style={ styles.cancelBtn } onPress={ () => setVisible(false) }>
					<TextVibe style={ [styles.btnText, styles.black] }>Cancel</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.confirmBtn }>
					<TextVibe style={ [styles.btnText, styles.black] }>Resign Match</TextVibe>
				</ButtonVibe>
			</View>

		</ModalVibe>
	);
}

function renderDrawDialog(visible, setVisible) {
	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ () => setVisible(false) }>
			<View style={ styles.squareBack }></View>

			<TextVibe style={ styles.text }>is asking for a draw. Confirm?</TextVibe>
			<View style={ styles.btnContainer }>
				<ButtonVibe style={ styles.cancelBtn } onPress={ () => setVisible(false) }>
					<TextVibe style={ [styles.btnText, styles.black] }>Cancel</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.confirmBtn }>
					<TextVibe style={ [styles.btnText, styles.black] }>Draw Match</TextVibe>
				</ButtonVibe>
			</View>
		</ModalVibe>
	);
}

function renderMercyDialog(visible, setVisible) {
	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ () => setVisible(false) }>
			<View style={ styles.squareBack }></View>

			<TextVibe style={ styles.text }>is asking for your mercy.</TextVibe>
			<View style={ styles.btnContainer }>
				<ButtonVibe style={ styles.cancelBtn } onPress={ () => setVisible(false) }>
					<TextVibe style={ [styles.btnText, styles.black] }>Cancel</TextVibe>
				</ButtonVibe>
				<ButtonVibe style={ styles.confirmBtn }>
					<TextVibe style={ [styles.btnText, styles.black] }>Undo Move</TextVibe>
				</ButtonVibe>
			</View>
		</ModalVibe>
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
		fontSize: vw(7),
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
