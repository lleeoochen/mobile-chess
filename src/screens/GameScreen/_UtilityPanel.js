import * as React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { BOARD_SIZE } from 'chessvibe/src/Const';
import { TextVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import BottomSheet from 'reanimated-bottom-sheet'

const resignImg = require('chessvibe/assets/resign.png');
const drawImg = require('chessvibe/assets/draw.png');
const mercyImg = require('chessvibe/assets/mercy.png');
const timeImg = require('chessvibe/assets/time.png');


export default function UtilityPanel(props) {
	const theme = useSelector(state => state.theme);

	let colorStyle = {
		backgroundColor: theme.COLOR_BOARD_DARK,
		color: theme.COLOR_BOARD_LIGHT,
	};

	let renderHeader = () => {
		return (
			<View style={ styles.header }>
				<View style={ [styles.handle, { backgroundColor: theme.COLOR_BOARD_DARK }] }></View>

				<View style={ [styles.panel, { backgroundColor: 'black' }] }>
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
			</View>
		);
	};

	let renderContent = () => {
		return (
			<View style={ { width: '100%', backgroundColor: 'black', height: '100%' } }>

			</View>
		);
	};

	return (
		<View style={ props.style }>
			<BottomSheet
				initialSnap={ 1 }
				snapPoints = { [vh(60), 0] }
		        callbackNode={ props.callbackNode }
				renderContent = { renderContent }
				renderHeader = { renderHeader }
				style={ styles.pullupView }
	        />
        </View>
	);
}

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();
const panel_height = vw(11);

const styles = StyleSheet.create({

	pullupView: {
		shadowColor: 'black',
		shadowRadius: vw(5),
	},

		header: {
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			bottom: 0,
			width: '100%',
			backgroundColor: 'black',
			borderTopLeftRadius: borderRadius,
			borderTopRightRadius: borderRadius,
		},

		handle: {
			flex: 1,
			backgroundColor: 'grey',
			color: 'blue',
			width: vw(20),
			height: vw(),
			marginTop: vw(),
			borderRadius: vw(),
		},

		panel: {
			height: panel_height,
			flex: 1,
			flexDirection: 'row',
			paddingLeft: margin_size,
			paddingRight: margin_size * 0.5,
		},

	btn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: vw(),
		marginRight: vw(0.5),
		marginTop: vw(),
		padding: vw(),
		borderRadius: borderRadius,
		backgroundColor: 'white',
	},

		btnText: {
			fontSize: vw(5),
			textAlign: 'center',
			color: 'white',
			lineHeight: vw(7)
		},
});
