import * as React from 'react';
import { Keyboard, Switch, Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TouchableWithoutFeedback, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe, InputVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import * as DeviceInfo from 'react-native-device-info';

import { URL, TEAM, IMAGE, STORAGE_IS_DARK_THEME, APP_THEME } from 'chessvibe/src/Const';
import Util, { formatDate, vw, vh, winType } from 'chessvibe/src/Util';
import Storage from 'chessvibe/src/Storage';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'
import { setIsDarkTheme } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';


// Home Screen
export default function AboutModal(props) {
	const { isDarkTheme, isVisible, onDismiss } = props;
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	let textColor = {
		color: appTheme.COLOR
	};

	let inputStyle = {
		backgroundColor: isDarkTheme ? '#ffffff2e' : appTheme.MENU_BACKGROUND
	};

	let btnStyle = {
		backgroundColor: appTheme.APP_BACKGROUND
	};

	return (
		<ModalVibe isVisible={ isVisible } coverAll={ true } onDismiss={ onDismiss }>
			<View style={ styles.view }>
				<TextVibe style={ [styles.title, textColor] }>ChessVibe (v{ DeviceInfo.getVersion() })</TextVibe>
				<View style={ styles.divider }/>

				<View style={ styles.row }>
					<TextVibe style={ [styles.text, textColor, styles.left] }>Developer</TextVibe>
					<TextVibe style={ [styles.text, textColor, styles.right] }>Wei Tung Chen</TextVibe>
				</View>

				<View style={ styles.divider }/>

				<View style={ styles.row }>
					<TextVibe style={ [styles.text, textColor, styles.left] }>Credits</TextVibe>
					<TextVibe style={ [styles.text, textColor, styles.right] }>React Native</TextVibe>
				</View>
				<View style={ styles.row }>
					<TextVibe style={ [styles.text, textColor, styles.left] }></TextVibe>
					<TextVibe style={ [styles.text, textColor, styles.right] }>Stack Overflow</TextVibe>
				</View>
				<View style={ styles.row }>
					<TextVibe style={ [styles.text, textColor, styles.left] }></TextVibe>
					<TextVibe style={ [styles.text, textColor, styles.right] }>Icons8</TextVibe>
				</View>
			</View>
		</ModalVibe>
	);
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: vw(5),
	},

		title: {
			fontSize: vw(8),
		},

		row: {
			width: '100%',
			flexDirection: 'row',
		},

			text: {
				fontSize: vw(5),
			},

			left: {
				width: '42%',
				textAlign: 'right',
				paddingRight: vw(2),
				fontWeight: 'bold',
			},

			right: {
				width: '58%',
				textAlign: 'left',
				paddingLeft: vw(2),
			},

		divider: {
			height: vw(2),
		}
});
