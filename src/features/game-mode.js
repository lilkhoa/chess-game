import SideSelection from './side-selection.js';

class GameMode {
    constructor() {
        this.selectedMode = null;
        this.sideSelection = new SideSelection(this);
        this.playerSide = 'white'; // Default side
        this.init();
    }

    init() {
        this.bindEvents();
        this.showModeSelection();
    }

    bindEvents() {
        document.getElementById('single-player-mode').addEventListener('click', () => {
            this.selectMode('single-player');
            this.sideSelection.show();
        });

        document.getElementById('two-player-mode').addEventListener('click', () => {
            this.selectMode('two-player');
            this.sideSelection.hide();
        });

        document.getElementById('start-game-button').addEventListener('click', () => {
            if (this.selectedMode === 'single-player') {
                this.playerSide = this.sideSelection.getSelectedSide();
            }
            this.startGame();
        });

        document.getElementById('new-game-button').addEventListener('click', () => {
            this.startNewGameSameMode();
        });

        document.getElementById('change-mode-button').addEventListener('click', () => {
            this.showModeSelection();
        });
    }

    selectMode(mode) {
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });

        const selectedCard = mode === 'single-player' 
            ? document.getElementById('single-player-mode')
            : document.getElementById('two-player-mode');
        
        selectedCard.classList.add('selected');

        this.selectedMode = mode;

        if (mode === 'two-player') {
            document.getElementById('start-game-button').disabled = false;
        }

        this.updatePlayerNames(mode);
    }

    updatePlayerNames(mode) {
        const player2Name = document.querySelector('#player-top .player-name');
        const player1Name = document.querySelector('#player-bottom .player-name');
        
        if (mode === 'single-player') {
            player2Name.textContent = 'Computer (Black)';
            player1Name.textContent = 'You (White)';
        } else {
            player2Name.textContent = 'Player 2 (Black)';
            player1Name.textContent = 'Player 1 (White)';
        }
    }

    startGame() {
        if (!this.selectedMode) return;

        document.getElementById('game-mode-selection').style.display = 'none';
        document.getElementById('game-interface').style.display = 'block';

        window.currentGameMode = this.selectedMode;
        window.playerSide = this.playerSide;

        if (this.selectedMode === 'single-player') {
            const playerIsWhite = this.playerSide === 'white';
            const player2Name = document.querySelector('#player-top .player-name');
            const player1Name = document.querySelector('#player-bottom .player-name');
            
            if (playerIsWhite) {
                player2Name.textContent = 'Computer (Black)';
                player1Name.textContent = 'You (White)';
            } else {
                player2Name.textContent = 'You (Black)';
                player1Name.textContent = 'Computer (White)';
            }
        }

        const event = new CustomEvent('newGameStarted', {
            detail: { 
                mode: this.selectedMode,
                isNewGame: true,
                sameMode: false,
                playerSide: this.playerSide
            }
        });
        document.dispatchEvent(event);
    }

    startNewGameSameMode() {
        const currentMode = window.currentGameMode || this.selectedMode;
        
        if (!currentMode) {
            this.showModeSelection();
            return;
        }

        this.selectedMode = currentMode;
        this.playerSide = window.playerSide || 'white';

        const event = new CustomEvent('newGameStarted', {
            detail: { 
                mode: currentMode,
                isNewGame: true,
                sameMode: true,
                playerSide: this.playerSide
            }
        });
        document.dispatchEvent(event);
    }

    showModeSelection() {
        document.getElementById('game-mode-selection').style.display = 'flex';
        document.getElementById('game-interface').style.display = 'none';

        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.getElementById('start-game-button').disabled = true;
        
        // Reset side selection
        this.sideSelection.reset();
        this.selectedMode = null;
    }

    getSelectedMode() {
        return this.selectedMode;
    }

    getCurrentGameMode() {
        return window.currentGameMode || null;
    }

    getPlayerSide() {
        return this.playerSide;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gameModeSelector = new GameMode();
});

export default GameMode;
