import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { vw } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';
import { TextVibe } from 'chessvibe/src/widgets';

export default function BaseBoardGrid(props) {
	let { x, y, numbering, color, isLight, theme, style } = props;
	let gridColor = useSelector(state => state.game.baseboard[x][y]);

	// Set highlight color
	if (gridColor == Const.COLOR_HIGHLIGHT)
		color = isLight ? theme.COLOR_HIGHLIGHT_LIGHT : theme.COLOR_HIGHLIGHT_DARK;

	// Set lastmove color
	if (gridColor == Const.COLOR_LAST_MOVE)
		color = isLight ? theme.COLOR_LAST_MOVE_LIGHT : theme.COLOR_LAST_MOVE_DARK;

	// Set numbering color
	let numberingColor = isLight ? 'black' : 'white';

	return (
		<View style={ [style, { backgroundColor: color }] }>
			<TextVibe style={ [styles.numberingX, { color: numberingColor }] }>{ numbering.x }</TextVibe>
			<TextVibe style={ [styles.numberingY, { color: numberingColor }] }>{ numbering.y }</TextVibe>
		</View>
	);
}

const styles = StyleSheet.create({
		numberingX: {
			position: 'absolute',
			left: 2,
			fontSize: vw(3),
			fontWeight: 'bold',
		},

		numberingY: {
			position: 'absolute',
			right: 2,
			bottom: -2,
			fontSize: vw(3),
			textAlign: 'right',
			fontWeight: 'bold',
		},
});