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
			<View style={ [props.style, { backgroundColor: '#000000E2' }] }>
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
	};

	let renderContent = () => {
		return (
			<View style={ { width: vw(100 - 2), backgroundColor: '#000000E2', height: '100%', marginLeft: vw(), } }>

			</View>
		);
	};

	return (
		<BottomSheet
			snapPoints = {[vh(50), 0]}
			renderContent = { renderContent }
			renderHeader = { renderHeader }
        />
	);
}

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

const styles = StyleSheet.create({

	btn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: vw(),
		marginRight: vw(0.5),
		marginTop: vw(3),
		padding: vw(2),
		borderRadius: borderRadius,
		backgroundColor: 'white',
	},

		btnText: {
			fontSize: vw(4),
			textAlign: 'center',
			color: 'white',
			lineHeight: vw(6)
		},
});
