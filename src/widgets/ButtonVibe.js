import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { vw, vh } from 'chessvibe/src/Util';

export default function ButtonVibe(props) {
	let { style, children, ...attributes } = props;
	if (!Array.isArray(style)) style = [style];

	return (
		<TouchableOpacity
			activeOpacity={ 0.65 }
			delayPressIn={0}
			style={ {...styles.button, ...Object.assign({}, ...style)} }
			{...attributes}>
			{ children }
		</TouchableOpacity>
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
