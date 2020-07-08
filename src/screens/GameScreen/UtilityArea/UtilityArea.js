import * as React from 'react';
import { TouchableOpacity, View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { vw, vh, strict_equal } from 'chessvibe/src/Util';
import { BOARD_SIZE, IMAGE } from 'chessvibe/src/Const';
import { TextVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import BottomSheet from 'reanimated-bottom-sheet';

import ActionPanel from './ActionPanel';
import ReviewPanel from './ReviewPanel';
import InvitePanel from './InvitePanel';
import ChatSection from './ChatSection';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

const header_height = 70;
const handle_height = 20 + vw(3);
const panel_height = header_height - handle_height;

export default function UtilityArea(props) {
	const theme = useSelector(state => state.theme);
	const game = useSelector(state => state.game, strict_equal);
	const drawerRef = React.useRef(null);

	const minimizeDrawer = () => {
		if (drawerRef) drawerRef.current.snapTo(2);
	};

	const renderHeader = () => {
		if (!game || !game.match) return <View/>;

		let Panel = ActionPanel;
		if (game.ended)        Panel = ReviewPanel;
		if (!game.match.white) Panel = InvitePanel;

		return (
			<View style={ [styles.header] }>
				<View style={ [styles.handle] }></View>
				<Panel gameRef={ props.gameRef } minimizeDrawer={ minimizeDrawer } style={ [styles.panel, styles.headerPanel] }/>
			</View>
		);
	};

	const renderContent = () => {
		if (!game || !game.match || !game.match.white)
			return <View style={ [styles.content] }/>;

		return (
			<View style={ [styles.content] }>
				<InvitePanel gameRef={ props.gameRef } minimizeDrawer={ minimizeDrawer } style={ [styles.panel] }/>
				<TextVibe style={ styles.sectionTitle }>Chat Room</TextVibe>
				<ChatSection style={ styles.chatSection }/>
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
				style={ styles.pullupView }
	        />
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
		},

		headerPanel: {
			height: panel_height,
			backgroundColor: utilityBackground,
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
			paddingVertical: vw(),
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
			marginTop: vw(5),
			marginHorizontal: vw(),
		},

	// Utility Panel
	panel: {
		flexShrink: 1,
		height: panel_height,
		flexDirection: 'row',
		paddingLeft: margin_size,
		paddingRight: margin_size * 0.5,
		paddingBottom: vw(),
		marginBottom: 0,
	},

	// Chat Section
	chatSection: {
		flex: 1,
		margin: margin_size,
		marginTop: 0,
		marginBottom: margin_size,
		borderRadius: borderRadius,
		backgroundColor: 'black',
		// borderWidth: margin_size,
		// borderColor: '#C1C1C1',
	},
});
