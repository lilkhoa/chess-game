import Piece from './piece.js';

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
        this.hasMoved = false;
        this.moveTwice = false; // Used for en passant
    }

    getPossibleMoves(board) {
        const validMoves = [];
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // Move forward
        const forwardMove = { x: this.position.x, y: this.position.y + direction };
        if (board.isEmpty(forwardMove)) {
            validMoves.push(forwardMove);
            // Double move from starting position
            if (!this.hasMoved && board.isEmpty({ x: this.position.x, y: this.position.y + 2 * direction })) {
                validMoves.push({ x: this.position.x, y: this.position.y + 2 * direction });
            }
        }

        // Capture diagonally
        const captureMoves = [
            { x: this.position.x - 1, y: this.position.y + direction },
            { x: this.position.x + 1, y: this.position.y + direction }
        ];
        for (const move of captureMoves) {
            if (board.isOpponentPiece(move, this.color)) {
                validMoves.push(move);
            }
        }

        // En passant capture
        if (Math.abs(this.position.y - startRow) === 3) {
            const targetPawnLeft = board.getPieceAt(this.position.x - 1, this.position.y);
            if (
                targetPawnLeft && 
                targetPawnLeft instanceof Pawn && 
                targetPawnLeft.color !== this.color && 
                targetPawnLeft.moveTwice && 
                board.moveHistory[board.moveHistory.length - 1].piece === targetPawnLeft
            ) {
                validMoves.push({ x: this.position.x - 1, y: this.position.y + direction });
            }

            const targetPawnRight = board.getPieceAt(this.position.x + 1, this.position.y);
            if (
                targetPawnRight && 
                targetPawnRight instanceof Pawn && 
                targetPawnRight.color !== this.color && 
                targetPawnRight.moveTwice && 
                board.moveHistory[board.moveHistory.length - 1].piece === targetPawnRight
            ) {
                validMoves.push({ x: this.position.x + 1, y: this.position.y + direction });
            }
        }

        return validMoves;
    }

    promote(newPiece) {
        return new newPiece(this.color, this.position);
    }

    move(newPosition) {
        if (Math.abs(newPosition.y - this.position.y) === 2) {
            this.moveTwice = true;
        }
        super.move(newPosition);
        this.hasMoved = true;
    }
}

export default Pawn;