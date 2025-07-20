import utils from '../utils.js';

class Piece {
    constructor(color, position) {
        this.color = color; // 'white' or 'black'
        this.position = position; // { x: number, y: number }
    }

    move(newPosition) {
        this.position = newPosition;
    }

    getPossibleMoves(board) {
        // Logic to get all possible moves for the piece
        return []; // Placeholder for actual move generation
    }

    getPossibleMovesIfInCheck(board) {
        const possibleMoves = this.getPossibleMoves(board);
        const validMoves = [];

        for (const move of possibleMoves) {
            if (this.isValidPosition(move.x, move.y, board)) {
                // Temporarily move the piece to check if it results in a check
                const originalPosition = { ...this.position };
                const originalHasMoved = this.hasMoved ? this.hasMoved : undefined;
                const targetPiece = board.getPieceAt(move.x, move.y);
                board.squares[move.y][move.x] = this; // Move piece to new
                board.squares[originalPosition.y][originalPosition.x] = null; // Clear original position
                this.position = move;

                if (!utils.isInCheck(this.color, board)) {
                    validMoves.push(move);
                }

                // Restore original position
                board.squares[originalPosition.y][originalPosition.x] = this;
                board.squares[move.y][move.x] = targetPiece; // Restore target piece
                this.position = originalPosition;

                if (originalHasMoved !== undefined) {
                    this.hasMoved = originalHasMoved; // Restore hasMoved state
                }
            }
        }

        return validMoves;
    }

    isValidPosition(x, y, board) {
        if (x < 0 || x >= 8 || y < 0 || y >= 8) {
            return false;
        }
        const targetPiece = board.getPieceAt(x, y);
        return !targetPiece || targetPiece.color !== this.color;
    }

    isInBounds(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
}

export default Piece;