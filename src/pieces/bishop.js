import Piece from './piece.js';

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getPossibleMoves(board) {
        const validMoves = [];
        const directions = [
            { x: 1, y: 1 },   // Diagonal down-right ↘️
            { x: 1, y: -1 },  // Diagonal up-right ↗️
            { x: -1, y: 1 },  // Diagonal down-left ↙️
            { x: -1, y: -1 }  // Diagonal up-left ↖️
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
    }
}

export default Bishop;
