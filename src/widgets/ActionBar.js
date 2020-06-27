import * as React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import CONST from '../Constant.js';


export default function ActionBar(title, left_img, left_img_on_press, right_img, right_img_on_press) {

	let on_left_press = () => {
		if (left_img_on_press) left_img_on_press();
	};

	let on_right_press = () => {
		if (right_img_on_press) right_img_on_press();
	};

	return {
		headerTitle: () => (
			<Text style={ styles.title }>{ title }</Text>
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


const vw = Dimensions.get('window').width / 100.0;
const vh = Dimensions.get('window').height / 100.0;
const toolbar_title = 8 * vw;
const toolbar_btn_size = 10 * vw;

const styles = StyleSheet.create({
	toolbar: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: 'black',
	},

	title: {
		color: 'white',
		fontSize: toolbar_title,
		textAlignVertical: 'center',
		textAlign: 'center',
	},

	btnbox: {
		paddingLeft: 2 * vw,
		paddingRight: 2 * vw
	},

	btn: {
		width: toolbar_btn_size,
		height: toolbar_btn_size,
		marginTop: 'auto',
		marginBottom: 'auto'
	}
});
