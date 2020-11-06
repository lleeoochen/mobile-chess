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
}

export default Grid;
