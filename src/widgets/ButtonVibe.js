import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { vw, vh } from 'chessvibe/src/Util';
import { TouchableOpacity as RNGHTouchableOpacity } from "react-native-gesture-handler";

export default function ButtonVibe(props) {
	let { style, children, useGestureButton=false, ...attributes } = props;
	if (!Array.isArray(style)) style = [style];

	let ButtonClass = useGestureButton ? RNGHTouchableOpacity : TouchableOpacity;

	return (
		<ButtonClass
			activeOpacity={ 0.65 }
			delayPressIn={0}
			style={ {...styles.button, ...Object.assign({}, ...style)} }
			{...attributes}>
			{ children }
		</ButtonClass>
	);
}

const borderRadius = vw();
const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: borderRadius,
	}
});
