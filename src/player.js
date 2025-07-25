import utils from './utils.js';
import GameRenderer from './features/game-renderer.js';

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.isActive = false;
        this.currentMoveListeners = [];
        this.selectedPiece = null;
        this.selectedPosition = null;
        this.pieceClickHandler = null;
    }

    makeMove(board) {
        return new Promise(resolve => {
            this.isActive = true;
            
            // Check if the current player's king is in check at the start of the turn
            utils.checkForCheck(this.color, board);
            
            this.pieceClickHandler = (event) => {
                const { piece, position } = event.detail;
                
                if (this.isActive && piece.color === this.color) {
                    if (this.selectedPiece === piece) {
                        this.deselectPiece();
                        return;
                    }
                    
                    this.clearMoveListeners();
                    GameRenderer.clearHighlights();
                    
                    this.selectedPiece = piece;
                    this.selectedPosition = position;
                    
                    // Get moves that don't result in check
                    const possibleMoves = utils.getValidMoves(piece, board);
                    GameRenderer.highlightSelectedPiece(piece);
                    GameRenderer.highlightPossibleMoves(possibleMoves);
                    this.setupMoveListeners(board, piece, position, possibleMoves, resolve);
                } 
            };

            board.addEventListener('pieceClicked', this.pieceClickHandler);
        });
    }

    setupMoveListeners(board, piece, startPosition, possibleMoves, resolve) {
        possibleMoves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.y}"][data-col="${move.x}"]`);
            if (square) {
                const moveHandler = () => {
                    board.update(startPosition, move);
                    
                    utils.afterMove(this.color, board);
                    
                    this.completeTurn(board, resolve);
                };
                
                square.addEventListener('click', moveHandler);
                this.currentMoveListeners.push({ element: square, handler: moveHandler });
            }
        });
    }

    completeTurn(board, resolve) {
        this.deselectPiece();
        this.isActive = false;
        if (this.pieceClickHandler) {
            board.removeEventListener('pieceClicked', this.pieceClickHandler);
            this.pieceClickHandler = null;
        }
        
        resolve();
    }

    deselectPiece() {
        this.selectedPiece = null;
        this.selectedPosition = null;
        this.clearMoveListeners();
        GameRenderer.clearHighlights();
    }

    clearMoveListeners() {
        this.currentMoveListeners.forEach(({ element, handler }) => {
            element.removeEventListener('click', handler);
        });
        this.currentMoveListeners = [];
    }
}

export default Player;
