import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TextVibe(props) {
	let { style, children, ...attributes } = props;
	if (!Array.isArray(style)) style = [style];

	return (
		<Text style={ {...styles.text, ...Object.assign({}, ...style)} } {...attributes}>
			{ children }
		</Text>
	);
}

const styles = StyleSheet.create({
	text: {
		fontFamily: 'Spectral'
	}
});
