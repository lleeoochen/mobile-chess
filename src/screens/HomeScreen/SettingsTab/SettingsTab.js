import * as React from 'react';
import { Switch, View, ScrollView, StyleSheet, Image } from 'react-native';
import { TextVibe, ButtonVibe } from 'chessvibe/src/widgets';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import { useSelector } from 'react-redux';

import { IMAGE, STORAGE_APP_THEME, APP_THEME } from 'chessvibe/src/Const';
import { vw } from 'chessvibe/src/Util';
import StyleUtil from 'chessvibe/src/StyleUtil';
import Storage from 'chessvibe/src/Storage';
import Cache, { CACHE_DEFAULT } from 'chessvibe/src/Cache';
import Store, { HomeStore, RootStore } from 'chessvibe/src/redux/Store';

import ReportModal from './ReportModal';
import AboutModal from './AboutModal';

// Navigation
SettingsTab.navigationOptions = () => {
	return {
		tabBarLabel: 'Settings',
		tabBarIcon: (
			<Image style={ styles.tab } source={ IMAGE['SETTINGS' + (Store.getState().home.appThemeId === 'DARK' ? '' : '_DARK')] }/>
		)
	};
};

// Home Screen
export default function SettingsTab(props) {
	// Screen props from navigation
	const {
		setNavStack,
	} = props.navigation.getScreenProps();

	const appThemeId = useSelector(state => state.home.appThemeId);
	const appTheme = APP_THEME[appThemeId];
	const [ repotModalShown, showReportModal ] = React.useState(false);
	const [ aboutModalShown, showAboutModal ] = React.useState(false);

	let viewStyle = [styles.view, props.style, {
		backgroundColor: appTheme.CONTENT_BACKGROUND
	}];

	let borderStyle = {
		height: 1,
		backgroundColor: appTheme.SETTING_BORDER,
	};

	const newAppThemeId =
		appThemeId === 'DARK' ? 'SKY' :
		appThemeId === 'SKY' ? 'LIGHT' :
		appThemeId === 'LIGHT' ? 'AUTUMN' :
		'DARK';

	return (
		<View style={ viewStyle }>
			<ScrollView>
				{/* <View style={ styles.divider }/> */}

				<View style={ borderStyle }/>
					<MoreSetting
						title={ 'Theme - ' + appThemeId }
						type={ 'button' }
						appThemeId={ appThemeId }
						onPress={() => {
							HomeStore.setAppThemeId(newAppThemeId);
							Storage.set(STORAGE_APP_THEME, newAppThemeId);
						}}/>
					<View style={ borderStyle }/>
					<SwitchSetting
						title={ 'Push Notification' }
						enabled={ true }
						appThemeId={ appThemeId }/>
				<View style={ borderStyle }/>

				<View style={ styles.divider }/>

				<View style={ borderStyle }/>
					<MoreSetting
						title={ 'Report Issues' }
						type={ 'more' }
						appThemeId={ appThemeId }
						onPress={ () => showReportModal(true) }/>

					<View style={ borderStyle }/>

					<MoreSetting
						title={ 'About' }
						type={ 'more' }
						appThemeId={ appThemeId }
						onPress={ () => showAboutModal(true) }/>
				<View style={ borderStyle }/>

				<View style={ styles.divider }/>

				<View style={ borderStyle }/>
					<MoreSetting
						title={ 'Logout' }
						type={ 'more' }
						appThemeId={ appThemeId }
						onPress={async () => {
							await signOut();
							setNavStack('login');
						}}/>
				<View style={ borderStyle }/>

			</ScrollView>

			<ReportModal
				appThemeId={ appThemeId }
				isVisible={ repotModalShown }
				onDismiss={ () => showReportModal(false) }/>

			<AboutModal
				appThemeId={ appThemeId }
				isVisible={ aboutModalShown }
				onDismiss={ () => showAboutModal(false) }/>
		</View>
	);
}

function SwitchSetting(props) {
	const { title, appThemeId, initEnabled=false, type='switch', onChange=()=>{} } = props;
	const [ enabled, setEnabled ] = React.useState(initEnabled);
	const appTheme = APP_THEME[appThemeId];

	// Update enable state
	React.useEffect(() => {
		setEnabled(initEnabled);
	},
	[initEnabled]);

	// Toggle switch enable
	const toggleSwitch = () => {
		setEnabled(!enabled);
		onChange(!enabled);
	};

	// Render
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
					trackColor={{ false: '#767577', true: '#81b0ff' }}
					value={ enabled }
					style={ styles.settingBtn }/>
			</View>
		);
	}
}


function MoreSetting(props) {
	const { title, appThemeId, onPress=() => {} } = props;
	const appTheme = APP_THEME[appThemeId];

	let settingStyle = [styles.setting, {
		backgroundColor: appTheme.SETTING_BACKGROUND,
		borderColor: appTheme.SETTING_BORDER,
	}];

	let textStyle = [styles.settingText, {
		color: appTheme.COLOR,
	}];

	return (
		<ButtonVibe style={ settingStyle } onPress={ onPress }>
			<TextVibe style={ textStyle }>{ title }</TextVibe>
			<Image source={ IMAGE[appThemeId === 'DARK' ? 'BACK' : 'BACK_DARK'] } style={ [styles.settingsIcon,  {transform: [{ scaleX: -1 }]}] }/>
		</ButtonVibe>
	);
}


// Signout
async function signOut() {
	try {
		await GoogleSignin.signOut();
		await auth().signOut();
		RootStore.reset();
		Object.assign(Cache, JSON.parse(JSON.stringify(CACHE_DEFAULT)));
		Storage.clear();
	}
	catch (error) {
		console.log(error);
	}
}

const tab_size = vw(7);

const styles = StyleSheet.create({
	view: {
		alignSelf: 'stretch',
		flex: 1,
	},

	tab: {
		width: tab_size,
		height: tab_size,
		marginTop: 'auto',
		marginBottom: 'auto',
	},

		setting: {
			margin: vw(2),
			marginBottom: 0,
			padding: vw(3),
			paddingHorizontal: vw(4),
			flexDirection: 'row',
			alignItems: 'center',
			borderRadius: vw(),
			...StyleUtil.makeShadow(),
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
