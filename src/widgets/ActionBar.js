import * as React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { vw, vh } from '../Util';
import TextVibe from './TextVibe';

export default function ActionBar(title, left_img, left_img_on_press, right_img, right_img_on_press) {

	let on_left_press = () => {
		if (left_img_on_press) left_img_on_press();
	};

	let on_right_press = () => {
		if (right_img_on_press) right_img_on_press();
	};

	return {
		headerTitle: () => (
			<TextVibe style={ styles.title }>{ title }</TextVibe>
		),
		headerLeft: () => (
			<TouchableOpacity style={ styles.btnbox } onPress={ on_left_press }>
				<Image style={ styles.btn } source={ left_img }/>
			</TouchableOpacity>
		),
		headerRight: () => (
			<TouchableOpacity style={ styles.btnbox } onPress={ on_right_press }>
				<Image style={ styles.btn } source={ right_img }/>
			</TouchableOpacity>
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
