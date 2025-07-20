import Pawn from './pieces/pawn.js';
import King from './pieces/king.js';
import Queen from './pieces/queen.js';
import Rook from './pieces/rook.js';
import Bishop from './pieces/bishop.js';
import Knight from './pieces/knight.js';
import utils from './utils.js';
import MoveNotation from './features/move-notation.js';
import PieceCapture from './features/piece-capture.js'; 
import GameRenderer from './features/game-renderer.js';

class Board extends EventTarget {
    constructor() {
        super(); // Call EventTarget constructor
        this.squares = this.createBoard();
        this.selectedPiece = null;
        this.selectedPosition = null;
        this.moveHistory = [];
        this.boardHistory = [];
        
        const chessBoard = document.getElementById('chess-board');
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = (row + col) % 2 === 0 ? 'square light' : 'square dark';
                square.dataset.row = row;
                square.dataset.col = col;
                square.style.gridRow = row + 1;
                square.style.gridColumn = col + 1;
                chessBoard.appendChild(square);
            }
        }
    }

    deepCopyBoard() {
        const copySquares = [];
        for (let row = 0; row < 8; row++) {
            copySquares[row] = [];
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece) {
                    // Create a new piece with the same properties
                    const PieceClass = piece.constructor;
                    const copiedPiece = new PieceClass(piece.color, { ...piece.position });
                    // Copy any additional properties if needed
                    if (piece.hasMoved !== undefined) copiedPiece.hasMoved = piece.hasMoved;
                    copySquares[row][col] = copiedPiece;
                } else {
                    copySquares[row][col] = null;
                }
            }
        }
        return copySquares;
    }

    createBoard() {
        const squares = [];
        for (let i = 0; i < 8; i++) {
            squares[i] = Array(8).fill(null);
        }
        return squares;
    }

    setup() {
        // Set up pieces on the board
        const pieces = [
            // Black pieces (row 0)
            { piece: new Rook('black', { x: 0, y: 0 }), pieceName: 'black-rook' },
            { piece: new Knight('black', { x: 1, y: 0 }), pieceName: 'black-knight' },
            { piece: new Bishop('black', { x: 2, y: 0 }), pieceName: 'black-bishop' },
            { piece: new Queen('black', { x: 3, y: 0 }), pieceName: 'black-queen' },
            { piece: new King('black', { x: 4, y: 0 }), pieceName: 'black-king' },
            { piece: new Bishop('black', { x: 5, y: 0 }), pieceName: 'black-bishop' },
            { piece: new Knight('black', { x: 6, y: 0 }), pieceName: 'black-knight' },
            { piece: new Rook('black', { x: 7, y: 0 }), pieceName: 'black-rook' },

            // Black pawns (row 1)
            { piece: new Pawn('black', { x: 0, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 1, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 2, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 3, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 4, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 5, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 6, y: 1 }), pieceName: 'black-pawn' },
            { piece: new Pawn('black', { x: 7, y: 1 }), pieceName: 'black-pawn' },

            // White pawns (row 6)
            { piece: new Pawn('white', { x: 0, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 1, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 2, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 3, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 4, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 5, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 6, y: 6 }), pieceName: 'white-pawn' },
            { piece: new Pawn('white', { x: 7, y: 6 }), pieceName: 'white-pawn' },

            // White pieces (row 7)
            { piece: new Rook('white', { x: 0, y: 7 }), pieceName: 'white-rook' },
            { piece: new Knight('white', { x: 1, y: 7 }), pieceName: 'white-knight' },
            { piece: new Bishop('white', { x: 2, y: 7 }), pieceName: 'white-bishop' },
            { piece: new Queen('white', { x: 3, y: 7 }), pieceName: 'white-queen' },
            { piece: new King('white', { x: 4, y: 7 }), pieceName: 'white-king' },
            { piece: new Bishop('white', { x: 5, y: 7 }), pieceName: 'white-bishop' },
            { piece: new Knight('white', { x: 6, y: 7 }), pieceName: 'white-knight' },
            { piece: new Rook('white', { x: 7, y: 7 }), pieceName: 'white-rook' }
        ];

        pieces.forEach(p => {
            const { x, y } = p.piece.position;
            const square = document.querySelector(`[data-row="${y}"][data-col="${x}"]`);
            if (square) {
                const pieceDiv = document.createElement('div');
                pieceDiv.className = `piece ${p.pieceName}`;
                
                // Emit custom event instead of using callback
                pieceDiv.addEventListener('click', () => {
                    this.dispatchEvent(new CustomEvent('pieceClicked', {
                        detail: { piece: p.piece, position: { x, y } }
                    }));
                });

                square.appendChild(pieceDiv);
                this.squares[y][x] = p.piece;
            }
        });
    }

    render() {
        document.querySelectorAll('.piece').forEach(piece => piece.remove());
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece) {
                    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (square) {
                        const pieceDiv = document.createElement('div');
                        pieceDiv.className = `piece ${piece.color}-${piece.constructor.name.toLowerCase()}`;
                        
                        // Emit custom event
                        pieceDiv.addEventListener('click', () => {
                            this.dispatchEvent(new CustomEvent('pieceClicked', {
                                detail: { piece: piece, position: { x: col, y: row } }
                            }));
                        });

                        square.appendChild(pieceDiv);
                    }
                }
            }
        }
    }

    update(oldPosition, newPosition) {
        const piece = this.getPieceAt(oldPosition.x, oldPosition.y);
        let capturedPiece = this.getPieceAt(newPosition.x, newPosition.y);
        if (!piece) {
            return;
        }
        
        // Check if this is a pawn promotion before moving
        const isPromoting = piece instanceof Pawn && 
                       ((piece.color === 'white' && newPosition.y === 0) || 
                        (piece.color === 'black' && newPosition.y === 7));

        const fromSquare = String.fromCharCode(97 + oldPosition.x) + (8 - oldPosition.y);
        const toSquare = String.fromCharCode(97 + newPosition.x) + (8 - newPosition.y);
        const ambiguityInfo = MoveNotation.getAmbiguityInfo(this, piece, fromSquare, toSquare);
    
        this.squares[newPosition.y][newPosition.x] = piece;
        this.squares[oldPosition.y][oldPosition.x] = null;
        
        piece.move(newPosition, this);

        // En passant logic
        if (
            piece instanceof Pawn &&
            Math.abs(newPosition.y - oldPosition.y) === 1 &&
            Math.abs(newPosition.x - oldPosition.x) === 1 &&
            !capturedPiece
        ) {
            const direction = piece.color === 'white' ? -1 : 1;
            this.squares[newPosition.y - direction][newPosition.x] = null;
            capturedPiece = new Pawn(piece.color === 'white' ? 'black' : 'white', {x:0, y:0});
        }

        if (capturedPiece) {
            PieceCapture.addCapturedPiece(capturedPiece, piece.color);
        }

        const kingSideCastle = piece instanceof King && oldPosition.x === 4 && newPosition.x === 6 && oldPosition.y === newPosition.y;
        const queenSideCastle = piece instanceof King && oldPosition.x === 4 && newPosition.x === 2 && oldPosition.y === newPosition.y;
        const isCheck = utils.isInCheck(piece.color === 'white' ? 'black' : 'white', this);
        const isCheckmate = utils.isCheckmate(piece.color === 'white' ? 'black' : 'white', this);
        
        // Store the move with promotion info
        this.moveHistory.push({ 
            piece, 
            capturedPiece, 
            oldPosition, 
            newPosition, 
            kingSideCastle, 
            queenSideCastle, 
            isCheck, 
            isCheckmate, 
            isPromoting,
            promotedTo: null, 
            ambiguityInfo,
        }); 

        this.boardHistory.push(this.deepCopyBoard());
        
        if (!isPromoting) {
            MoveNotation.renderGameMove(this);
        }
        
        this.render();
    }

    reset() {
        this.squares = this.createBoard();
        
        this.moveHistory = [];
        this.boardHistory = [];
        this.selectedPiece = null;
        this.selectedPosition = null;
        
        document.querySelectorAll('.piece').forEach(piece => piece.remove());
        
        PieceCapture.clearCapturedPieces();
        MoveNotation.clearMovePanel();
        GameRenderer.switchPlayerTurnRender('black');
    }

    isEmpty(position) {
        const { x, y } = position;
        if (x < 0 || x >= 8 || y < 0 || y >= 8) {
            return false; 
        }
        return this.squares[y][x] === null; 
    }

    isOpponentPiece(position, color) {
        const { x, y } = position;
        if (x < 0 || x >= 8 || y < 0 || y >= 8) {
            return false; 
        }
        const piece = this.squares[y][x];
        if (!piece) return false; 
        return piece.color.startsWith(color === 'white' ? 'black' : 'white');
    }

    getPieceAt(x, y) {
        return this.squares[y][x] || null;
    }

    getPieceByColor(color) {
        const pieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece && piece.color === color) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    findKing(color) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.squares[row][col];
                if (piece && piece instanceof King && piece.color === color) {
                    return { x: col, y: row };
                }
            }
        }
        return null; 
    }  

    canPieceMoveTo(piece, targetX, targetY) {
        const validMoves = utils.filterMovesForCheck(piece.color, piece, this);
        return validMoves.some(move => move.x === targetX && move.y === targetY);
    }
}

export default Board;
