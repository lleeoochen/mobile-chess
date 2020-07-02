import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, ImageBackground, StyleSheet } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import AutoHeightImage from 'react-native-auto-height-image';

export default function BackImage(props) {
	const theme = useSelector(state => state.theme);
	return (
		<ImageBackground source={ theme.BACKGROUND_IMAGE } style={ props.style }>
			{ props.children }
		</ImageBackground>
	);
}
