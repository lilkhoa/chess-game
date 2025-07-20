class GameMode {
    constructor() {
        this.selectedMode = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showModeSelection();
    }

    bindEvents() {
        document.getElementById('single-player-mode').addEventListener('click', () => {
            this.selectMode('single-player');
        });

        document.getElementById('two-player-mode').addEventListener('click', () => {
            this.selectMode('two-player');
        });

        document.getElementById('start-game-button').addEventListener('click', () => {
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

        document.getElementById('start-game-button').disabled = false;

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
        }
    }

    startGame() {
        if (!this.selectedMode) return;

        document.getElementById('game-mode-selection').style.display = 'none';
        
        document.getElementById('game-interface').style.display = 'block';

        window.currentGameMode = this.selectedMode;

        const event = new CustomEvent('newGameStarted', {
            detail: { 
                mode: this.selectedMode,
                isNewGame: true,
                sameMode: false
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

        const event = new CustomEvent('newGameStarted', {
            detail: { 
                mode: currentMode,
                isNewGame: true,
                sameMode: true
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
        
        this.selectedMode = null;
    }

    getSelectedMode() {
        return this.selectedMode;
    }

    getCurrentGameMode() {
        return window.currentGameMode || null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.gameModeSelector = new GameMode();
});

export default GameMode;
