let selectedPiece = null;
let legalMoves = [];
let searchDepth = 3;
let userPlayer = "b";
let computerPlayer = "w";
let gameOver = false;

attachBlackPieceListeners();

function attachBlackPieceListeners() {
    if (gameOver) return;
    document.querySelectorAll(`.col[piece=${userPlayer}]`).forEach(col => {
        col.addEventListener('click', () => {
            console.log("black piece clicked");
            clearHighlights();
            selectedPiece = col;
            col.classList.add('selected');

            // Show ghost piece
            const ghost = document.getElementById('ghost-piece');
            ghost.className = 'black';
            ghost.style.display = 'block';

            const currentPosition = getPosition(col.id);
            console.log("selected position = ", currentPosition);

            const currentBoardState = getBoardState();
            let newBoardState = currentBoardState; // This will change after moving
            // legalMoves = generateLegalMoves(boardState, userPlayer, currentPosition);

            // Returns objects representing which direction it can move/jump, and the new position it can move/jump to
            // Ex: { move: "left", newPos: [3.0] }
            var possibleMoves = moveable(currentBoardState, userPlayer, currentPosition);
            var possibleJumps = jumpable(currentBoardState, userPlayer, currentPosition);

            if ((possibleMoves.length === 0 || possibleJumps.length === 0)
                && count(board, userPlayer) > 0) {
                // No more moves left; game over
                gameOver = true;
                showWinner("AI wins!", "You have no more moves left.");
                return;
            }

            document.addEventListener('mousemove', (e) => {
                const ghost = document.getElementById('ghost-piece');
                if (ghost.style.display === 'block') {
                    ghost.style.left = `${e.clientX}px`;
                    ghost.style.top = `${e.clientY}px`;

                    // Detect underlying element
                    const elemUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

                    // If it's a highlighted cell, add the valid-hover class
                    if (elemUnderCursor && elemUnderCursor.classList.contains('highlight')) {
                        ghost.classList.add('valid-hover');
                    } else {
                        ghost.classList.remove('valid-hover');
                    }
                }
            });

            // document.addEventListener('click', (e) => {
            //     const ghost = document.getElementById('ghost-piece');
            //     ghost.style.display = 'none';
            // });

            possibleMoves.forEach(possibleMove => {
                console.log("Can move to: ", possibleMove.newPos);
                const toCell = document.querySelector(`#pos-${possibleMove.newPos[0]}${possibleMove.newPos[1]}`);
                toCell.classList.add("highlight");

                if (possibleMove.move === "left") {
                    // left move is possible
                    toCell.addEventListener('click', () => {
                        console.log("Moved left to: ", possibleMove.newPos);
                        newBoardState = moveLeft(currentBoardState, userPlayer, currentPosition).board;
                        updateBoardAndAIMove(newBoardState);
                    });
                } else if (possibleMove.move === "right") {
                    // right move is possible
                    toCell.addEventListener('click', () => {
                        console.log("Moved right to: ", possibleMove.newPos);
                        newBoardState = moveRight(currentBoardState, userPlayer, currentPosition).board;
                        updateBoardAndAIMove(newBoardState);
                    });
                }
            });

            possibleJumps.forEach(possibleJump => {
                console.log("Can move to: ", possibleJump.newPos);
                const toCell = document.querySelector(`#pos-${possibleJump.newPos[0]}${possibleJump.newPos[1]}`);
                toCell.classList.add("highlight");

                if (possibleJump.move === "left") {
                    // left jump is possible
                    toCell.addEventListener('click', () => {
                        console.log("Jumped left to: ", possibleJump.newPos);
                        newBoardState = jumpLeft(currentBoardState, userPlayer, currentPosition).board;
                        updateBoardAndAIMove(newBoardState);
                    });
                } else if (possibleJump.move === "right") {
                    // right jump is possible
                    toCell.addEventListener('click', () => {
                        console.log("Jumped right to: ", possibleJump.newPos);
                        newBoardState = jumpRight(currentBoardState, userPlayer, currentPosition).board;
                        updateBoardAndAIMove(newBoardState);
                    });
                }
            });
        });
    });
}

function updateBoardAndAIMove(boardState) {
    updateBoardDOM(boardState);
    printBoard(boardState);

    document.getElementById('ghost-piece').style.display = 'none'; // hide ghost
    document.getElementById("turn-indicator").textContent = "Oska bot's move.";

    setTimeout(() => {
        if (checkWin(boardState)) return;

        const aiMove = oskaplayer(boardState, computerPlayer, searchDepth);
        console.log("AI Move: ");
        printBoard(aiMove);
        updateBoardDOM(aiMove);

        setTimeout(() => {
            if (!checkWin(aiMove)) {
                document.getElementById("turn-indicator").textContent = "Your move.";
            }
        }, 500); // Delay to allow AI move DOM update to render
    }, 500); // Delay to allow user move DOM update to render
}


