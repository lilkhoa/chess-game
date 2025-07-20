import Piece from './piece.js';

class Knight extends Piece {
    constructor(color, position) {
        super(color, position);
    }

    getPossibleMoves(board) {
        const moves = [];
        const directions = [
            { x: 2, y: 1 }, { x: 2, y: -1 },
            { x: -2, y: 1 }, { x: -2, y: -1 },
            { x: 1, y: 2 }, { x: 1, y: -2 },
            { x: -1, y: 2 }, { x: -1, y: -2 }
        ];

        for (const direction of directions) {
            const newX = this.position.x + direction.x;
            const newY = this.position.y + direction.y;

            if (this.isValidPosition(newX, newY, board)) {
                moves.push({ x: newX, y: newY });
            }
        }

        return moves;
    }

    move(newPosition) {
        super.move(newPosition);
    }
}

export default Knight;