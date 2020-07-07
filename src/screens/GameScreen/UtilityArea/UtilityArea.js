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

	const actionPanel = <ActionPanel game={ props.game } style={ [styles.panel, styles.headerPanel] }/>;
	const reviewPanel = <ReviewPanel game={ props.game } style={ [styles.panel, styles.headerPanel] }/>;
	const invitePanel = <InvitePanel game={ props.game } style={ [styles.panel, styles.headerPanel] }/>;
	const keyboardVerticalOffset = Platform.OS === 'ios' ? 56 : 0;

	const renderHeader = () => {
		if (!game || !game.match) return <View/>;
		let panel;

		if (game.ended) {
			panel = <ReviewPanel game={ props.game } style={ [styles.panel, styles.headerPanel] }/>;
		}
		else if (!game.match.white) {
			panel = <InvitePanel game={ props.game } style={ [styles.panel, styles.headerPanel] }/>;
		}
		else {
			panel = <ActionPanel game={ props.game } style={ [styles.panel, styles.headerPanel] }/>;
		}

		return (
			<View style={ [styles.header] }>
				<View style={ [styles.handle] }></View>
				{ panel }
			</View>
		);
	};

	const renderContent = () => {
		if (!game || !game.match) return <View/>;
		let panel;

		if (!game.match.white) {
			panel = <View/>;
		}
		else {
			panel = <InvitePanel game={ props.game } style={ [styles.panel] }/>;
		}

		return (
			<View style={ [styles.content] }>
				{ panel }

				<TextVibe style={ styles.sectionTitle }>Chat Room</TextVibe>

				<ChatSection style={ styles.chatSection }/>
			</View>
		);
	};

	return (
		<View style={ props.style }>
			<BottomSheet
				initialSnap={ 1 }
				snapPoints = { [vh(70), header_height] }
		        callbackNode={ props.callbackNode }
				renderContent={ renderContent }
				renderHeader={ renderHeader }
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
		backgroundColor: '#3D507B',
	},
});
