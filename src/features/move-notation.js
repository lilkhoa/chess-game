import Pawn from '../pieces/pawn.js';

class MoveNotation {

    getAmbiguityInfo(board, piece, fromSquare, toSquare) {
        const fromFile = fromSquare[0]; // a-h
        const fromRank = fromSquare[1]; // 1-8
        const targetX = toSquare.charCodeAt(0) - 97; // Convert file to 0-7
        const targetY = 8 - parseInt(toSquare[1]); // Convert rank to 0-7
        
        const samePiecesThatCanMoveThere = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const otherPiece = board.getPieceAt(row, col);
                if (otherPiece && 
                    otherPiece !== piece && 
                    otherPiece.constructor === piece.constructor && 
                    otherPiece.color === piece.color) {
                    // Check if this piece can legally move to the target square
                    if (board.canPieceMoveTo(otherPiece, targetX, targetY)) {
                        samePiecesThatCanMoveThere.push({
                            piece: otherPiece,
                            file: String.fromCharCode(97 + otherPiece.position.x),
                            rank: (8 - otherPiece.position.y).toString()
                        });
                    }
                }
            }
        }

        if (samePiecesThatCanMoveThere.length === 0) {
            return '';
        }

        const sameFile = samePiecesThatCanMoveThere.filter(p => p.file === fromFile);
        if (sameFile.length === 0) {
            return fromFile; 
        }

        const sameRank = samePiecesThatCanMoveThere.filter(p => p.rank === fromRank);
        if (sameRank.length === 0) {
            return fromRank; 
        }

        return fromFile;
    }

    getMoveNotation(
        piece, 
        capturedPiece, 
        fromSquare, 
        toSquare, 
        kingSideCastle, 
        queenSideCastle, 
        isCheck, 
        isCheckmate, 
        isPromoting,
        promotedTo = null,
        ambiguityInfo = ''
    ) {
        if (kingSideCastle) {
            return 'O-O' + (isCheckmate ? '#' : isCheck ? '+' : '');
        }

        if (queenSideCastle) {
            return 'O-O-O' + (isCheckmate ? '#' : isCheck ? '+' : '');
        }

        const pieceNotation = {
            'King': 'K',
            'Queen': 'Q',
            'Rook': 'R',
            'Bishop': 'B',
            'Knight': 'N',
            'Pawn': '',
        };

        let moveNotation = '';
        moveNotation += pieceNotation[piece.constructor.name];

        if (!(piece instanceof Pawn) && ambiguityInfo) {
            moveNotation += ambiguityInfo;
        }

        if (capturedPiece) {
            if (piece instanceof Pawn) {
                moveNotation += fromSquare[0]; // Add file letter for pawn captures
            }
            moveNotation += 'x';
        }

        moveNotation += toSquare;

        if (isPromoting && promotedTo) {
            moveNotation += '=' + pieceNotation[promotedTo];
        }

        if (isCheckmate) {
            moveNotation += '#';
        } else if (isCheck) {
            moveNotation += '+';
        }

        return moveNotation;
    }

    renderGameMove(board) {
        const movesList = document.getElementById('moves-list');
        
        // Clear placeholder if it exists
        const placeholder = movesList.querySelector('.moves-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        // Get the last move
        const lastMove = board.moveHistory[board.moveHistory.length - 1];
        if (!lastMove) return;
        
        const { piece, capturedPiece, oldPosition, newPosition, kingSideCastle, queenSideCastle, isCheck, isCheckmate, isPromoting, promotedTo, ambiguityInfo } = lastMove;
        const moveNumber = Math.ceil(board.moveHistory.length / 2);
        const isWhiteMove = piece.color === 'white';
        
        const fromSquare = String.fromCharCode(97 + oldPosition.x) + (8 - oldPosition.y);
        const toSquare = String.fromCharCode(97 + newPosition.x) + (8 - newPosition.y);
        const moveNotation = this.getMoveNotation(
            piece, 
            capturedPiece, 
            fromSquare, 
            toSquare, 
            kingSideCastle, 
            queenSideCastle, 
            isCheck, 
            isCheckmate, 
            isPromoting,
            promotedTo,
            ambiguityInfo
        );
        
        let movePair;
        if (isWhiteMove) {
            movePair = document.createElement('div');
            movePair.className = 'move-pair';
            movePair.innerHTML = `
                <div class="move-number">${moveNumber}.</div>
                <div class="move-item white-move ${isPromoting ? 'promotion-move' : ''}" data-move="${board.moveHistory.length - 1}">${moveNotation}</div>
                <div class="move-placeholder"></div>
            `;
            movesList.appendChild(movePair);
        } else {
            const lastMovePair = movesList.lastElementChild;
            if (lastMovePair && lastMovePair.classList.contains('move-pair')) {
                const placeholder = lastMovePair.querySelector('.move-placeholder');
                if (placeholder) {
                    placeholder.outerHTML = `<div class="move-item black-move ${isPromoting ? 'promotion-move' : ''}" data-move="${board.moveHistory.length - 1}">${moveNotation}</div>`;
                }
            }
        }
        
        // Scroll to bottom
        movesList.scrollTop = movesList.scrollHeight;
    }

    clearMovePanel() {
        const movesList = document.getElementById('moves-list');
        movesList.innerHTML = ''; // Clear all moves
    }
}

export default new MoveNotation();
