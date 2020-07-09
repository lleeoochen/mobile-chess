import * as React from 'react';
import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import Util, { vw, vh, strict_equal } from 'chessvibe/src/Util';
import { IMAGE, URL, DIALOG } from 'chessvibe/src/Const';
import { TextVibe, ButtonVibe, ModalVibe, KeyboardVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import Backend from 'chessvibe/src/GameBackend';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

const header_height = 70;
const handle_height = 20 + vw(3);
const panel_height = header_height - handle_height;

export default function ChatSection(props) {
	const theme = useSelector(state => state.theme);
	const chat = useSelector(state => state.game.match ? state.game.match.chat : [], strict_equal);
	const contentRef = React.useRef();
	const [ messageCache, setMessageCache ] = React.useState(null);
	const { gameRef, setChatState } = props;

	let colorLight = { backgroundColor: theme.COLOR_BOARD_LIGHT };
	let colorDark = { backgroundColor: theme.COLOR_BOARD_DARK };
	let colorBlack = { backgroundColor: 'black' };

	// Render chat bubbles
	let chatBubbles = chat.map((chatItem, index) => {
		let messageObj = Util.unpackMessage(chatItem);
		return (
			<ChatBubble
				key={ index }
				right={ messageObj.team == gameRef.team }
				onPress={ async () => {
					Clipboard.setString(messageObj.message);
					setChatState(DIALOG.REQUEST_SHOW);
				}}>
				{ messageObj.message }
			</ChatBubble>
		);
	});

	// Add message bubble sent from user
	if (messageCache) {
		if (chat.length == 0 || messageCache != Util.unpackMessage(chat[chat.length - 1]).message) {
			chatBubbles.push(
				<ChatBubble key={ chat.length } right={ true }>{ messageCache }</ChatBubble>
			);
		}
		else {
			setMessageCache(null);
		}
	}

	// Render
	return (
		<View style={ [props.style] }>
			<View style={ styles.chatDivider }/>
			<ScrollView
				ref={ contentRef }
				contentContainerStyle={ styles.chatContent }
				onContentSizeChange={() => contentRef.current.scrollToEnd({animated: true})}>

				{ chatBubbles }

			</ScrollView>
			<View style={ styles.chatDivider }/>
			<View style={ [styles.chatBottom, colorBlack] }>
				<ChatInput onSubmitText={(value)=> {
					setMessageCache(value);
					Backend.message(value);
				}}/>
			</View>
		</View>
	);
}

function ChatBubble(props) {
	const theme = useSelector(state => state.theme);
	let { right=false, onPress=() => {} } = props;
	let viewStyle = [styles.chatBubble];
	let textStyle = [styles.chatMessage];
	let colorDark = { backgroundColor: theme.COLOR_BOARD_DARK };

	if (right) {
		viewStyle.push(styles.rightBubble, colorDark);
		textStyle.push(styles.rightMessage);
	}

	return (
		<ButtonVibe style={ viewStyle } onPress={ props.onPress }>
			<TextVibe style={ textStyle }>{ props.children }</TextVibe>
		</ButtonVibe>
	);
}

function ChatInput(props) {
	const [ value, onChangeText ] = React.useState('');

	return (
		<TextInput
			style={ [styles.chatInput] }
			onChangeText={ text => onChangeText(text) }
			onSubmitEditing={ () => {
				onChangeText('');
				props.onSubmitText(value);
			}}
			keyboardAppearance={ 'dark' }
			placeholder={ 'Type here...' }
			placeholderTextColor={ 'white' }
			returnKeyType={ 'send' }
			scrollEnabled={ true }
			blurOnSubmit={false}
			value={ value }/>
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	chatContent: {
		paddingHorizontal: vw(2),
	},

		chatBubble: {
			backgroundColor: 'darkslategrey',
			marginBottom: vw(),
			padding: vw(2),
			maxWidth: '90%',
			borderRadius: vw(),
			alignSelf: 'flex-start',
		},

			rightBubble: {
				alignSelf: 'flex-end',
			},

			chatMessage: {
				color: 'lightgrey',
				fontSize: vw(5),
			},

			rightMessage: {
				textAlign: 'right',
			},

		chatDivider: {
			height: vw(2),
			width: '100%',
		},

	chatBottom: {
		flexDirection: 'row',
		alignItems: 'center',
		height: panel_height,
		borderBottomLeftRadius: borderRadius,
		borderBottomRightRadius: borderRadius,
		backgroundColor: 'blue',
		marginBottom: vw(),
		// marginHorizontal: vw(),
	},

		chatInput: {
			flex: 1,
			fontSize: vw(5),
			fontFamily: 'Spectral',
			color: 'white',
			backgroundColor: 'black',
			borderColor: 'gray',
			padding: vw(2),
			paddingTop: 0, lineHeight: vw(9), // Hack to get input overflow working...
			borderBottomLeftRadius: borderRadius,
			borderBottomRightRadius: borderRadius,

			shadowColor: "#ffffff",
			shadowOffset: {
				width: 0,
				height: 0,
			},
			shadowOpacity: 0.5,
			shadowRadius: 3,
			elevation: 1,
		},
});
