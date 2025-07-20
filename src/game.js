import Board from './board.js';
import Player from './player.js';
import Computer from './computer.js';
import utils from './utils.js';
import GameRenderer from './features/game-renderer.js';

class Game {
    constructor(gameMode = 'human-vs-human') {
        this.board = new Board();
        this.gameMode = gameMode;
        this.setupPlayers();
        this.currentPlayerIndex = 0;
        this.isCheckMate = false;
        this.isDraw = false;
        this.isGameActive = false; 
        this.gameId = Date.now(); 
    }

    setupPlayers() {
        switch (this.gameMode) {
            case 'human-vs-computer':
                this.players = [
                    new Player('Player 1', 'white'), 
                    new Computer('Computer', 'black')
                ];
                break;
            case 'human-vs-human': 
                this.players = [
                    new Player('Player 1', 'white'), 
                    new Player('Player 2', 'black')
                ];
                break;
        }
    }

    start() {
        this.isGameActive = true;
        this.board.setup();
        this.render();
        this.handleTurn(); 
    }

    restart(newGameMode) {
        this.stop();
        
        if (newGameMode) {
            this.gameMode = newGameMode;
        }
        
        this.board.reset();
        this.currentPlayerIndex = 0;
        this.isCheckMate = false;
        this.isDraw = false;
        this.gameId = Date.now();
        
        this.setupPlayers();
        
        setTimeout(() => {
            this.start();
        }, 100);
    }

    stop() {
        this.isGameActive = false;
    }

    async handleTurn() {
        if (!this.isGameActive) {
            return;
        }

        this.checkGameOver();

        if (this.isCheckMate) {
            const winnerColor = this.players[(this.currentPlayerIndex + 1) % 2].color;
            const winnerName = this.players[(this.currentPlayerIndex + 1) % 2].name;
            GameRenderer.renderWinner(winnerName, winnerColor);
            this.stop();
            return;
        }

        if (this.isDraw) {
            GameRenderer.renderDraw();
            this.stop();
            return;
        }

        const currentPlayer = this.players[this.currentPlayerIndex];        
        const currentGameId = this.gameId;
        
        try {
            await currentPlayer.makeMove(this.board);
            
            if (!this.isGameActive || this.gameId !== currentGameId) {
                return;
            }
            
            this.switchPlayer();
            GameRenderer.switchPlayerTurnRender(currentPlayer.color);
            
            setTimeout(() => {
                if (this.isGameActive && this.gameId === currentGameId) {
                    this.handleTurn();
                }
            }, 50);
            
        } catch (error) {
            console.error('Error during player move:', error);
            if (this.isGameActive) {
                setTimeout(() => {
                    if (this.isGameActive && this.gameId === currentGameId) {
                        this.handleTurn();
                    }
                }, 100);
            }
        }
    }

    checkGameOver() {
        if (!this.isGameActive) return;
        
        this.isCheckMate = utils.isCheckmate(this.players[this.currentPlayerIndex].color, this.board);
        this.isDraw = utils.isDraw(this.players[this.currentPlayerIndex].color, this.board);
    }

    switchPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 2;
    }

    render() {
        if (this.isGameActive) {
            this.board.render();
        }
    }
}

let chessGame = null;

document.addEventListener('newGameStarted', (event) => {
    const { mode, sameMode } = event.detail;
    
    const gameModeMap = {
        'single-player': 'human-vs-computer',
        'two-player': 'human-vs-human'
    };
    
    const gameMode = gameModeMap[mode] || 'human-vs-human';
    
    if (chessGame) {
        chessGame.stop();
        chessGame.restart(gameMode);
    } else {
        chessGame = new Game(gameMode);
        chessGame.start();
    }
});

export default Game;
