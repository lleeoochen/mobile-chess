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

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();

// Home Screen
export default function SettingsTab(props) {
	const { isDarkTheme } = props;
	let appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let borderStyle = {
		height: 1,
		backgroundColor: appTheme.SETTING_BORDER,
	};

	return (
		<View style={ viewStyle }>
			<ScrollView>
				<View style={ styles.divider }/>

				<View style={ borderStyle }/>

					<Setting
						title={ 'Dark Theme' }
						enabled={ isDarkTheme }
						appTheme={ appTheme }
						onChange={ (enabled) => {
							Store.dispatch(setIsDarkTheme( enabled ));
							Storage.set(STORAGE_IS_DARK_THEME, enabled + '');
						} }/>
					<View style={ borderStyle }/>
					<Setting title={ 'Push Notification' } enabled={ true } appTheme={ appTheme }/>

				<View style={ borderStyle }/>

				<View style={ styles.divider }/>

				<View style={ borderStyle }/>

					<Setting title={ 'Report Issue' } type={ 'more' } appTheme={ appTheme }/>
					<View style={ borderStyle }/>
					<Setting title={ 'About' } type={ 'more' } appTheme={ appTheme }/>

				<View style={ borderStyle }/>
			</ScrollView>
		</View>
	);
}

function Setting(props) {
	const { title, appTheme, enabled=false, type='switch', onChange=()=>{} } = props;

	const toggleSwitch = () => {
		onChange(!enabled);
	};

	let settingStyle = [styles.setting, {
		backgroundColor: appTheme.SETTING_BACKGROUND,
		borderColor: appTheme.SETTING_BORDER,
	}];

	let textStyle = [styles.settingText, {
		color: appTheme.COLOR,
	}];

	if (type == 'switch') {
		return (
			<View style={ settingStyle }>
				<TextVibe style={ textStyle }>{ title }</TextVibe>
				<Switch
					onValueChange={ toggleSwitch }
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					value={ enabled }
					style={ styles.settingBtn }/>
			</View>
		);
	}
	else if (type == 'more') {
		return (
			<ButtonVibe style={ settingStyle }>
				<TextVibe style={ textStyle }>{ title }</TextVibe>
				<Image source={ IMAGE.BACK } style={ [styles.settingsIcon,  {transform: [{ scaleX: -1 }]}] }/>
			</ButtonVibe>
		);
	}
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

		setting: {
			padding: vw(3),
			paddingHorizontal: vw(4),
			flexDirection: 'row',
			alignItems: 'center',
			// borderBottomWidth: 1,
			borderRadius: 0,
		},

		settingsIcon: {
			width: vw(7),
			height: vw(7),
		},

		settingText: {
			flex: 1,
			fontSize: vw(5),
			color: 'white',
		},

		settingBtn: {
			// alignSelf: 'flex-end',
		},

	divider: {
		height: vw(10),
	},
});
