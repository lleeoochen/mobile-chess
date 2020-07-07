import * as React from 'react';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { IMAGE, URL } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe, KeyboardVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

const header_height = 70;
const handle_height = 20 + vw(3);
const panel_height = header_height - handle_height;

export default function ChatSection(props) {
	const theme = useSelector(state => state.theme);
	const [ value, onChangeText ] = React.useState('');
	const contentRef = React.useRef();
	const { game } = props;

	let colorLight = { backgroundColor: theme.COLOR_BOARD_LIGHT };
	let colorDark = { backgroundColor: theme.COLOR_BOARD_DARK };
	let colorBlack = { backgroundColor: 'black' };

	return (
		<View style={ [props.style] }>
			<View style={ styles.chatDivider }/>
			<ScrollView
				ref={ contentRef }
				contentContainerStyle={ styles.chatContent }
				onContentSizeChange={() => contentRef.current.scrollToEnd({animated: true})}>
			</ScrollView>
			<View style={ styles.chatDivider }/>
			<View style={ [styles.chatBottom, colorBlack] }>
				<TextInput
					style={ styles.chatInput }
					onChangeText={ text => onChangeText(text) }
					keyboardAppearance={ 'dark' }
					placeholder={ 'Type here...' }
					placeholderTextColor={ 'grey' }
					returnKeyType={ 'send' }
					value={value}/>
				<ButtonVibe style={ [styles.chatSend, colorBlack] }>
					<AutoHeightImage width={ vw(7) } source={IMAGE.SEND}/>
				</ButtonVibe>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	chatContent: {
		paddingHorizontal: vw(2),
	},

	chatMessage: {
		color: 'black',
		fontSize: vw(5),
	},

	chatDivider: {
		height: vw(2),
		width: '100%',
	},

	chatBottom: {
		flexDirection: 'row',
		alignItems: 'center',
		height: panel_height + vw(),
		borderBottomLeftRadius: borderRadius,
		borderBottomRightRadius: borderRadius,
	},

		chatInput: {
			flex: 1,
			fontSize: vw(5),
			fontFamily: 'Spectral',
			color: 'black',
			backgroundColor: 'white',
			borderColor: 'gray',
			marginTop: vw(),
			padding: vw(2),
			borderBottomLeftRadius: borderRadius,
			// borderBottomRightRadius: borderRadius,
		},

		chatSend: {
			width: vw(15),
			height: panel_height - vw(),
			borderRadius: 0,
		},
});
