import * as React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { vw, vh, strict_equal } from 'chessvibe/src/Util';
import { BOARD_SIZE, IMAGE } from 'chessvibe/src/Const';
import { TextVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import BottomSheet from 'reanimated-bottom-sheet';

import ActionPanel from './ActionPanel';
import ReviewPanel from './ReviewPanel';
import InvitePanel from './InvitePanel';

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

	const renderHeader = () => {
		if (!game || !game.match) return <View/>;
		let panel;

		if (game.ended) {
			panel = reviewPanel;
		}
		else if (!game.match.white) {
			panel = invitePanel;
		}
		else {
			panel = actionPanel
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
			panel = invitePanel;
		}

		return (
			<View style={ [styles.content] }>
				{ panel }
			</View>
		);
	};

	return (
		<View style={ props.style }>
			<BottomSheet
				initialSnap={ 1 }
				snapPoints = { [vh(80), header_height] }
		        callbackNode={ props.callbackNode }
				renderContent = { renderContent }
				renderHeader = { renderHeader }
				style={ styles.pullupView }
	        />
        </View>
	);
}

const styles = StyleSheet.create({

	pullupView: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,

		elevation: 12,
	},

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
				backgroundColor: 'black',
				width: vw(18),
				height: vw(),
				borderRadius: vw(),
				marginVertical: vw(),
			},

			headerPanel: {
				height: panel_height,
				backgroundColor: 'black',
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				paddingVertical: vw(),
			},

		content: {
			width: '100%',
			height: '100%',
			backgroundColor: 'black',
		},

		panel: {
			flexShrink: 1,
			height: panel_height,
			flexDirection: 'row',
			paddingLeft: margin_size,
			paddingRight: margin_size * 0.5,
			marginBottom: 0,
			paddingBottom: vw(),
		},
});
