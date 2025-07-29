# Chess Game 

## Overview
A chess game that can be played in two modes: Human vs Human and Human vs Computer. The AI opponent is powered by TensorFlow.js machine learning models, utilizing a neural network that employs the minimax algorithm with alpha-beta pruning for strategic gameplay.

## Project Structure
```
chess-game/
├── src/
│   ├── game.js              # Main game controller and logic
│   ├── board.js             # Chessboard representation and management
│   ├── computer.js          # AI computer opponent with neural network
│   ├── player.js            # Human player representation
│   ├── utils.js             # Chess rules and utility functions
│   ├── pieces/              # Chess piece classes
│   │   ├── piece.js         # Base piece class
│   │   ├── pawn.js          # Pawn movement and promotion logic
│   │   ├── rook.js          # Rook movement logic
│   │   ├── knight.js        # Knight movement logic
│   │   ├── bishop.js        # Bishop movement logic
│   │   ├── queen.js         # Queen movement logic
│   │   └── king.js          # King movement and castling logic
│   └── features/            # Advanced game features
│       ├── game-mode.js     # Game mode selection
│       ├── game-renderer.js # Visual rendering and highlighting
│       ├── move-notation.js # Chess notation system
│       ├── pawn-promotion.js# Pawn promotion interface
│       ├── piece-capture.js # Piece capture logic
│       └── side-selection.js# Player side selection
├── models/                  # Pre-trained TensorFlow.js models
│   ├── chess_engine_v1/     # Primary chess evaluation model
│   └── chess_engine_v2/     # Enhanced evaluation model
├── css/                     # Styling and visual design
│   ├── style.css            # Main stylesheet
│   ├── board.css            # Chessboard styling
│   ├── pieces.css           # Chess piece styling
│   ├── controls.css         # Game controls styling
│   ├── game-mode.css        # Game mode interface
│   ├── highlights.css       # Move highlighting effects
│   ├── modals.css           # Modal dialogs styling
│   ├── moves-panel.css      # Move history panel
│   └── players.css          # Player information styling
├── images/                  # Chess piece sprites and assets
├── index.html               # Main application entry point
├── package.json             # Node.js project configuration
└── README.md                # Project documentation
```

## Getting Started

### Setup
1. Download or clone the repository
2. Open `index.html` directly in your web browser
3. Ensure you have an internet connection for TensorFlow.js to load

## How to Play

### Game Modes
- **Human vs Human**: Traditional two-player chess
- **Human vs Computer**: Challenge the AI opponent
- **Side Selection**: Choose to play as White or Black against the computer

### Controls
- **Click to Select**: Click on a piece to select it
- **Click to Move**: Click on a highlighted square to move
- **Game Info**: View current player, game status, and move history
- **Reset Game**: Start a new game at any time

### Chess Rules Implemented
- ✅ All standard piece movements
- ✅ Castling (kingside and queenside)
- ✅ En passant capture
- ✅ Pawn promotion with piece selection
- ✅ Check and checkmate detection
- ✅ Stalemate and draw conditions
- ✅ Move validation and legal move highlighting

## Development

### Model Training
The AI models were trained using:
- Large chess position datasets
- TensorFlow/Keras for model architecture
- Position evaluation based on material, positional factors
- Model conversion to TensorFlow.js format for web deployment

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- TensorFlow.js team for machine learning framework
- [Chess Evaluations Dataset](https://www.kaggle.com/datasets/ronakbadhe/chess-evaluations) for traning data. 

---
**Enjoy playing chess.**