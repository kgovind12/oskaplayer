let selectedPiece = null;
let legalMoves = [];
let depth = 3;

attachBlackPieceListeners();

// Function to make all the black pieces clickable
function attachBlackPieceListeners() {
  document.querySelectorAll('.col[piece="b"]').forEach(col => {
    col.addEventListener('click', () => {
      console.log("Piece clicked ", col);
      clearHighlights();

      selectedPiece = col;
      col.classList.add('selected');

      const [i, j] = getPosition(col.id);
      const boardState = getBoardState();

      legalMoves = movegen(boardState, 'b');

      legalMoves.forEach(move => {
        const movedFrom = findMovedFrom(boardState, move, 'b');
        const movedTo = findMovedTo(boardState, move, 'b');
        if (movedFrom[0] === i && movedFrom[1] === j) {
          const toId = `pos-${movedTo[0]}${movedTo[1]}`;
          const toCell = document.getElementById(toId);
          if (toCell) {
            toCell.classList.add('highlight');

            toCell.addEventListener('click', () => {
              if (!selectedPiece) return;

              const fromPos = getPosition(selectedPiece.id);
              const toPos = [movedTo[0], movedTo[1]];
              const updatedBoard = getBoardState();

              updatedBoard[toPos[0]][toPos[1]] = updatedBoard[fromPos[0]][fromPos[1]];
              updatedBoard[fromPos[0]][fromPos[1]] = '-';

              updateBoardDOM(updatedBoard);
              clearHighlights();

              console.log("Player moved:");
              printBoard(updatedBoard);

              const aiMove = oskaplayer(updatedBoard, 'w', depth);
              console.log("AI move:");
              printBoard(aiMove);

              updateBoardDOM(aiMove);

              // ✅ Reattach black piece listeners after AI move
              attachBlackPieceListeners();
            }, { once: true });
          }
        }
      });

    });
  });
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

// Bugs
// - None of the 3rd row items are getting selected
// - Black pieces can hop onto each other?? LOL
