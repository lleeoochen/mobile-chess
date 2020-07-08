import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { TEAM, MAX_TIME } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe, DialogVibe } from 'chessvibe/src/widgets';
import Backend from 'chessvibe/src/GameBackend';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

export default function ActionPanel(props) {
	const theme = useSelector(state => state.theme);
	const { gameRef, minimizeDrawer=() => {} } = props;

	const [resignModalVisible, showResignModal] = React.useState(false);
	const [drawModalVisible, showDrawModal] = React.useState(false);
	const [mercyModalVisible, showMercyModal] = React.useState(false);

	let buttons = [
		{
			text: 'Resign',
			disabled: gameRef == null,
			onPress: () => {
				showResignModal(true);
				minimizeDrawer();
			},
		},
		{
			text: 'Draw',
			disabled: gameRef == null,
			onPress: () => {
				showDrawModal(true);
				minimizeDrawer();
			},
		},
		{
			text: 'Mercy',
			disabled: gameRef == null,
			onPress: () => {
				showMercyModal(true);
				minimizeDrawer();
			},
		},
		{
			text: '+15 sec',
			disabled: gameRef == null || gameRef.black_timer >= MAX_TIME || gameRef.white_timer >= MAX_TIME,
			onPress: () => {
				let { my_team, match } = gameRef;

				if (my_team == TEAM.W) {
					gameRef.black_timer += 16;
					Backend.updateTimer(match.black_timer + 15, match.white_timer);
				}
				else {
					gameRef.white_timer += 16;
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

			<DialogVibe
				title={ 'Are you sure you want to resign match?' }
				confirmBtnText={ 'Resign Match' }
				theme={ theme }
				visible={ resignModalVisible }
				onDismiss={ () => showResignModal(false) }
				onSuccess={ () => showResignModal(false) }/>

			<DialogVibe
				title={ 'is asking for a draw. Confirm?' }
				confirmBtnText={ 'Draw Match' }
				theme={ theme }
				visible={ drawModalVisible }
				onDismiss={ () => showDrawModal(false) }
				onSuccess={ () => showDrawModal(false) }/>

			<DialogVibe
				title={ 'is asking for your mercy.' }
				confirmBtnText={ 'Undo Move' }
				theme={ theme }
				visible={ mercyModalVisible }
				onDismiss={ () => showMercyModal(false) }
				onSuccess={ () => showMercyModal(false) }/>
		</View>
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
