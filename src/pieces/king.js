import Piece from './piece.js';
import utils from '../utils.js';

class King extends Piece {
    constructor(color, position) {
        super(color, position);
        this.hasMoved = false;
    }

    getPossibleMoves(board, options = {}) {
        const validMoves = [];
        const directions = [
            { x: 1, y: 0 }, { x: -1, y: 0 }, // horizontal
            { x: 0, y: 1 }, { x: 0, y: -1 }, // vertical
            { x: 1, y: 1 }, { x: 1, y: -1 }, // diagonal
            { x: -1, y: 1 }, { x: -1, y: -1 } // diagonal
        ];

        for (const direction of directions) {
            const newX = this.position.x + direction.x;
            const newY = this.position.y + direction.y;

            if (this.isValidPosition(newX, newY, board)) {
                validMoves.push({ x: newX, y: newY });
            }
        }

        // Check for castling
        if (!options.forCheck && !this.hasMoved) {
            const rookPositions = [
                { x: 0, y: this.position.y }, // left rook
                { x: 7, y: this.position.y }  // right rook
            ];
            for (const rookPosition of rookPositions) {
                const rook = board.getPieceAt(rookPosition.x, rookPosition.y);
                if (rook && rook.constructor.name === 'Rook' && !rook.hasMoved) {
                    // Check if squares between king and rook are empty
                    const step = rookPosition.x < this.position.x ? -1 : 1;
                    let canCastle = true;
                    for (let x = this.position.x + step; x !== rookPosition.x; x += step) {
                        if (board.getPieceAt(x, this.position.y)) {
                            canCastle = false;
                            break;
                        }
                    }
                    // Check if king is not in check and does not pass through check
                    if (canCastle && !utils.isInCheck(this.color, board)) {
                        const newKingPosition = rookPosition.x < this.position.x ?
                            { x: this.position.x - 2, y: this.position.y } : // Move king left
                            { x: this.position.x + 2, y: this.position.y }; // Move king right
                        validMoves.push(newKingPosition);
                    }
                }
            }
        }
        return validMoves;
    }
    
    move(newPosition, board) {
        // Castling
        if (Math.abs(newPosition.x - this.position.x) === 2) {
            const rookX = newPosition.x < this.position.x ? 0 : 7; // Determine rook's x position
            const rookNewX = newPosition.x < this.position.x ? 3 : 5; // New rook position after castling
            const rookY = this.position.y; // Rook's y position remains the same
            const rook = board.getPieceAt(rookX, rookY);
            rook.move({ x: rookNewX, y: this.position.y });
            board.squares[rookY][rookX] = null; // Clear old rook position
            board.squares[rookY][rookNewX] = rook; // Place rook in
        }

        super.move(newPosition);
        this.hasMoved = true;
    }
}

export default King;