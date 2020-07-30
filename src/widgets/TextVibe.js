import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TextVibe(props) {
	let { style={}, children, ...attributes } = props;
	if (!Array.isArray(style)) style = [style];

	let customStyle = {...Object.assign({}, ...style)};

	const textStyle = {
		fontFamily: 'Spectral',
		lineHeight: Platform.OS === 'android' && customStyle.fontSize ? customStyle.fontSize * 1.5 : null,
	};

	customStyle = {...textStyle, ...customStyle};
	return (
		<Text style={ customStyle } {...attributes}>
			{ children }
		</Text>
	);
}
