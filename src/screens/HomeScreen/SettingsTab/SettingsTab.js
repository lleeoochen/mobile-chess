import * as React from 'react';
import { Switch, Animated, View, SafeAreaView, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image, Button, RefreshControl } from 'react-native';
import { ActionBar, WebVibe, TextVibe, ModalVibe, ButtonVibe, DialogVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';

import { URL, TEAM, IMAGE } from 'chessvibe/src/Const';
import Util, { formatDate, vw, wh, winType } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import Backend from 'chessvibe/src/Backend';
import SideMenu from 'react-native-side-menu'
import { showDrawer, updateUser, updateTheme } from 'chessvibe/src/redux/Reducer';
import Store from 'chessvibe/src/redux/Store';

const matchSize = vw((100 - 2 - 6 - 4) / 4);
const borderRadius = vw();

// Home Screen
export default function SettingsTab(props) {
	return (
		<View style={ [styles.view, props.style] }>
			<ScrollView>
				<View style={ styles.divider }/>
				<Setting title={ 'Dark Theme' } initEnabled={ true }/>
				<Setting title={ 'Push Notification' } initEnabled={ true }/>
				<View style={ styles.divider }/>
				<Setting title={ 'Report Issue' } type={ 'more' }/>
				<Setting title={ 'About' } type={ 'more' }/>
			</ScrollView>
		</View>
	);
}

function Setting(props) {
	const { title, initEnabled=false, type='switch' } = props;
	const [isEnabled, setIsEnabled] = React.useState(initEnabled);
	const toggleSwitch = () => setIsEnabled(previousState => !previousState);

	if (type == 'switch') {
		return (
			<View style={ styles.setting }>
				<TextVibe style={ styles.settingText }>{ title }</TextVibe>
				<Switch
					onValueChange={ toggleSwitch }
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					value={ isEnabled }
					style={ styles.settingBtn }/>
			</View>
		);
	}
	else if (type == 'more') {
		return (
			<ButtonVibe style={ styles.setting }>
				<TextVibe style={ styles.settingText }>{ title }</TextVibe>
				<Image source={ IMAGE.BACK } style={ [styles.settingsIcon,  {transform: [{ scaleX: -1 }]}] }/>
			</ButtonVibe>
		);
	}
}


const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
		backgroundColor: '#1a283a',
	},

		setting: {
			backgroundColor: '#2a4261',
			padding: vw(3),
			paddingHorizontal: vw(4),
			flexDirection: 'row',
			alignItems: 'center',
			borderBottomWidth: 1,
			borderColor: '#1a283a',
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
	}
});
