import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { vw, vh, piece } from 'chessvibe/src/Util';
import { BOARD_SIZE, TEAM, CHESS } from 'chessvibe/src/Const';


export default function ChessBoard(props) {
	const board = useSelector(state => state.game.chessboard);

	// Mount
	React.useEffect(() => {
	}, []);

	// Render
	let grids = [];

	if (board) {
		for (let x = 0; x < BOARD_SIZE; x++) {
			for (let y = 0; y < BOARD_SIZE; y++) {
				if (piece(board[x][y])) {
					grids.push(
						<Image
							source={ piece(board[x][y]).image }
							style={ [styles.grid, styles['x' + x], styles['y' + y]] } />
					);
				}
			}
		}
	}

	return (
		<View style={ props.style }>
		{ grids }
		</View>
	);
}



// Styles
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
