class GameRenderer {

    renderWinner(winnerName, winnerColor) {
        const winnerContainer = document.getElementById('winner-container');
        const winnerModal = winnerContainer.querySelector('.winner-modal');
        const winnerMessage = winnerContainer.querySelector('.winner-message');
        const winnerIcon = winnerContainer.querySelector('.winner-icon');
        
        // Clear previous classes
        winnerModal.classList.remove('white-wins', 'black-wins', 'draw');
        
        // Add appropriate class and set message
        winnerModal.classList.add(`${winnerColor}-wins`);
        if (winnerName === 'You') {
            winnerMessage.textContent = `You Win!`;
        } else {
            winnerMessage.textContent = `${winnerName} Wins!`;
        }
        
        // Set appropriate icon
        if (winnerColor === 'white') {
            winnerIcon.textContent = '♔';
        } else {
            winnerIcon.textContent = '♚';
        }
        
        // Show the winner container
        winnerContainer.style.display = 'block';
        
        // Bind event listeners for the modal buttons
        this.bindWinnerModalEvents();
    }

    renderDraw() {
        const winnerContainer = document.getElementById('winner-container');
        const winnerModal = winnerContainer.querySelector('.winner-modal');
        const winnerMessage = winnerContainer.querySelector('.winner-message');
        const winnerIcon = winnerContainer.querySelector('.winner-icon');
        
        // Clear previous classes
        winnerModal.classList.remove('white-wins', 'black-wins', 'draw');
        
        // Add draw class and set message
        winnerModal.classList.add('draw');
        winnerMessage.textContent = 'Draw!';
        winnerIcon.textContent = '🤝';
        
        // Show the winner container
        winnerContainer.style.display = 'block';
        
        // Bind event listeners for the modal buttons
        this.bindWinnerModalEvents();
    }

    bindWinnerModalEvents() {
        // Remove existing event listeners to prevent duplicates
        const closeBtn = document.getElementById('winner-close-btn');
        const newGameBtn = document.getElementById('winner-new-game');
        const changeModeBtn = document.getElementById('winner-change-mode');
        
        // Clone nodes to remove all event listeners
        closeBtn.replaceWith(closeBtn.cloneNode(true));
        newGameBtn.replaceWith(newGameBtn.cloneNode(true));
        changeModeBtn.replaceWith(changeModeBtn.cloneNode(true));
        
        // Get fresh references
        const freshCloseBtn = document.getElementById('winner-close-btn');
        const freshNewGameBtn = document.getElementById('winner-new-game');
        const freshChangeModeBtn = document.getElementById('winner-change-mode');
        
        // Add new event listeners
        freshCloseBtn.addEventListener('click', () => this.hideWinnerModal());
        
        freshNewGameBtn.addEventListener('click', () => {
            this.hideWinnerModal();
            // Trigger new game with same mode
            document.getElementById('new-game-button').click();
        });
        
        freshChangeModeBtn.addEventListener('click', () => {
            this.hideWinnerModal();
            // Show mode selection
            if (window.gameModeSelector) {
                window.gameModeSelector.showModeSelection();
            }
        });
    }

    hideWinnerModal() {
        const winnerContainer = document.getElementById('winner-container');
        winnerContainer.style.display = 'none';
    }

    switchPlayerTurnRender(color) {
        document.getElementById('player-top').classList.remove('active-player');
        document.getElementById('player-bottom').classList.remove('active-player');
        
        // Update player statuses
        const whitePlayer = document.getElementById('player-bottom');
        const blackPlayer = document.getElementById('player-top');
        const whiteStatus = whitePlayer.querySelector('.player-status');
        const blackStatus = blackPlayer.querySelector('.player-status');
        
        if (color === 'white') {
            // Switch to black's turn
            blackPlayer.classList.add('active-player');
            blackStatus.textContent = 'Your turn';
            whiteStatus.textContent = 'Waiting...';
        } else {
            // Switch to white's turn
            whitePlayer.classList.add('active-player');
            whiteStatus.textContent = 'Your turn';
            blackStatus.textContent = 'Waiting...';
        }
    }

    highlightSelectedPiece(piece) {
        this.clearSelectedPiece();
    
        const square = document.querySelector(`[data-row="${piece.position.y}"][data-col="${piece.position.x}"]`);
        if (square) {
            square.classList.add('selected-piece');
        }
    }

    clearSelectedPiece() {
        const selectedSquares = document.querySelectorAll('.square.selected-piece');
        selectedSquares.forEach(square => {
            square.classList.remove('selected-piece');
        });
    }

    highlightPossibleMoves(moves) {
        moves.forEach(move => {
            const square = document.querySelector(`[data-row="${move.y}"][data-col="${move.x}"]`);
            if (square) {
                square.classList.add('possible-move');
                
                // Add capture-move class if there's a piece on that square
                const piece = square.querySelector('.piece');
                if (piece) {
                    square.classList.add('capture-move');
                }
            }
        });
    }

    clearHighlights() {
        const highlightedSquares = document.querySelectorAll('.square.possible-move');
        highlightedSquares.forEach(square => {
            square.classList.remove('possible-move', 'capture-move'); // Remove CSS class
        });
        this.clearSelectedPiece();
    }

    highlightCheck(board, color) {
        const kingPosition = board.findKing(color);
        if (!kingPosition) return;

        const square = document.querySelector(`[data-row="${kingPosition.y}"][data-col="${kingPosition.x}"]`);
        if (square) {
            square.classList.add('in-check'); // Add CSS class to highlight the king in check
        }
    }

    clearCheckHighlight() {
        const highlightedSquares = document.querySelectorAll('.square.in-check');
        highlightedSquares.forEach(square => {
            square.classList.remove('in-check'); // Remove CSS class
        });
    }
}

export default new GameRenderer();
