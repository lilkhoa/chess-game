import Piece from './piece.js';

class Rook extends Piece {
    constructor(color, position) {
        super(color, position);
        this.hasMoved = false;
    }

    getPossibleMoves(board) {
        const validMoves = [];
        const directions = [
            { x: 1, y: 0 },  // right
            { x: -1, y: 0 }, // left
            { x: 0, y: 1 },  // down
            { x: 0, y: -1 }  // up
        ];

        for (const direction of directions) {
            let x = this.position.x;
            let y = this.position.y;

            while (true) {
                x += direction.x;
                y += direction.y;

                if (this.isInBounds(x, y)) {
                    const targetPiece = board.getPieceAt(x, y);
                    if (targetPiece) {
                        if (targetPiece.color !== this.color) {
                            validMoves.push({ x, y });
                        }
                        break; // Stop if we hit a piece
                    } else {
                        validMoves.push({ x, y });
                    }
                } else {
                    break; // Out of bounds
                }
            }
        }

        return validMoves;
    }

    move(newPosition) {
        super.move(newPosition);
        this.hasMoved = true; 
    }
}

export default Rook;