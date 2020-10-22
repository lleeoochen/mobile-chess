import * as React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { vw } from 'chessvibe/src/Util';
import { BOARD_SIZE } from 'chessvibe/src/Const';


export default function ClickBoard(props) {
	let grids = [];

	for (let x = 0; x < BOARD_SIZE; x++) {
		for (let y = 0; y < BOARD_SIZE; y++) {
			grids.push(
				<TouchableOpacity
					key={x + '-' + y}
					style={ [styles.grid, styles['x' + x], styles['y' + y]] }
					onPress={ () => props.onPress(x, y) }/>
			);
		}
	}

	return (
		<View style={ props.style }>
		{ grids }
		</View>
	);
}

const margin_size = vw(1);
const cell_size = (vw(100) - 4 * margin_size) / 8;

/* eslint-disable react-native/no-unused-styles */
const styles = StyleSheet.create({
	x0: { left: 0 * cell_size },
	x1: { left: 1 * cell_size },
	x2: { left: 2 * cell_size },
	x3: { left: 3 * cell_size },
	x4: { left: 4 * cell_size },
	x5: { left: 5 * cell_size },
	x6: { left: 6 * cell_size },
	x7: { left: 7 * cell_size },

	y0: { top: 0 * cell_size },
	y1: { top: 1 * cell_size },
	y2: { top: 2 * cell_size },
	y3: { top: 3 * cell_size },
	y4: { top: 4 * cell_size },
	y5: { top: 5 * cell_size },
	y6: { top: 6 * cell_size },
	y7: { top: 7 * cell_size },

	grid: {
		width: cell_size,
		height: cell_size,
		position: 'absolute',
	}
});
