import * as React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { vw } from 'chessvibe/src/Util';

export default function BackImage(props) {
	const theme = useSelector(state => state.game.theme);

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