function removeAllEventListenersFromSquares() {
  const cells = document.querySelectorAll('.col');

  cells.forEach(cell => {
    const newCell = cell.cloneNode(true); // clone the cell, including its attributes and children
    cell.parentNode.replaceChild(newCell, cell); // replace old cell with clone
  });
}

function checkWin(board) {
    let userPiecesInGoal = 0;
    let computerPiecesInGoal = 0;
    let totalUserPieces = count(board, userPlayer);
    let totalComputerPieces = count(board, computerPlayer);
    const topRow = 0;
    const bottomRow = board.length - 1;

    if (totalUserPieces === 0) {
        showWinner("AI wins!", "All your pieces have been captured.");
        gameOver = true;
        return true;
    }

    if (totalComputerPieces === 0) {
        showWinner("You win!", "You have captured all of my Oska bot's pieces.");
        gameOver = true;
        return true;
    }

    // Check if all user's pieces are at the goal
    for (let i = 0; i < board[topRow].length; i++) {
        if (board[0][i] === userPlayer) {
            userPiecesInGoal++;
            if (userPiecesInGoal === totalUserPieces) {
                showWinner("You win!", "Congratulations, you are smarter than my Oska bot.");
                gameOver = true;
                return true;
            }
        }
    }

    for (let i = 0; i < board[bottomRow].length; i++) {
        if (board[bottomRow][i] === computerPlayer) {
            computerPiecesInGoal++;
            if (computerPiecesInGoal === totalComputerPieces) {
                showWinner("AI wins!", "Looks like my Oska bot outsmarted you this time.");
                gameOver = true;
                return true;
            }
        }
    }

    // ❗ Check if computer has no available moves
    const computerMoves = generateNewStates(board, computerPlayer);
    if (computerMoves.length === 0 && totalComputerPieces > 0) {
        showWinner("You win!", "My Oska bot is out of moves. Victory is yours!");
        gameOver = true;
        return true;
    }

    return false;
}

function showWinner(title, message) {
    const modalOverlay = document.getElementById("game-over-modal-overlay");
    const modalTitle = document.getElementById("game-over-modal-title");
    const modalMessage = document.getElementById("game-over-modal-message");

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOverlay.classList.remove("hidden");

    document.getElementById("game-over-modal-ok-btn").onclick = () => {
        modalOverlay.classList.add("hidden");
    };
}


// Helper function to update all the divs based on board array
function updateBoardDOM(board) {
    board.forEach((row, i) => {
        row.forEach((piece, j) => {
            const cell = document.getElementById(`pos-${i}${j}`);
            if (cell) {
                cell.setAttribute('piece', piece);
            }
        });
    });
    clearHighlights();
    removeAllEventListenersFromSquares();
    attachBlackPieceListeners();
}

function updatePlayerMove(fromPos, toPos, piece) {
    const fromCell = document.getElementById(`pos-${fromPos[0]}${fromPos[1]}`);
    const toCell = document.getElementById(`pos-${toPos[0]}${toPos[1]}`);
    fromCell.setAttribute('piece', '-'); // clear the current square
    toCell.setAttribute('piece', piece); // move the player to the new square
}

function clearHighlights() {
  document.querySelectorAll('.col').forEach(col => {
    col.classList.remove('selected');
    col.classList.remove('highlight');
  });
  selectedPiece = null;
  legalMoves = [];
}

function getPosition(id) {
  const [, row, col] = id.match(/pos-(\d)(\d)/);
  return [parseInt(row), parseInt(col)];
}

function getBoardState() {
  const board = [];
  document.querySelectorAll('.row').forEach(row => {
    const rowArr = [];
    row.querySelectorAll('.col').forEach(col => {
      rowArr.push(col.getAttribute('piece'));
    });
    board.push(rowArr);
  });
  console.log("Board state right now = ", board);
  return board;
}

function findMovedFrom(before, after, player) {
  for (let i = 0; i < before.length; i++) {
    for (let j = 0; j < before[i].length; j++) {
      if (before[i][j] === player && after[i][j] === '-') {
        return [i, j];
      }
    }
  }
}

function findMovedTo(before, after, player) {
  for (let i = 0; i < after.length; i++) {
    for (let j = 0; j < after[i].length; j++) {
      if (before[i][j] === '-' && after[i][j] === player) {
        return [i, j];
      }
    }
  }
}

// Restart the game
document.getElementById("restart-btn").addEventListener("click", () => {
    location.reload();
});

document.getElementById("how-to-play-btn").addEventListener("click", () => {
    document.getElementById("how-to-play-modal-overlay").classList.remove("hidden");
});

document.getElementById("how-to-play-modal-close-btn").addEventListener("click", () => {
    document.getElementById("how-to-play-modal-overlay").classList.add("hidden");
});
