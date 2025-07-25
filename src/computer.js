import utils from './utils.js';
import GameRenderer from './features/game-renderer.js';

class Computer {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.isActive = false;
        this.model = null;
        this.searchDepth = 2; // Adjustable search depth
    }

    async loadModel() {
        if (!this.model) {
            // Update to load your new position evaluation model
            this.model = await tf.loadLayersModel('models/chess_engine_v2/model.json');
        }
        return this.model;
    }

    boardToTensor(board) {
        // Create 14×8×8 tensor matching your Python format
        const tensor = new Array(14);
        for (let channel = 0; channel < 14; channel++) {
            tensor[channel] = new Array(8);
            for (let row = 0; row < 8; row++) {
                tensor[channel][row] = new Array(8).fill(0);
            }
        }

        // Fill first 12 channels with pieces (channels 0-11)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPieceAt(col, row);
                if (piece) {
                    const channelIndex = this.getPieceChannelIndex(piece);
                    tensor[channelIndex][row][col] = 1;
                }
            }
        }

        // Channel 12: White legal move destinations
        const whitePieces = board.getPieceByColor('white');
        for (const piece of whitePieces) {
            const validMoves = utils.getValidMoves(piece, board);
            for (const move of validMoves) {
                tensor[12][move.y][move.x] = 1;
            }
        }

        // Channel 13: Black legal move destinations
        const blackPieces = board.getPieceByColor('black');
        for (const piece of blackPieces) {
            const validMoves = utils.getValidMoves(piece, board);
            for (const move of validMoves) {
                tensor[13][move.y][move.x] = 1;
            }
        }
        return tensor;
    }

    getPieceChannelIndex(piece) {
        const pieceMap = {
            'white': {
                'Pawn': 0, 'Knight': 1, 'Bishop': 2, 'Rook': 3, 'Queen': 4, 'King': 5
            },
            'black': {
                'Pawn': 6, 'Knight': 7, 'Bishop': 8, 'Rook': 9, 'Queen': 10, 'King': 11
            }
        };
        return pieceMap[piece.color][piece.constructor.name];
    }

    async minimaxEval(board) {
        await this.loadModel();
        
        const boardData = this.boardToTensor(board);
        const prediction = this.model.predict(tf.tensor4d([boardData], [1, 14, 8, 8]));
        const evaluation = prediction.dataSync()[0];
        
        prediction.dispose();
        
        return evaluation;
    }

    isGameOver(board) {
        return utils.isCheckmate(this.color, board) || 
               utils.isDraw(this.color, board);
    }

    getAllValidMoves(board, color) {
        const pieces = board.getPieceByColor(color);
        const allValidMoves = [];
        
        for (const piece of pieces) {
            const validMoves = utils.getValidMoves(piece, board);
            validMoves.forEach(move => {
                allValidMoves.push({
                    piece: piece,
                    from: { ...piece.position },
                    to: { ...move }
                });
            });
        }
        
        return allValidMoves;
    }

    makePseudoMove(board, move) {
        // Store original state for undo
        const originalPiece = board.getPieceAt(move.to.x, move.to.y);
        const movingPiece = board.getPieceAt(move.from.x, move.from.y);
        const originalPosition = { ...move.from };
        
        if (!movingPiece) {
            console.error('No piece at source position:', move.from);
            return null;
        }
        
        // Make the move
        board.setPieceAt(move.to.x, move.to.y, movingPiece);
        board.setPieceAt(move.from.x, move.from.y, null);
        movingPiece.position = { x: move.to.x, y: move.to.y };
        
        // Switch current player
        const originalCurrentPlayer = board.currentPlayer;
        board.currentPlayer = board.currentPlayer === 'white' ? 'black' : 'white';
        
        return { 
            originalPiece, 
            movingPiece, 
            originalPosition,
            originalCurrentPlayer
        };
    }

    undoMove(board, move, moveState) {
        if (!moveState || !moveState.movingPiece) {
            console.error('Invalid move state for undo');
            return;
        }
        
        // Restore pieces
        board.setPieceAt(move.from.x, move.from.y, moveState.movingPiece);
        board.setPieceAt(move.to.x, move.to.y, moveState.originalPiece);
        
        // Restore moving piece position
        moveState.movingPiece.position = { ...moveState.originalPosition };
        
        // Restore current player
        board.currentPlayer = moveState.originalCurrentPlayer;
    }

    async minimax(board, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || this.isGameOver(board)) {
            return await this.minimaxEval(board);
        }

        const currentColor = maximizingPlayer ? 'white' : 'black';
        const validMoves = this.getAllValidMoves(board, currentColor);

        if (validMoves.length === 0) {
            // No valid moves - could be checkmate or stalemate
            if (utils.isInCheck(currentColor, board)) {
                // Checkmate - return extreme value
                return maximizingPlayer ? -10000 : 10000;
            } else {
                // Stalemate - return neutral value
                return 0;
            }
        }

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            
            for (const move of validMoves) {
                const moveState = this.makePseudoMove(board, move);
                if (moveState) {
                    const evaluation = await this.minimax(board, depth - 1, alpha, beta, false);
                    this.undoMove(board, move, moveState);
                    
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    
                    if (beta <= alpha) {
                        break; // Alpha-beta pruning
                    }
                }
            }
            
            return maxEval;
        } else {
            let minEval = Infinity;
            
            for (const move of validMoves) {
                const moveState = this.makePseudoMove(board, move);
                if (moveState) {
                    const evaluation = await this.minimax(board, depth - 1, alpha, beta, true);
                    this.undoMove(board, move, moveState);
                    
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    
                    if (beta <= alpha) {
                        break; // Alpha-beta pruning
                    }
                }
            }
            
            return minEval;
        }
    }

    async getBestMove(board) {
        await this.loadModel();
        
        const validMoves = this.getAllValidMoves(board, this.color);
        
        if (validMoves.length === 0) {
            return null;
        }

        let bestMove = null;
        let bestEval = this.color === 'white' ? -Infinity : Infinity;
        
        for (let i = 0; i < validMoves.length; i++) {
            const move = validMoves[i];
            
            const moveState = this.makePseudoMove(board, move);
            if (moveState) {
                const evaluation = await this.minimax(
                    board, 
                    this.searchDepth - 1, 
                    -Infinity, 
                    Infinity, 
                    this.color === 'black' // White minimizes, Black maximizes
                );
                this.undoMove(board, move, moveState);
                
                // White wants higher (more positive) scores
                // Black wants lower (more negative) scores
                if (this.color === 'white' && evaluation > bestEval) {
                    bestEval = evaluation;
                    bestMove = move;
                } else if (this.color === 'black' && evaluation < bestEval) {
                    bestEval = evaluation;
                    bestMove = move;
                }
            }
        }
        
        return bestMove;
    }

    async makeMove(board) {
        return new Promise(async (resolve) => {
            this.isActive = true;
            
            // Remove this line - it's causing the error during minimax search
            // utils.checkForCheck(this.color, board);
            
            setTimeout(async () => {
                const bestMove = await this.getBestMove(board);
                
                if (bestMove) {
                    GameRenderer.highlightSelectedPiece(bestMove.piece);
                    GameRenderer.highlightPossibleMoves([bestMove.to]);
                    
                    setTimeout(() => {
                        board.update(bestMove.from, bestMove.to);
                        utils.afterMove(this.color, board);
                        
                        this.isActive = false;
                        GameRenderer.clearHighlights();
                        resolve();
                    }, 500);
                } else {
                    this.isActive = false;
                    resolve();
                }
            }, 1000);
        });
    }
}

export default Computer;
