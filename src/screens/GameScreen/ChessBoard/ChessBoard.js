import * as React from 'react';
import { StatusBar, View, SafeAreaView, Text, Image, StyleSheet, Animated } from 'react-native';
import { useSelector, shallowEqual } from 'react-redux';
import { vw, vh, piece } from 'chessvibe/src/Util';
import { BOARD_SIZE, TEAM, CHESS } from 'chessvibe/src/Const';


export default function ChessBoard(props) {
	const oldPieces = React.useRef({});
	const board = useSelector(state => state.game.chessboard.slice());

	// Mount
	React.useEffect(() => {
	}, []);


	// Animation
	function interpolation(orig, dest) {
		const val = new Animated.Value(0);

		Animated.timing(val, {
			toValue: 1,
			duration: 150,
			useNativeDriver: true,
		}).start();

		const translation = val.interpolate({
			inputRange: [0, 1],
			outputRange: [orig * cell_size, dest * cell_size]
		});

		return translation;
	}


	// Render
	let pieces = [];

	for (let x = 0; x < BOARD_SIZE; x++) {
		for (let y = 0; y < BOARD_SIZE; y++) {

			if (piece(board[x][y])) {
				// Get piece's previous location
				let prevPiece = oldPieces.current[board[x][y].piece];
				let oldx = prevPiece ? prevPiece.x : x;
				let oldy = prevPiece ? prevPiece.y : y;
				let mypiece;

				// Without animation
				if (oldx == x && oldy == y) {
					mypiece = (
						<Image
							key={x + '-' + y}
							source={ piece(board[x][y]).image }
							style={ [styles.grid, styles['x' + x], styles['y' + y]] } />
					);
				}

				// With animation
				else {
					let transform = {
						transform: [
							{ translateX: interpolation(oldx, x) },
							{ translateY: interpolation(oldy, y) },
						]
					};

					mypiece = (
						<Animated.Image
							key={x + '-' + y}
							source={ piece(board[x][y]).image }
							style={[ styles.grid, transform ]} />
					);
				}

				// Track piece
				pieces.push(mypiece);
				oldPieces.current[board[x][y].piece] = { x, y };
			}
		}
	}

	return (
		<View style={ props.style }>
			{ pieces }
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
