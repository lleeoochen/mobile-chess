import * as React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { BOARD_SIZE } from 'chessvibe/src/Const';
import { TextVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import BottomSheet from 'reanimated-bottom-sheet'
// import { TouchableOpacity } from 'react-native-gesture-handler';

// Active match buttons
const resignImg = require('chessvibe/assets/resign.png');
const drawImg = require('chessvibe/assets/draw.png');
const mercyImg = require('chessvibe/assets/mercy.png');
const timeImg = require('chessvibe/assets/time.png');
const inviteImg = require('chessvibe/assets/invite.png');

// Inactive match buttons
const forwardImg = require('chessvibe/assets/forward.png');
const fastForwardImg = require('chessvibe/assets/fast-forward.png');
const backwardImg = require('chessvibe/assets/backward.png');
const fastBackwardImg = require('chessvibe/assets/fast-backward.png');
const playImg = require('chessvibe/assets/play.png');
const pauseImg = require('chessvibe/assets/pause.png');

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();
const panel_height = 50;

export default function UtilityPanel(props) {
	const theme = useSelector(state => state.theme);

	let colorStyle = {
		backgroundColor: theme.COLOR_BOARD_DARK,
		color: theme.COLOR_BOARD_LIGHT,
	};

	const actionPanel = (
		<View style={ styles.panel }>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<TextVibe style={ styles.btnText }>Resign</TextVibe>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<TextVibe style={ styles.btnText }>Draw</TextVibe>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<TextVibe style={ styles.btnText }>Mercy</TextVibe>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<TextVibe style={ styles.btnText }>+15 sec</TextVibe>
			</TouchableOpacity>
		</View>
	);

	const reviewPanel = (
		<View style={ styles.panel }>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ fastBackwardImg }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ backwardImg }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ playImg }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ forwardImg }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ fastForwardImg }/>
			</TouchableOpacity>
		</View>
	);

	const invitePanel = (
		<View style={ styles.panel }>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ inviteImg }/>
			</TouchableOpacity>
		</View>
	);

	const pullupViewColor = 'black'; //#000000ba

	const renderHeader = () => {
		return (
			<View style={ [styles.header, { backgroundColor: pullupViewColor }] }>
				<View style={ [styles.handle, { backgroundColor: theme.COLOR_BOARD_DARK }] }></View>
				{ actionPanel }
			</View>
		);
	};

	const renderContent = () => {
		return (
			<View style={ [styles.content, { backgroundColor: pullupViewColor }] }>
				{ invitePanel }
			</View>
		);
	};

	return (
		<View style={ props.style }>
			<BottomSheet
				initialSnap={ 1 }
				snapPoints = { [vh(60), panel_height] }
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
			// position: 'absolute',
			height: panel_height,
			bottom: 0,
			width: '100%',
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
		},

			handle: {
				color: 'blue',
				width: vw(20),
				height: vw(),
				marginVertical: vw(),
				borderRadius: vw(),
			},

			panel: {
				flexShrink: 1,
				height: panel_height - vw(4),
				flexDirection: 'row',
				paddingLeft: margin_size,
				paddingRight: margin_size * 0.5,
				marginBottom: vw(),
			},

			content: {
				width: '100%',
				height: '100%',
				backgroundColor: 'black',
			},

	btn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: vw(0.5),
		borderRadius: borderRadius,
		backgroundColor: 'white',
	},

		btnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
		},
});
