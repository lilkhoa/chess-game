import utils from './utils.js';
import GameRenderer from './features/game-renderer.js';

class Computer {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.isActive = false;
        this.model = null;
    }

    async loadModel() {
        if (!this.model) {
            this.model = await tf.loadLayersModel('./test_model_2_js/model.json');
            console.log('Chess AI model loaded successfully');
        }
        return this.model;
    }

    boardToTensor(board) {
        const tensor = new Array(8);
        for (let row = 0; row < 8; row++) {
            tensor[row] = new Array(8);
            for (let col = 0; col < 8; col++) {
                tensor[row][col] = new Array(12).fill(0); 
                
                const piece = board.getPieceAt(col, row);
                if (piece) {
                    const channelIndex = this.getPieceChannelIndex(piece);
                    tensor[row][col][channelIndex] = 1;
                }
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

    outputToMove(prediction, board) {
        const predictionData = prediction.dataSync();
        
        let bestMoveIndex = 0;
        let bestScore = predictionData[0];
        
        for (let i = 1; i < predictionData.length; i++) {
            if (predictionData[i] > bestScore) {
                bestScore = predictionData[i];
                bestMoveIndex = i;
            }
        }
        
        const moveString = this.indexToMove(bestMoveIndex);
        
        if (moveString) {
            const fromSquare = moveString.substring(0, 2);
            const toSquare = moveString.substring(2, 4);
            
            return {
                from: this.algebraicToCoordinates(fromSquare),
                to: this.algebraicToCoordinates(toSquare)
            };
        }
        
        return null;
    }

    getMoveToIndex() {
        if (!this.moveToIndex) {
            this.moveToIndex = {};
            this.indexToMoveMap = {};
            let index = 0;
            
            for (let fromSq = 0; fromSq < 64; fromSq++) {
                for (let toSq = 0; toSq < 64; toSq++) {
                    if (fromSq !== toSq) {
                        const fromName = this.squareIndexToName(fromSq);
                        const toName = this.squareIndexToName(toSq);
                        const moveString = fromName + toName;
                        
                        this.moveToIndex[moveString] = index;
                        this.indexToMoveMap[index] = moveString;
                        index++;
                    }
                }
            }
        }
        return this.moveToIndex;
    }

    indexToMove(index) {
        if (!this.indexToMoveMap) {
            this.getMoveToIndex(); 
        }
        return this.indexToMoveMap[index] || null;
    }

    squareIndexToName(squareIndex) {
        const file = squareIndex % 8;
        const rank = Math.floor(squareIndex / 8);
        const fileName = String.fromCharCode(97 + file); 
        const rankName = (8 - rank).toString(); 
        return fileName + rankName;
    }

    algebraicToCoordinates(algebraic) {
        const file = algebraic.charCodeAt(0) - 97; 
        const rank = parseInt(algebraic[1]) - 1;   
        return {
            x: file,
            y: 7 - rank 
        };
    }

    async getBestMove(board) {
        await this.loadModel();
        
        const pieces = board.getPieceByColor(this.color);
        const allValidMoves = [];
        
        for (const piece of pieces) {
            const validMoves = utils.getValidMoves(this.color, piece, board);
            validMoves.forEach(move => {
                allValidMoves.push({
                    piece: piece,
                    from: { ...piece.position },
                    to: { ...move }
                });
            });
        }
        
        if (allValidMoves.length === 0) {
            return null; 
        }
        
        const boardData = this.boardToTensor(board);
        const prediction = this.model.predict(tf.tensor4d([boardData], [1, 8, 8, 12]));
        const modelMove = this.outputToMove(prediction, board);
        
        let bestMove = allValidMoves[0]; 
        let minDistance = Infinity;
        
        for (const move of allValidMoves) {
            const distance = Math.abs(move.from.x - modelMove.from.x) + 
                           Math.abs(move.from.y - modelMove.from.y) + 
                           Math.abs(move.to.x - modelMove.to.x) + 
                           Math.abs(move.to.y - modelMove.to.y);
            
            if (distance < minDistance) {
                minDistance = distance;
                bestMove = move;
            }
        }
        
        prediction.dispose(); 
        
        return bestMove;
    }

    async makeMove(board) {
        return new Promise(async (resolve) => {
            this.isActive = true;
            
            utils.checkForCheck(this.color, board);
            
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
