import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { IMAGE, URL } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

export default function InvitePanel(props) {
	const theme = useSelector(state => state.theme);
	const [copiedModalVisible, showCopiedModal] = React.useState(false);
	const { game } = props;

	let btnStyle = {...styles.btn, ...{
		backgroundColor: theme.COLOR_BOARD_DARK,
		color: theme.COLOR_BOARD_LIGHT,
	}};

	let button = (
		<ButtonVibe
			disabled={ game == null }
			style={ btnStyle }
			onPress={ async () => {
				Clipboard.setString(URL.FRONTEND + '/game?match=' + game.match_id);
				showCopiedModal(true);
				// setTimeout(() => {
				// 	showCopiedModal(false);
				// }, 2000);
			} }>
			<AutoHeightImage width={ vw(5) } source={ IMAGE.INVITE }/>
			<TextVibe style={ [styles.btnText, styles.ml2] }>Invite</TextVibe>
		</ButtonVibe>
	);

	return (
		<View style={ props.style }>
			{ button }
			{ renderCopiedDialog(copiedModalVisible, showCopiedModal) }
		</View>
	);
}

function renderCopiedDialog(visible, setVisible) {
	return (
		<ModalVibe
			isVisible={ visible }
			onDismiss={ () => setVisible(false) }>
			<View style={ styles.squareBack }></View>
			<TextVibe style={ styles.text }>Invite Link Copied!</TextVibe>
			<ButtonVibe style={ styles.cancelBtn } onPress={ () => setVisible(false) }>
				<TextVibe style={ [styles.btnText, styles.black] }>Okay</TextVibe>
			</ButtonVibe>
		</ModalVibe>
	);
}

const styles = StyleSheet.create({

	btn: {
		flex: 1,
		marginRight: vw(0.5),
		flexDirection: 'row',
	},

		btnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
			paddingBottom: vw(),
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
