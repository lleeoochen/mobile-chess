import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { IMAGE, URL, DIALOG } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

export default function InvitePanel(props) {
	const theme = useSelector(state => state.game.theme);
	const { gameRef, setInviteState, minimizeDrawer=() => {} } = props;

	let btnStyle = {...styles.btn, ...{
		backgroundColor: theme.COLOR_BOARD_DARK,
		color: theme.COLOR_BOARD_LIGHT,
	}};

	let button = (
		<ButtonVibe
			disabled={ gameRef == null }
			style={ btnStyle }
			useGestureButton={ Platform.OS === "android" }
			onPress={ async () => {
				Clipboard.setString(URL.FRONTEND + '/game?match=' + gameRef.match_id);
				setInviteState(DIALOG.REQUEST_SHOW);
				minimizeDrawer();
			} }>
			<AutoHeightImage width={ vw(5) } source={ IMAGE.INVITE }/>
			<TextVibe style={ [styles.btnText, styles.ml2] }>Invite</TextVibe>
		</ButtonVibe>
	);

	return (
		<Animated.View style={ props.style }>
			{ button }
		</Animated.View>
	);
}

const styles = StyleSheet.create({

	btn: {
		flex: 1,
		marginRight: vw(0.5),
		flexDirection: 'row',
		width: vw(98),
	},

		btnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
			paddingBottom: Platform.OS === 'android' ? vw() : 0,
		},

		ml2: {
			marginLeft: vw(2),
		},

		cancelBtn: {
			backgroundColor: 'white',
			paddingVertical: vw(),
			paddingHorizontal: vw(3),
			margin: vw(),
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
