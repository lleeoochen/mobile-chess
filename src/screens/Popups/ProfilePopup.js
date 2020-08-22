import * as React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { TextVibe, ModalVibe, ButtonVibe } from 'chessvibe/src/widgets';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';
import Cache from 'chessvibe/src/Cache';
import { useSelector } from 'react-redux';
import { IMAGE, APP_THEME } from 'chessvibe/src/Const';
import Store, { PopupStore } from 'chessvibe/src/redux/Store';

const new_match_img = require('chessvibe/assets/new_match.png');
const borderRadius = vw();

export default function ProfilePopup(props) {
	const isDarkTheme = useSelector(state => state.home.isDarkTheme);
	const appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	const profile = useSelector(state => state.popup.profile) || {};
	const visible = profile.name !== undefined;
	const color = { color: appTheme.COLOR };

	const onDismiss = () => {
		PopupStore.closeProfile();
	};

	return(
		<ModalVibe
			coverAll={ true }
			isVisible={ visible }
			onDismiss={ onDismiss }>
			<View style={ styles.header }>
				<TextVibe style={ [styles.title, color] }>{ profile.name }</TextVibe>
				<AutoHeightImage
					width={ vw(40) }
					style={ styles.titleImage }
					source={ profile.photo ? { uri: profile.photo + '=c' } : IMAGE.NEW_MATCH }/>
			</View>
			<View style={ styles.content }>
				<TextVibe style={ [styles.text, color] }> { profile.email } </TextVibe>
			</View>
		</ModalVibe>
	)
}

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		marginBottom: vw(5),
	},

		title: {
			fontSize: vw(7),
			marginBottom: vw(2),
		},

		titleImage: {
			borderRadius: vw(),
		},

	content: {
		alignItems: 'center',
	},

		text: {
			fontSize: vw(5),
		},
});