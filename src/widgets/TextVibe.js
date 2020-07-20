import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TextVibe(props) {
	let { style={}, children, ...attributes } = props;
	if (!Array.isArray(style)) style = [style];

	const textStyle = {
		fontFamily: 'Spectral',
		lineHeight: Platform.OS === 'android' && style.fontSize ? style.fontSize * 1.5 : null,
	};

	return (
		<Text style={ {...textStyle, ...Object.assign({}, ...style)} } {...attributes}>
			{ children }
		</Text>
	);
}
