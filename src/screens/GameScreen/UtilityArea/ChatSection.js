import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Clipboard from '@react-native-community/clipboard';
import { useSelector } from 'react-redux';
import Util, { vw, strict_equal } from 'chessvibe/src/Util';
import { TextVibe, ButtonVibe, InputVibe } from 'chessvibe/src/widgets';
import Backend from 'chessvibe/src/GameBackend';

const borderRadius = vw();

const header_height = 70;
const handle_height = 20 + vw(3);
const panel_height = header_height - handle_height;

const copied_width = 50;

export default function ChatSection(props) {
	const chat = useSelector(state => state.game.match ? state.game.match.chat : [], strict_equal);
	const contentRef = React.useRef();
	const [ messageCache, setMessageCache ] = React.useState(null);
	const { gameRef } = props;

	let colorBlack = { backgroundColor: 'black' };

	// Render chat bubbles
	let chatBubbles = chat.map((chatItem, index) => {
		let messageObj = Util.unpackMessage(chatItem);

		if (messageObj.message[0] == '[' && messageObj.message[messageObj.message.length - 1] == ']') {
			return (
				<TextVibe key={ index } style={ styles.systemMessage }>
					{ messageObj.message }
				</TextVibe>
			);
		}
		else {
			return (
				<ChatBubble
					key={ index }
					right={ messageObj.team == gameRef.team }
					onPress={ async () => {
						Clipboard.setString(messageObj.message);
					}}>
					{ messageObj.message }
				</ChatBubble>
			);
		}
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
				<InputVibe
					hidden={ Util.gameFinished(gameRef.match) || gameRef.modeAI }
					style={ styles.chatInput }
					placeholder={ 'Type here...' }
					onSubmitText={(value)=> {
					setMessageCache(value);
					Backend.message(value);
				}}/>
			</View>
		</View>
	);
}

function ChatBubble(props) {
	const theme = useSelector(state => state.game.theme);
	const [ showCopiedMessage, setShowCopiedMessage ] = React.useState(false);
	const [ shift ] = React.useState(new Animated.Value(1));
	let { right=false, onPress=() => {} } = props;

	// Start raw animation 0 to 1
	Animated.spring(shift, {
		toValue: showCopiedMessage ? 0 : 1,
		speed: 20,
		useNativeDriver: true,
	}).start();

	// Animation mapped to copied_width
	let translateX = shift.interpolate({
		inputRange: [0, 1],
		outputRange: [0, (right ? 1 : -1) * copied_width],
	});


	// Custom styling
	let wrapStyle = [styles.chatBubbleWrap, { transform: [{ translateX: translateX }] }];
	let viewStyle = [styles.chatBubble];
	let textStyle = [styles.chatMessage];
	let colorDark = { backgroundColor: theme.COLOR_BOARD_DARK };

	if (right) {
		wrapStyle.push({ justifyContent: 'flex-end' });
		viewStyle.push(styles.rightBubble, colorDark);
		textStyle.push(styles.rightMessage);
	}


	// Render
	let chatBubble = (
		<ButtonVibe
			key={ 'chatBubble' }
			style={ viewStyle }
			useGestureButton={ Platform.OS === 'android' }
			onPress={ () => {
				setShowCopiedMessage(true);
				onPress();
				setTimeout(() => {
					setShowCopiedMessage(false);
				}, 1000);
			} }>
			<TextVibe style={ textStyle }>{ props.children }</TextVibe>
		</ButtonVibe>
	);

	let chatCopiedMessage = (
		<Animated.View key={ 'chatCopiedMessage' }>
			<TextVibe style={ [...textStyle, styles.chatCopiedMessage] }>
				Copied!
			</TextVibe>
		</Animated.View>
	);

	return (
		<Animated.View style={ [wrapStyle] }>
			{
				right
				? [chatBubble, chatCopiedMessage]
				: [chatCopiedMessage, chatBubble]
			}
		</Animated.View>
	);
}


const styles = StyleSheet.create({
	chatContent: {
		paddingHorizontal: vw(),
	},

		chatBubbleWrap: {
			flexDirection: 'row',
			justifyContent: 'flex-start',
			alignItems: 'center',
		},

			chatBubble: {
				backgroundColor: 'darkslategrey',
				marginBottom: vw(),
				padding: vw(2),
				maxWidth: vw(70),
				borderRadius: vw(),
			},

				chatMessage: {
					color: 'lightgrey',
					fontSize: vw(5),
				},

				rightMessage: {
					textAlign: 'right',
				},

				systemMessage: {
					textAlign: 'center',
					color: 'lightgrey',
				},

				chatCopiedMessage: {
					fontSize: vw(3),
					color: 'lightgrey',
					width: copied_width,
					textAlign: 'center',
				},

			chatDivider: {
				height: vw(2),
				width: '100%',
			},

	chatBottom: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomLeftRadius: borderRadius,
		borderBottomRightRadius: borderRadius,
	},

		chatInput: {
			flex: 1,
			fontSize: vw(5),
			color: 'white',
			backgroundColor: '#0d151f',
			borderWidth: 1,
			borderBottomLeftRadius: borderRadius,
			borderBottomRightRadius: borderRadius,
			height: Platform.OS === 'android' ? panel_height * 1.2 : panel_height,
		},
});
