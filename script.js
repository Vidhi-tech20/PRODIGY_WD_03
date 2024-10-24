let board, currentPlayer, isGameOver, aiLevel, isAI;
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

// Start the game based on selected mode
function startGame(mode) {
    document.getElementById('difficulty').style.display = mode === 'ai' ? 'block' : 'none';
    isAI = mode === 'ai';
    initializeBoard();
}

// Initialize the board and game state
function initializeBoard() {
    board = Array(9).fill(null);
    isGameOver = false;
    currentPlayer = 'X';
    aiLevel = document.getElementById('difficulty-level').value;
    boardElement.innerHTML = '';
    statusElement.textContent = `${currentPlayer}'s Turn`;

    // Create board cells
    board.forEach((_, idx) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => handleClick(idx));
        boardElement.appendChild(cell);
    });
}

// Handle click on cell
function handleClick(idx) {
    if (board[idx] || isGameOver) return;

    board[idx] = currentPlayer;
    updateBoard();
    if (checkWinner()) {
        isGameOver = true;
        statusElement.textContent = `${currentPlayer} Wins!`;
        return;
    } else if (board.every(cell => cell)) {
        isGameOver = true;
        statusElement.textContent = "It's a Draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `${currentPlayer}'s Turn`;

    if (isAI && currentPlayer === 'O' && !isGameOver) {
        aiMove();
    }
}

// Update the board display
function updateBoard() {
    boardElement.childNodes.forEach((cell, idx) => {
        cell.textContent = board[idx];
        if (board[idx]) cell.classList.add('disabled');
    });
}

// Check for a winner or a draw
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern =>
        pattern.every(index => board[index] === currentPlayer)
    );
}

// AI move based on selected difficulty
function aiMove() {
    const emptyCells = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    
    let move;
    if (aiLevel === 'easy') {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (aiLevel === 'medium') {
        move = mediumMove(emptyCells);
    } else {
        move = hardMove(emptyCells);
    }

    board[move] = currentPlayer;
    updateBoard();

    if (checkWinner()) {
        isGameOver = true;
        statusElement.textContent = `${currentPlayer} Wins!`;
    } else if (board.every(cell => cell)) {
        isGameOver = true;
        statusElement.textContent = "It's a Draw!";
    } else {
        currentPlayer = 'X';
        statusElement.textContent =` ${currentPlayer}'s Turn`;
    }
}

// Medium AI: Attempts to block player
function mediumMove(emptyCells) {
    for (let idx of emptyCells) {
        board[idx] = currentPlayer;
        if (checkWinner()) {
            board[idx] = null;
            return idx;
        }
        board[idx] = null;
    }
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

// Hard AI: Uses simple Minimax algorithm for perfect play
function hardMove(emptyCells) {
    // Minimax-based AI for hard difficulty
    let bestScore = -Infinity, bestMove;
    for (let idx of emptyCells) {
        board[idx] = currentPlayer;
        let score = minimax(board, 0, false);
        board[idx] = null;
        if (score > bestScore) {
            bestScore = score;
            bestMove = idx;
        }
    }
    return bestMove;
}

// Minimax function for optimal AI moves
function minimax(newBoard, depth, isMaximizing) {
    if (checkWinner()) return isMaximizing ? -1 : 1;
    if (newBoard.every(cell => cell)) return 0;

    let scores = [], emptyCells = newBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

    for (let idx of emptyCells) {
        newBoard[idx] = isMaximizing ? 'O' : 'X';
        scores.push(minimax(newBoard, depth + 1, !isMaximizing));
        newBoard[idx] = null;
    }

    return isMaximizing ? Math.max(...scores) : Math.min(...scores);
}

// Reset the game
function resetGame() {
    initializeBoard();
    statusElement.textContent = '';
}