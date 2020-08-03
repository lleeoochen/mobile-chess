import * as React from 'react';
import { Switch, Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

import { URL, TEAM, IMAGE, STORAGE_IS_DARK_THEME, APP_THEME } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType } from 'chessvibe/src/Util';
import Storage from 'chessvibe/src/Storage';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'
import { setIsDarkTheme } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';
import { useSelector } from 'react-redux';


// Home Screen
export default function AboutModal(props) {
	const { appTheme, isVisible, onDismiss } = props;

	// let viewStyle = [styles.view, props.style, {
	// 	backgroundColor: appTheme.CONTENT_BACKGROUND
	// }];

	// let borderStyle = {
	// 	height: 1,
	// 	backgroundColor: appTheme.SETTING_BORDER,
	// };

	return (
		<ModalVibe isVisible={ isVisible } coverAll={ true } onDismiss={ onDismiss }>
			<TextVibe>
				
			</TextVibe>
		</ModalVibe>
	);
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},
});
