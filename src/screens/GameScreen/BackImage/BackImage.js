import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, ImageBackground, StyleSheet } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import AutoHeightImage from 'react-native-auto-height-image';
import { vw } from 'chessvibe/src/Util';

export default function BackImage(props) {
	const theme = useSelector(state => state.theme);

	return (
		<ImageBackground
			source={ theme.BACKGROUND_IMAGE }
			blurRadius={ vw(2) }
			style={ [props.style, styles.image] }>
			{ props.children }
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	image: {
		height: '100%',
		zIndex: -100,
		backgroundColor: 'black',
	}
});