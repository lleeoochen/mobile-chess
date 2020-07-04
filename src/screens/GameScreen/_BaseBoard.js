import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import Store from 'chessvibe/src/redux/Store';
import * as Reducer from 'chessvibe/src/redux/Reducer';
import { vw, vh } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';

import BaseBoardGrid from './_BaseBoardGrid';


export default function BaseBoard(props) {
	const theme = useSelector(state => state.theme);

	// Render
	let grids = [];

	for (let x = 0; x < Const.BOARD_SIZE; x++) {
		for (let y = 0; y < Const.BOARD_SIZE; y++) {
			let isLight = (y % 2 != 0) ^ (x % 2 == 0);
			let color = isLight ? theme.COLOR_BOARD_LIGHT : theme.COLOR_BOARD_DARK;

			grids.push(
				<BaseBoardGrid
					x={x}
					y={y}
					key={x + '-' + y}
					style={[styles.grid, styles['x' + x], styles['y' + y]]}
					color={color}
					isLight={isLight}
					theme={theme}/>
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
		// transition: .2s all ease;
		position: 'absolute'
	}
});
