
class SideSelection {
    constructor(gameMode) {
        this.gameMode = gameMode;
        this.playerSide = 'white'; 
        this.colorSelection = document.getElementById('color-selection');
        this.playAsWhite = document.getElementById('play-as-white');
        this.playAsBlack = document.getElementById('play-as-black');
        this.startGameButton = document.getElementById('start-game-button');
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.playAsWhite.addEventListener('click', () => {
            this.selectSide('white');
        });
        
        this.playAsBlack.addEventListener('click', () => {
            this.selectSide('black');
        });
    }

    selectSide(side) {
        this.playerSide = side;
        
        this.playAsWhite.classList.toggle('selected', side === 'white');
        this.playAsBlack.classList.toggle('selected', side === 'black');
        
        this.startGameButton.removeAttribute('disabled');
    }

    show() {
        this.selectSide('white');
        
        this.colorSelection.style.display = 'block';
        
        setTimeout(() => {
            this.colorSelection.classList.add('active');
        }, 50);
    }

    hide() {
        this.colorSelection.classList.remove('active');
        
        setTimeout(() => {
            this.colorSelection.style.display = 'none';
        }, 400); 
    }

    getSelectedSide() {
        return this.playerSide;
    }

    reset() {
        this.playerSide = 'white';
        this.playAsWhite.classList.add('selected');
        this.playAsBlack.classList.remove('selected');
        this.hide();
    }
}

export default SideSelection;
