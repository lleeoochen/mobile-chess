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
	const { gameRef, minimizeDrawer=() => {} } = props;

	let buttons = [
		{
			image: IMAGE.FASTBACKWARD,
			disabled: gameRef == null,
			onPress: () => {
				minimizeDrawer();
			},
		},
		{
			image: IMAGE.BACKWARD,
			disabled: gameRef == null,
			onPress: () => {
				minimizeDrawer();
			},
		},
		{
			image: IMAGE.PLAY,
			disabled: gameRef == null,
			onPress: () => {
				minimizeDrawer();
			},
		},
		{
			image: IMAGE.FORWARD,
			disabled: gameRef == null,
			onPress: () => {
				minimizeDrawer();
			},
		},
		{
			image: IMAGE.FASTFORWARD,
			disabled: gameRef == null,
			onPress: () => {
				minimizeDrawer();
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
