import * as React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { vw, vh } from 'chessvibe/src/Util';
import { IMAGE, APP_THEME } from 'chessvibe/src/Const';
import TextVibe from './TextVibe';
import ButtonVibe from './ButtonVibe';

export default function ActionBar(title, left_img, left_img_on_press, right_img, right_img_on_press, isDarkTheme=true) {

	let on_left_press = () => {
		if (left_img_on_press) left_img_on_press();
	};

	let on_right_press = () => {
		if (right_img_on_press) right_img_on_press();
	};


	let appTheme = isDarkTheme ? APP_THEME.DARK : APP_THEME.LIGHT;

	let titleStyle = [styles.title, {
		color: appTheme.COLOR
	}];

	if (!isDarkTheme) {
		left_img += '_DARK';
		right_img += '_DARK';
	}

	return {
		headerStyle: {
			backgroundColor: appTheme.APP_BACKGROUND,
			shadowColor: 'black',
			shadowRadius: vw(0.5),
			elevation: 2,
			height: vw(15),
		},
		headerTitle: () => (
			<TextVibe style={ titleStyle }>{ title }</TextVibe>
		),
		headerLeft: () => (
			<ButtonVibe style={ styles.btnbox } onPress={ on_left_press }>
				<Image style={ styles.btn } source={ IMAGE[left_img] }/>
			</ButtonVibe>
		),
		headerRight: () => (
			<ButtonVibe style={ styles.btnbox } onPress={ on_right_press }>
				<Image style={ styles.btn } source={ IMAGE[right_img] }/>
			</ButtonVibe>
		),
	};
}


const toolbar_title = vw(8);
const toolbar_btn_size = vw(10);

const styles = StyleSheet.create({

	title: {
		color: 'white',
		fontSize: toolbar_title,
		textAlignVertical: 'center',
		textAlign: 'center',
	},

	btnbox: {
		paddingLeft: vw(2),
		paddingRight: vw(2),
	},

	btn: {
		width: toolbar_btn_size,
		height: toolbar_btn_size,
		marginTop: 'auto',
		marginBottom: 'auto'
	}
});
