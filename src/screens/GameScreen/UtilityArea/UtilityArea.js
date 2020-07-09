import * as React from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { vw, vh, strict_equal } from 'chessvibe/src/Util';
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
	const theme = useSelector(state => state.theme);
	const match = useSelector(state => state.game.match, strict_equal);
	const drawerRef = React.useRef(null);

	const game = useSelector(state => state.game);
	const blackPlayer = useSelector(state => state.blackPlayer) || {};
	const whitePlayer = useSelector(state => state.whitePlayer) || {};

	// React states for popup dialogs
	const resignHook = React.useState(DIALOG.HIDE);
	const drawHook = React.useState(DIALOG.HIDE);
	const undoHook = React.useState(DIALOG.HIDE);
	const inviteHook = React.useState(DIALOG.HIDE);
	const chatHook = React.useState(DIALOG.HIDE);


	const minimizeDrawer = () => {
		if (drawerRef) drawerRef.current.snapTo(2);
	};

	const renderHeader = () => {
		if (!props.gameRef || !match) return <View/>;

		let Panel = ActionPanel;
		if (props.gameRef.ended) Panel = ReviewPanel;
		if (!match.white)        Panel = InvitePanel;

		return (
			<View style={ [styles.header] }>
				<View style={ [styles.handle] }></View>
				<Panel
					gameRef={ props.gameRef }
					theme={ theme }
					game={ game }
					whitePlayer={ whitePlayer }
					blackPlayer={ blackPlayer }
					setResignState={ resignHook[1] }
					setInviteState={ inviteHook[1] }
					minimizeDrawer={ minimizeDrawer }
					style={ [styles.panel, styles.headerPanel] }/>
			</View>
		);
	};

	const renderContent = () => {
		if (!props.gameRef || !match || !match.white)
			return <View style={ [styles.content] }/>;

		return (
			<View style={ [styles.content] }>
				{/*<View style={ styles.divider }/>*/}
				
				{/*<TextVibe style={ styles.sectionTitle }>Send Invite</TextVibe>*/}
				<InvitePanel
					gameRef={ props.gameRef }
					minimizeDrawer={ minimizeDrawer }
					setInviteState={ inviteHook[1] }
					style={ [styles.panel] }/>
				<View style={ styles.divider }/>

				<TextVibe style={ styles.sectionTitle }>Chat Room</TextVibe>
				<ChatSection
					gameRef={ props.gameRef }
					setChatState={ chatHook[1] }
					style={ styles.chatSection }/>
			</View>
		);
	};

	return (
		<View style={ props.style }>
			<BottomSheet
				ref={ drawerRef }
				initialSnap={ 2 }
				snapPoints = { [vh(80), vh(50), header_height] }
		        callbackNode={ props.callbackNode }
				renderContent={ renderContent }
				renderHeader={ renderHeader }
				enabledBottomClamp={ true }
				style={ styles.pullupView }/>

			<UtilityDialogs
				resignHook={ resignHook }
				inviteHook={ inviteHook }
				chatHook={ chatHook }
				drawHook={ drawHook }
				undoHook={ undoHook }/>
        </View>
	);
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
			height: vw(),
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

			shadowColor: "#fff",
			shadowOffset: {
				width: 0,
				height: -5,
			},
			shadowOpacity: 0.4,
			shadowRadius: 6.68,
			elevation: 1,
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
		backgroundColor: '#191919',
	},

	divider: {
		height: vw(5),
	},
});
