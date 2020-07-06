import * as React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { vw, vh } from 'chessvibe/src/Util';
import { BOARD_SIZE, IMAGE } from 'chessvibe/src/Const';
import { TextVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import BottomSheet from 'reanimated-bottom-sheet'
// import { TouchableOpacity } from 'react-native-gesture-handler';

const margin_size = vw();
const cell_size = (vw(100) - 4 * margin_size) / 8;
const borderRadius = vw();

const header_height = 70;
const handle_height = 20 + vw(3);
const panel_height = header_height - handle_height;

export default function UtilityArea(props) {
	const theme = useSelector(state => state.theme);

	let colorStyle = {
		backgroundColor: theme.COLOR_BOARD_DARK,
		color: theme.COLOR_BOARD_LIGHT,
	};

	const actionPanel = (
		<View style={ [styles.panel, styles.headerPanel] }>
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
		<View style={ [styles.panel, styles.headerPanel] }>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ IMAGE.FASTBACKWARD }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ IMAGE.BACKWARD }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ IMAGE.PLAY }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ IMAGE.FORWARD }/>
			</TouchableOpacity>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ IMAGE.FASTFORWARD }/>
			</TouchableOpacity>
		</View>
	);

	const invitePanel = (
		<View style={ styles.panel }>
			<TouchableOpacity style={ [styles.btn, colorStyle] } onPress={ null }>
				<AutoHeightImage width={ vw(5) } source={ IMAGE.INVITE }/>
			</TouchableOpacity>
		</View>
	);

	const renderHeader = () => {
		return (
			<View style={ [styles.header] }>
				<View style={ [styles.handle] }></View>
				{ reviewPanel }
			</View>
		);
	};

	const renderContent = () => {
		return (
			<View style={ [styles.content] }>
				{ invitePanel }
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
				width: vw(20),
				height: vw(1),
				marginTop: vw(),
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
