import King from './pieces/king.js';
import Knight from './pieces/knight.js';
import Bishop from './pieces/bishop.js';
import GameRenderer from './features/game-renderer.js';
import PawnPromotion from './features/pawn-promotion.js';

class Utils {
    isInCheck(color, board) {
        const kingPosition = board.findKing(color);

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPieceAt(row, col);
                if (piece && piece.color !== color) {
                    const moves = piece.getPossibleMoves(board, { forCheck: true });
                    if (moves.some(move => move.x === kingPosition.x && move.y === kingPosition.y)) {
                        return true; // King is in check
                    }
                }
            }
        }

        return false;
    }

    getValidMoves(color, piece, board) {
        if (this.isInCheck(color, board)) {
            return piece.getPossibleMovesIfInCheck(board);
        } else {
            return this.filterMovesForCheck(color, piece, board);
        }
    }

    filterMovesForCheck(color, piece, board) {
        const allMoves = piece.getPossibleMoves(board);
        const validMoves = [];

        for (const move of allMoves) {
            if (piece.isValidPosition(move.x, move.y, board)) {
                if (!this.wouldMoveResultInCheck(color, piece, move, board)) {
                    validMoves.push(move);
                }
            }
        }

        return validMoves;
    }

    wouldMoveResultInCheck(color, piece, move, board) {
        const originalPosition = { ...piece.position };
        const targetPiece = board.getPieceAt(move.x, move.y);
        
        board.squares[move.y][move.x] = piece;
        board.squares[originalPosition.y][originalPosition.x] = null;
        piece.position = move;
        
        const wouldBeInCheck = this.isInCheck(color, board);
        
        board.squares[originalPosition.y][originalPosition.x] = piece;
        board.squares[move.y][move.x] = targetPiece;
        piece.position = originalPosition;
        
        return wouldBeInCheck;
    }

    checkForCheck(color, board) {
        GameRenderer.clearCheckHighlight();
        
        if (this.isInCheck(color, board)) {
            GameRenderer.highlightCheck(board, color);
        }
    }

    afterMove(color, board) {
        GameRenderer.clearCheckHighlight();
        const opponentColor = color === 'white' ? 'black' : 'white';        
        if (this.isInCheck(opponentColor, board)) {
            GameRenderer.highlightCheck(board, opponentColor);
        }

        if (PawnPromotion.isPromotingPawn(board, color)) {
            PawnPromotion.renderPromotingSelection(board, color);
        }
    }

    isCheckmate(color, board) {
        if (this.isInCheck(color, board)) {
            const pieces = board.getPieceByColor(color);
            for (const piece of pieces) {
                const validMoves = this.getValidMoves(color, piece, board);
                if (validMoves.length > 0) {
                    return false; // Player can make a move to escape check
                }
            }
            return true; // Player is in checkmate
        }
        return false; // Player is not in check, hence not in checkmate
    }

    isDraw(color, board) {
        return this.isStalemate(color, board) ||
               this.isInsufficientMaterial(board) ||
               this.isThreefoldRepetition(board);
    }

    isStalemate(color, board) {
        if (!this.isInCheck(color, board)) {
            const pieces = board.getPieceByColor(color);
            for (const piece of pieces) {
                const validMoves = this.getValidMoves(color, piece, board);
                if (validMoves.length > 0) {
                    return false; // Player can make a move, hence not stalemate
                }
            }
            return true; // Player has no valid moves and is not in check, hence stalemate
        }
        return false; // Player is in check, hence not stalemate
    }

    isInsufficientMaterial(board) {
        const whitePieces = board.getPieceByColor('white');
        const blackPieces = board.getPieceByColor('black');

        // King vs King
        if (whitePieces.length === 1 && blackPieces.length === 1) {
            return true; 
        }

        // King vs King + Knight (Bishop)
        if (whitePieces.length === 1 && blackPieces.length === 2 && blackPieces.every(piece => piece instanceof Knight 
                                                                                        || piece instanceof Bishop || piece instanceof King)) {
            return true; 
        }

        // King + Knight (Bishop) vs King
        if (blackPieces.length === 1 && whitePieces.length === 2 && whitePieces.every(piece => piece instanceof Knight 
                                                                                        || piece instanceof Bishop || piece instanceof King)) {
            return true; 
        }

        // King + Knight (Bishop) vs King + Knight (Bishop)
        if (whitePieces.length === 2 && blackPieces.length === 2 && 
            whitePieces.every(piece => piece instanceof Knight || piece instanceof Bishop || piece instanceof King) &&
            blackPieces.every(piece => piece instanceof Knight || piece instanceof Bishop || piece instanceof King)) {
            return true; 
        }

        // King vs King + 2 Knights
        if (whitePieces.length === 1 && blackPieces.length === 3 && 
            blackPieces.filter(piece => piece instanceof Knight).length === 2) {
            return true; 
        }

        // King + 2 Knights vs King
        if (blackPieces.length === 1 && whitePieces.length === 3 &&
            whitePieces.filter(piece => piece instanceof Knight).length === 2) {
            return true; 
        }

        return false;
    }

    isThreefoldRepetition(board) {
        let history;

        if (board.boardHistory.length < 9) {
            history = board.boardHistory;
        } else {
            history = board.boardHistory.slice(-9);
        }

        const positions = new Object();

        for (const position of history) {
            const key = position.map(piece => piece ? piece.toString() : 'null').join(',');
            if (!positions[key]) {
                positions[key] = 0;
            }

            positions[key]++;

            if (positions[key] >= 3) {
                return true; 
            }
        }
        return false; 
    }
}

export default new Utils();
