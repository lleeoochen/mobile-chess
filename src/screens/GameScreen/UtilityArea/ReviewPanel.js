import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { vw } from 'chessvibe/src/Util';
import { IMAGE } from 'chessvibe/src/Const';
import { ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

export default function ActionPanel(props) {
	const theme = useSelector(state => state.game.theme);
	const { gameRef, minimizeDrawer=() => {} } = props;
	const [ updateVersion, update ] = React.useState(0);
	const [ playing, setPlaying ] = React.useState(false);
	const { ChessReviewer } = gameRef || {};


	async function onFastBackwardClick() {
		await ChessReviewer.pausePlayback();
		setPlaying(true);

		await ChessReviewer.reviewMove(0);

		update(updateVersion + 1);
		setPlaying(false);
	}

	async function onBackwardClick() {
		await ChessReviewer.pausePlayback();
		setPlaying(false);

		await ChessReviewer.reviewMove(gameRef.moves_applied - 1);

		update(updateVersion + 1);
	}

	async function onForwardClick() {
		await ChessReviewer.pausePlayback();
		setPlaying(false);

		await ChessReviewer.reviewMove(gameRef.moves_applied + 1);

		update(updateVersion + 1);
	}

	async function onFastForwardClick() {
		await ChessReviewer.pausePlayback();
		setPlaying(true);

		await ChessReviewer.reviewMove(gameRef.match.moves.length - 1);

		update(updateVersion + 1);
		setPlaying(false);
	}

	async function onPlaybackClick() {
		if (playing) {
			setPlaying(false);
			await ChessReviewer.pausePlayback();
		}
		else {
			setPlaying(true);

			await ChessReviewer.reviewMove(gameRef.match.moves.length - 1, 700);

			setPlaying(false);
			update(updateVersion + 1);
		}
	}

	let buttons = [
		{
			image: IMAGE.FASTBACKWARD,
			disabled: playing || gameRef == null || gameRef.moves_applied <= 0,
			onPress: () => {
				minimizeDrawer();
				onFastBackwardClick();
			},
		},
		{
			image: IMAGE.BACKWARD,
			disabled: playing || gameRef == null || gameRef.moves_applied <= 0,
			onPress: () => {
				minimizeDrawer();
				onBackwardClick();
			},
		},
		{
			image: playing ? IMAGE.PAUSE : IMAGE.PLAY,
			onPress: () => {
				minimizeDrawer();
				onPlaybackClick();
			},
		},
		{
			image: IMAGE.FORWARD,
			disabled: playing || gameRef == null || gameRef.moves_applied >= gameRef.match.moves.length - 1,
			onPress: () => {
				minimizeDrawer();
				onForwardClick();
			},
		},
		{
			image: IMAGE.FASTFORWARD,
			disabled: playing || gameRef == null || gameRef.moves_applied >= gameRef.match.moves.length - 1,
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
				onPress={ onPress }
				useGestureButton={ Platform.OS === 'android' }>
				<AutoHeightImage width={ vw(5) } source={ image }/>
			</ButtonVibe>
		);
	});

	return (
		<Animated.View style={ props.style }>
			{ buttons }
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	btn: {
		flex: 1,
		marginRight: vw(0.5),
		width: vw(20 - 4 / 5),
	},
});
