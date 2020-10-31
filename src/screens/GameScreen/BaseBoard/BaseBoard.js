import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { vw } from 'chessvibe/src/Util';
import * as Const from 'chessvibe/src/Const';

import BaseBoardGrid from './BaseBoardGrid';
import BasePlayerPanel from './BasePlayerPanel';

export default function BaseBoard() {
	const theme = useSelector(state => state.game.theme);
	const downward = useSelector(state => state.game.downward);
	const team = useSelector(state => state.game.team);


	//Get numbering from grid
	function getNumbering(x, y) {
		let result = {
			x: (team == Const.TEAM.B) ? y + 1 : Const.BOARD_SIZE - y,
			y: (team == Const.TEAM.B) ? String.fromCharCode(97 + 7 - x) : String.fromCharCode(x + 97)
		};

		if (x != 0) result.x = null;
		if (y != Const.BOARD_SIZE - 1) result.y = null;

		return result;
	}


	// Render
	let grids = [];

	for (let x = 0; x < Const.BOARD_SIZE; x++) {
		for (let y = 0; y < Const.BOARD_SIZE; y++) {
			let isLight = (y % 2 != 0) ^ (x % 2 == 0);
			let color = isLight ? theme.COLOR_BOARD_LIGHT : theme.COLOR_BOARD_DARK;

			let gridStyle = {
				width: cell_size,
				height: cell_size,
				position: 'absolute',
			};

			// Prevent gap between cells
			if (isLight) {
				let padding = {top: 1, left: 1, bottom: 1, right: 1};

				if (x === 0) {padding.left = 0;}
				if (x === 7) {padding.right = 0;}
				if (y === 0) {padding.top = 0;}
				if (y === 7) {padding.bottom = 0;}

				gridStyle.width += (padding.left + padding.right);
				gridStyle.height += (padding.top + padding.bottom);
				gridStyle.transform = [
					{translateX: -1 * padding.left},
					{translateY: -1 * padding.top},
				];
			}

			grids.push(
				<BaseBoardGrid
					x={x}
					y={y}
					numbering={getNumbering(x, y)}
					key={x + '-' + y}
					style={[gridStyle, styles['x' + x], styles['y' + y]]}
					color={color}
					isLight={isLight}
					theme={theme}/>
			);
		}
	}

	let blackTop = team == Const.TEAM.W ? !downward : downward;

	return (
		<View style={ styles.container }>
			<BasePlayerPanel color={ blackTop ? 'black' : 'white' } pos={ 'top' }/>
			<View style={ styles.board }>
				{ grids }
			</View>
			<BasePlayerPanel color={ blackTop ? 'white' : 'black' } pos={ 'bottom' }/>
		</View>
	);
}

const margin_size = vw(1);
const cell_size = (vw(100) - 4 * margin_size) / 8;
const canvas_size = margin_size * 2 + cell_size * 8;

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

	container: {
		position: 'absolute'
	},

	board: {
		width: canvas_size,
		height: canvas_size,
		borderWidth: margin_size,
		borderColor: 'transparent',
	},
});
