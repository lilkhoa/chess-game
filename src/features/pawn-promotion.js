import Pawn from '../pieces/pawn.js';
import Queen from '../pieces/queen.js';
import Rook from '../pieces/rook.js';
import Bishop from '../pieces/bishop.js';
import Knight from '../pieces/knight.js';
import utils from '../utils.js';
import MoveNotation from './move-notation.js';

class PawnPromotion {
    promotePawn(board, color, newPieceClass) {
        const row = color === 'white' ? 0 : 7;
        const opponentColor = color === 'white' ? 'black' : 'white';
        for (let col = 0; col < 8; col++) {
            const piece = board.getPieceAt(col, row);
            if (piece && piece instanceof Pawn && piece.color === color) {
                const newPiece = piece.promote(newPieceClass);
                board.squares[row][col] = newPiece; 
                newPiece.position = { x: col, y: row }; 
                
                // Update the last move in history with promotion info
                if (board.moveHistory.length > 0) {
                    const lastMove = board.moveHistory[board.moveHistory.length - 1];
                    if (lastMove.isPromoting) {
                        lastMove.promotedTo = newPiece.constructor.name;

                        const isCheck = utils.isInCheck(opponentColor, board);
                        const isCheckmate = utils.isCheckmate(opponentColor, board);
                        lastMove.isCheck = isCheck;
                        lastMove.isCheckmate = isCheckmate;
                        
                        MoveNotation.renderGameMove(board);
                    }
                }
                
                board.render(); 
                utils.checkForCheck(opponentColor, board);
                return;
            }
        }
    }

    renderPromotingSelection(board, color) {
        const promotionContainer = document.getElementById('promotion-selection');
        promotionContainer.innerHTML = ''; // Clear previous content

        const pieces = [
            { name: 'Queen', class: Queen },
            { name: 'Rook', class: Rook },
            { name: 'Bishop', class: Bishop },
            { name: 'Knight', class: Knight }
        ];

        pieces.forEach(piece => {
            const button = document.createElement('button');
            button.className = `promotion-button ${color}-${piece.name.toLowerCase()}`;
            button.addEventListener('click', () => {
                this.promotePawn(board, color, piece.class);
                promotionContainer.style.display = 'none'; // Hide the promotion selection
            });
            promotionContainer.appendChild(button);
        });

        promotionContainer.style.display = 'block'; // Show the promotion selection
    }

    isPromotingPawn(board, color) {
        const row = color === 'white' ? 0 : 7; 
        for (let col = 0; col < 8; col++) {
            const piece = board.getPieceAt(col, row);
            if (piece && piece instanceof Pawn && piece.color === color) {
                return true; 
            }
        }
        return false;
    }
}

export default new PawnPromotion();
