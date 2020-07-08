import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { IMAGE } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

export default function ActionPanel(props) {
	const theme = useSelector(state => state.theme);
	const game = useSelector(state => state.game); // for updating purpose
	const { gameRef, minimizeDrawer=() => {} } = props;
	const [updated, update] = React.useState(false);
	const [playing, setPlaying] = React.useState(false);


	async function onFastBackwardClick() {
		await gameRef.pausePlayback();

		gameRef.stopPlayBack = false;
		await gameRef.reviewMove(0);
		gameRef.stopPlayBack = true;
		update(true);
	}

	async function onBackwardClick() {
		await gameRef.pausePlayback();

		gameRef.stopPlayBack = false;
		await gameRef.reviewMove(gameRef.moves_applied - 1);
		gameRef.stopPlayBack = true;
		update(true);
	}

	async function onForwardClick() {
		await gameRef.pausePlayback();

		gameRef.stopPlayBack = false;
		await gameRef.reviewMove(gameRef.moves_applied + 1);
		gameRef.stopPlayBack = true;
		update(true);
	}

	async function onFastForwardClick() {
		await gameRef.pausePlayback();

		gameRef.stopPlayBack = false;
		await gameRef.reviewMove(gameRef.match.moves.length - 1);
		gameRef.stopPlayBack = true;
		update(true);
	}

	async function onPlaybackClick() {
		if (gameRef.playingBack.get()) {
			setPlaying(false);
			await gameRef.pausePlayback();
			return;
		}

		setPlaying(true);

		gameRef.stopPlayBack = false;
		await gameRef.reviewMove(gameRef.match.moves.length - 1, 700);
		gameRef.stopPlayBack = true;
		update(true);

		setPlaying(false);
	}


	let buttons = [
		{
			image: IMAGE.FASTBACKWARD,
			disabled: gameRef == null || gameRef.moves_applied <= 0,
			onPress: () => {
				minimizeDrawer();
				onFastBackwardClick();
			},
		},
		{
			image: IMAGE.BACKWARD,
			disabled: gameRef == null || gameRef.moves_applied <= 0,
			onPress: () => {
				minimizeDrawer();
				onBackwardClick();
			},
		},
		{
			image: playing ? IMAGE.PAUSE : IMAGE.PLAY,
			disabled: gameRef == null || gameRef.moves_applied >= gameRef.match.moves.length - 1,
			onPress: () => {
				minimizeDrawer();
				onPlaybackClick();
			},
		},
		{
			image: IMAGE.FORWARD,
			disabled: gameRef == null || gameRef.moves_applied >= gameRef.match.moves.length - 1,
			onPress: () => {
				minimizeDrawer();
				onForwardClick();
			},
		},
		{
			image: IMAGE.FASTFORWARD,
			disabled: gameRef == null || gameRef.moves_applied >= gameRef.match.moves.length - 1,
			onPress: () => {
				minimizeDrawer();
				onFastForwardClick();
			},
		},
	];

	buttons = buttons.map((button, index) => {
		let { image, disabled, onPress } = button;
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
				<AutoHeightImage width={ vw(5) } source={ image }/>
			</ButtonVibe>
		);
	});

	return (
		<View style={ props.style }>
			{ buttons }
		</View>
	);
}

const styles = StyleSheet.create({
	btn: {
		flex: 1,
		marginRight: vw(0.5),
	},

		btnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
		},
});
