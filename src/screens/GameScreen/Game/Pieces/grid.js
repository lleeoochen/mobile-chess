class Grid {
	constructor(x, y, piece, color) {
		this.x = x;
		this.y = y;
		this.piece = piece;
		this.color = color;
	}

	clone() {
		return new Grid(this.x, this.y, this.piece, this.color);
	}

	sameGrid(otherGrid) {
		return this.x === otherGrid.x && this.y === otherGrid.y;
	}
}

export default Grid;
