class PieceCapture {
    addCapturedPiece(piece, capturedByColor) {
        const captureContainer = capturedByColor === 'white' 
            ? document.getElementById('white-captured') 
            : document.getElementById('black-captured');
        
        const pieceType = piece.constructor.name.toLowerCase();
        
        // Create the captured piece element
        const capturedPieceDiv = document.createElement('div');
        capturedPieceDiv.className = `captured-piece ${piece.color}-${pieceType} ${pieceType}`;
        capturedPieceDiv.title = `${piece.color} ${piece.constructor.name}`;
        
        // Add to container - CSS flexbox order will handle positioning
        captureContainer.appendChild(capturedPieceDiv);
    }

    clearCapturedPieces() {
        const whiteContainer = document.getElementById('white-captured');
        const blackContainer = document.getElementById('black-captured');
        
        whiteContainer.innerHTML = '';
        blackContainer.innerHTML = '';
    }
}

export default new PieceCapture();
