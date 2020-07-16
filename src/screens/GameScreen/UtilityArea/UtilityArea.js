import * as React from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView, KeyboardAvoidingView, Animated } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Util, { vw, vh, strict_equal } from 'chessvibe/src/Util';
import { BOARD_SIZE, IMAGE, TEAM, DB_REQUEST_ASK, DIALOG } from 'chessvibe/src/Const';
import { TextVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import BottomSheet from 'reanimated-bottom-sheet';
import Backend from 'chessvibe/src/GameBackend';

import ActionPanel from './ActionPanel';
import ReviewPanel from './ReviewPanel';
import InvitePanel from './InvitePanel';
import ChatSection from './ChatSection';
import UtilityDialogs from './UtilityDialogs';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

const handle_height = 20 + vw(3);
const panel_height = vw(12);
const header_height = panel_height + handle_height;

export default function UtilityArea(props) {
	const { gameRef } = props;

	var flash = new Animated.Value(1);
	const [ flashing, setFlashing ] = React.useState(false);
	const [ drawerOpen, setDrawerOpen ] = React.useState(false);

	const theme = useSelector(state => state.theme);
	const match = useSelector(state => state.game.match, strict_equal);
	const drawerRef = React.useRef(null);
	const triggerEnding = React.useRef(true);
	const chatApplied = React.useRef(0);

	const blackPlayer = useSelector(state => state.blackPlayer) || {};
	const whitePlayer = useSelector(state => state.whitePlayer) || {};

	// React states for popup dialogs
	const resignHook = React.useState(DIALOG.HIDE);
	const drawHook = React.useState(DIALOG.HIDE);
	const undoHook = React.useState(DIALOG.HIDE);
	const inviteHook = React.useState(DIALOG.HIDE);
	const chatHook = React.useState(DIALOG.HIDE);
	const endingHook = React.useState(DIALOG.HIDE);


	const minimizeDrawer = () => {
		if (drawerRef) drawerRef.current.snapTo(2);
	};

	const renderHeader = () => {
		if (!gameRef || !match) return <View/>;

		let Panel = ActionPanel;
		if (gameRef.ended || Util.gameFinished(gameRef.match)) Panel = ReviewPanel;
		if (!match.white) Panel = InvitePanel;


		let backgroundColor = 'black';
		if (flashing) {
			Animated.loop(
				Animated.sequence([
					Animated.timing(flash, {
						toValue: 0,
						duration: 400,
						useNativeDriver: false,
					}),
					Animated.timing(flash, {
						toValue: 1,
						delay: 700,
						duration: 300,
						useNativeDriver: false,
					})
				])
			).start();

			backgroundColor = flash.interpolate({
				inputRange: [0, 1],
				outputRange: ['black', 'grey']
			});
		}

		return (
			<Animated.View style={ [styles.header] }>
				<View style={ [styles.handle] }></View>
				<Panel
					gameRef={ gameRef }
					theme={ theme }
					whitePlayer={ whitePlayer }
					blackPlayer={ blackPlayer }
					setResignState={ resignHook[1] }
					setInviteState={ inviteHook[1] }
					minimizeDrawer={ minimizeDrawer }
					style={ [styles.panel, styles.headerPanel, { backgroundColor: backgroundColor }] }/>
			</Animated.View>
		);
	};

	const renderContent = () => {
		if (!gameRef || !match || !match.white)
			return <View style={ [styles.content] }/>;

		return (
			<View style={ [styles.content] }>
				{/*<View style={ styles.divider }/>*/}
				
				{/*<TextVibe style={ styles.sectionTitle }>Send Invite</TextVibe>*/}
				<InvitePanel
					gameRef={ gameRef }
					minimizeDrawer={ minimizeDrawer }
					setInviteState={ inviteHook[1] }
					style={ [styles.panel] }/>
				<View style={ styles.divider }/>

				<TextVibe style={ styles.sectionTitle }>Chat Room</TextVibe>
				<ChatSection
					gameRef={ gameRef }
					setChatState={ chatHook[1] }
					style={ styles.chatSection }/>
			</View>
		);
	};

	function onOpenStart() {
		setFlashing(false);
		setDrawerOpen(true);
	}

	function onCloseEnd() {
		setDrawerOpen(false);
	}


	handleUndoRequests(gameRef, undoHook);
	handleDrawRequests(gameRef, drawHook);

	// Trigger event for ending
	if (triggerEnding.current) {
		handleEndingRequests(gameRef, endingHook, triggerEnding);
	}

	// Chat flashing notification
	if (gameRef && match && !gameRef.firstLoad && match.chat.length > chatApplied.current) {
		for (;chatApplied.current < match.chat.length; chatApplied.current++) {
			if (Util.unpackMessage(match.chat[chatApplied.current]).team != gameRef.team) {
				chatApplied.current = match.chat.length;
				setFlashing(!drawerOpen);
				break;
			}
		}
	}

	return (
		<View style={ props.style }>
			<BottomSheet
				ref={ drawerRef }
				initialSnap={ 2 }
				snapPoints = { [vh(75), vh(50), header_height] }
		        callbackNode={ props.callbackNode }
				renderContent={ renderContent }
				renderHeader={ renderHeader }
				enabledBottomClamp={ true }
				style={ styles.pullupView }
				onCloseEnd={ () => onCloseEnd() }
				onOpenStart={ () => onOpenStart() }/>

			<UtilityDialogs
				resignHook={ resignHook }
				inviteHook={ inviteHook }
				chatHook={ chatHook }
				drawHook={ drawHook }
				endingHook={ endingHook }
				undoHook={ undoHook }/>
        </View>
	);
}

// Handle incoming undo requests from opponent
function handleUndoRequests(game, undoHook) {
	let [undoState, setUndoState] = undoHook;

	// Undo dialog show/hide
	if (undoState == DIALOG.HIDE) {
		let undoModalShow = game != null && game.match != null && !Util.gameFinished(game.match);

		if (undoModalShow) {
			let { team, match } = game;
			undoModalShow = (
				team == TEAM.B && match.white_undo == DB_REQUEST_ASK ||
				team == TEAM.W && match.black_undo == DB_REQUEST_ASK
			);
		}

		if (undoModalShow) {
			setUndoState(DIALOG.REQUEST_SHOW);
		}
	}
}

// Handle incoming draw requests from opponent
function handleDrawRequests(game, drawHook) {
	let [drawState, setDrawState] = drawHook;

	// Draw dialog show/hide
	if (drawState == DIALOG.HIDE) {
		let drawModalShow = game != null && game.match != null && !Util.gameFinished(game.match);

		if (drawModalShow) {
			let { team, match } = game;
			drawModalShow = (
				team == TEAM.B && match.white_draw == DB_REQUEST_ASK ||
				team == TEAM.W && match.black_draw == DB_REQUEST_ASK
			);
		}

		if (drawModalShow) {
			setDrawState(DIALOG.REQUEST_SHOW);
		}
	}
}

// Handle game over requests
function handleEndingRequests(game, endingHook, triggerEnding) {
	let [endingState, setEndingState] = endingHook;

	// Draw dialog show/hide
	if (endingState == DIALOG.HIDE) {
		let endingModalShow = game != null && game.match != null;

		if (endingModalShow) {
			let { match } = game;
			endingModalShow = !game.firstLoad && Util.gameFinished(match);
		}

		if (endingModalShow) {
			triggerEnding.current = false;
			setEndingState(DIALOG.REQUEST_SHOW);
		}
	}
}

const utilityBackground = 'black';
const styles = StyleSheet.create({

	pullupView: {
		shadowColor: "black",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,

		elevation: 12,
	},

	// Pullup Header
	header: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: header_height,
		bottom: 0,
		width: '100%',
		paddingTop: 20,
		marginBottom: vw(-1),
		backgroundColor: 'transparent',
	},

		handle: {
			backgroundColor: utilityBackground,
			width: vw(18),
			height: vw(1.2),
			borderRadius: vw(),
			marginVertical: vw(),
			zIndex: 10,
		},

		headerPanel: {
			height: panel_height,
			backgroundColor: utilityBackground,
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
			paddingVertical: vw(),
			marginBottom: 0,

			// shadowColor: "#fff",
			// shadowOffset: {
			// 	width: 0,
			// 	height: -10,
			// },
			// shadowOpacity: 0.4,
			// shadowRadius: 6.68,
			// elevation: 1,
		},

	// Pullup Content
	content: {
		width: '100%',
		height: '100%',
		backgroundColor: utilityBackground,
		paddingTop: vw(1),
	},

		sectionTitle: {
			color: 'white',
			fontSize: vw(5),
			marginHorizontal: vw(),
		},

	// Utility Panel
	panel: {
		flexShrink: 1,
		height: panel_height - vw(),
		flexDirection: 'row',
		paddingLeft: margin_size,
		paddingRight: margin_size * 0.5,
		paddingBottom: vw(),
	},

	// Chat Section
	chatSection: {
		flex: 1,
		margin: margin_size,
		marginTop: 0,
		marginBottom: margin_size,
		borderRadius: borderRadius,
		// backgroundColor: '#003333',
		// borderWidth: margin_size * 0.5,
		// borderColor: 'lightgrey',
		backgroundColor: '#1a283a',
	},

	divider: {
		height: vw(5),
	},
});
