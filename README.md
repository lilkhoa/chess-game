# Chess Game

## Overview
This is a two-player chess game built using JavaScript. The game allows two players to compete against each other by moving pieces on a chessboard according to the rules of chess.

## Project Structure
```
chess-game
├── src
│   ├── game.js          # Main entry point for the chess game
│   ├── board.js         # Defines the Board class and its methods
│   ├── pieces           # Contains individual piece classes
│   │   ├── piece.js     # Base class for all chess pieces
│   │   ├── pawn.js      # Pawn class with specific movement rules
│   │   ├── rook.js      # Rook class with movement logic
│   │   ├── knight.js    # Knight class with movement logic
│   │   ├── bishop.js    # Bishop class with movement logic
│   │   ├── queen.js     # Queen class with movement logic
│   │   └── king.js      # King class with movement logic
│   ├── player.js        # Represents a player in the game
│   └── utils.js         # Utility functions for the game
├── css
│   └── style.css        # Styles for the chess game
├── index.html           # Main HTML file for the game interface
├── package.json         # Configuration file for npm
└── README.md            # Documentation for the project
```

## Getting Started

### Prerequisites
- Node.js installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd chess-game
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Game
1. Open `index.html` in your web browser.
2. Follow the on-screen instructions to start playing.

## How to Play
- The game is played on an 8x8 board.
- Each player takes turns to move their pieces.
- The objective is to checkmate the opponent's king.

## Contributing
Feel free to submit issues or pull requests if you would like to contribute to the project.

## License
This project is licensed under the MIT License.