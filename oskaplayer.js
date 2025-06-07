// Generates all valid next states for a given player on the board
function movegen(board, player) {
    return generateNewStates(board, player);
}

function generateNewStates(currState, player) {
    const newStates = [];

    for (let i = 0; i < currState.length; i++) {
        for (let j = 0; j < currState[i].length; j++) {
            if (currState[i][j] === player) {
                const position = [i, j];

                if (moveable(currState, player, position).includes("left")) {
                    const leftMove = moveLeft(currState, player, position);
                    newStates.push(leftMove);
                }
                if (moveable(currState, player, position).includes("right")) {
                    const rightMove = moveRight(currState, player, position);
                    newStates.push(rightMove);
                }
                if (jumpable(currState, player, position).includes("left")) {
                    const leftJump = jumpLeft(currState, player, position);
                    newStates.push(leftJump);
                }
                if (jumpable(currState, player, position).includes("right")) {
                    const rightJump = jumpRight(currState, player, position);
                    newStates.push(rightJump);
                }
            }
        }
    }
    return newStates;
}

function moveable(currState, player, position) {
    const moveable = [];
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);

    if (player === "w") {
        if (i < middle && j !== 0 && currState[i + 1][j - 1] === "-") {
            moveable.push("left");
        } else if (i >= middle && i !== currState.length - 1 && currState[i + 1][j] === "-") {
            moveable.push("left");
        }

        if (i < middle && j !== currState[i].length - 1 && currState[i + 1][j] === "-") {
            moveable.push("right");
        } else if (i >= middle && i !== currState.length - 1 && currState[i + 1][j + 1] === "-") {
            moveable.push("right");
        }
    } else if (player === "b") {
        if (i > middle && j !== 0 && currState[i - 1][j - 1] === "-") {
            moveable.push("left");
        } else if (i <= middle && i !== 0 && currState[i - 1][j] === "-") {
            moveable.push("left");
        }

        if (i > middle && j !== currState[i].length - 1 && currState[i - 1][j] === "-") {
            moveable.push("right");
        } else if (i <= middle && i !== 0 && currState[i - 1][j + 1] === "-") {
            moveable.push("right");
        }
    }

    return moveable;
}

function jumpable(currState, player, position) {
    const jumpable = [];
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);

    if (player === "w") {
        // Jump left - not immediate above middle row
        if (
            i < middle - 1 &&
            i + 2 < currState.length &&
            j - 2 >= 0 &&
            currState[i + 1][j - 1] === "b" &&
            currState[i + 2][j - 2] === "-"
        ) {
            jumpable.push("left");
        }
        // Jump left - below or equal middle row (including immediate above middle special case)
        else if (
            i >= middle &&
            i + 2 < currState.length &&
            j >= 0 &&
            currState[i + 1][j] === "b" &&
            currState[i + 2][j] === "-"
        ) {
            jumpable.push("left");
        }
        // Jump right - not immediate above middle row
        if (
            i < middle - 1 &&
            i + 2 < currState.length &&
            j < currState[i].length - 2 &&
            currState[i + 1][j] === "b" &&
            currState[i + 2][j] === "-"
        ) {
            jumpable.push("right");
        }
        // Jump right - below or equal middle row (including immediate above middle special case)
        else if (
            i >= middle &&
            i + 2 < currState.length &&
            j + 2 < currState[i + 2].length &&
            currState[i + 1][j + 1] === "b" &&
            currState[i + 2][j + 2] === "-"
        ) {
            jumpable.push("right");
        }
        // Special case: immediately above middle row jump left
        if (
            i === middle - 1 &&
            j - 1 >= 0 &&
            i + 2 < currState.length &&
            currState[i + 1][j - 1] === "b" &&
            currState[i + 2][j - 1] === "-"
        ) {
            jumpable.push("left");
        }
        // Special case: immediately above middle row jump right
        if (
            i === middle - 1 &&
            j < currState[i].length - 1 &&
            i + 2 < currState.length &&
            currState[i + 1][j] === "b" &&
            currState[i + 2][j + 1] === "-"
        ) {
            jumpable.push("right");
        }
    } else if (player === "b") {
        // Jump left - below immediate middle row
        if (
            i > middle + 1 &&
            i - 2 >= 0 &&
            j - 2 >= 0 &&
            currState[i - 1][j - 1] === "w" &&
            currState[i - 2][j - 2] === "-"
        ) {
            jumpable.push("left");
        }
        // Jump left - above or equal middle row
        else if (
            i <= middle &&
            i - 2 >= 0 &&
            j >= 0 &&
            currState[i - 1][j] === "w" &&
            currState[i - 2][j] === "-"
        ) {
            jumpable.push("left");
        }
        // Jump right - below immediate middle row
        if (
            i > middle + 1 &&
            i - 2 >= 0 &&
            j < currState[i].length - 2 &&
            currState[i - 1][j] === "w" &&
            currState[i - 2][j] === "-"
        ) {
            jumpable.push("right");
        }
        // Jump right - above or equal middle row
        else if (
            i <= middle &&
            i - 2 >= 0 &&
            j + 2 < currState[i - 2].length &&
            currState[i - 1][j + 1] === "w" &&
            currState[i - 2][j + 2] === "-"
        ) {
            jumpable.push("right");
        }
        // Special case: immediately below middle row jump left
        if (
            i === middle + 1 &&
            j - 1 >= 0 &&
            i - 2 >= 0 &&
            currState[i - 1][j - 1] === "w" &&
            currState[i - 2][j - 1] === "-"
        ) {
            jumpable.push("left");
        }
        // Special case: immediately below middle row jump right
        if (
            i === middle + 1 &&
            j < currState[i].length - 1 &&
            i - 2 >= 0 &&
            currState[i - 1][j] === "w" &&
            currState[i - 2][j + 1] === "-"
        ) {
            jumpable.push("right");
        }
    }

    return jumpable;
}


function moveLeft(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);

    newState[i][j] = "-";

    if (player === "w" && i < middle) {
        newState[i + 1][j - 1] = player;
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j] = player;
    } else if (player === "b" && i > middle) {
        newState[i - 1][j - 1] = player;
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j] = player;
    }

    return newState;
}

function moveRight(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);

    newState[i][j] = "-";

    if (player === "w" && i < middle) {
        newState[i + 1][j] = player;
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j + 1] = player;
    } else if (player === "b" && i > middle) {
        newState[i - 1][j] = player;
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j + 1] = player;
    }

    return newState;
}

function jumpLeft(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);
    newState[i][j] = "-";

    if (player === "w" && i < middle - 1) {
        newState[i + 1][j - 1] = "-";
        newState[i + 2][j - 2] = player;
    } else if (player === "w" && i === middle - 1) {
        newState[i + 1][j] = "-";
        newState[i + 2][j - 1] = player;
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j] = "-";
        newState[i + 2][j - 1] = player;
    } else if (player === "b" && i > middle + 1) {
        newState[i - 1][j - 1] = "-";
        newState[i - 2][j - 2] = player;
    } else if (player === "b" && i === middle + 1) {
        newState[i - 1][j] = "-";
        newState[i - 2][j - 1] = player;
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j] = "-";
        newState[i - 2][j - 1] = player;
    }

    return newState;
}

function jumpRight(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);
    newState[i][j] = "-";

    if (player === "w" && i < middle - 1) {
        newState[i + 1][j] = "-";
        newState[i + 2][j + 1] = player;
    } else if (player === "w" && i === middle - 1) {
        newState[i + 1][j] = "-";
        newState[i + 2][j + 1] = player;
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j + 1] = "-";
        newState[i + 2][j + 2] = player;
    } else if (player === "b" && i > middle + 1) {
        newState[i - 1][j] = "-";
        newState[i - 2][j - 1] = player;
    } else if (player === "b" && i === middle + 1) {
        newState[i - 1][j] = "-";
        newState[i - 2][j + 1] = player;
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j + 1] = "-";
        newState[i - 2][j + 2] = player;
    }

    return newState;
}

// function printBoard(currState) {
//     const rowCount = currState.length;
//     const middle = Math.floor(rowCount / 2);

//     console.log("    " + "-".repeat(4 * currState[0].length - 1));

//     for (let i = 0; i < middle; i++) {
//         let rowStr = "| ";
//         for (let j = 0; j < currState[i].length; j++) {
//             rowStr += currState[i][j] + " | ";
//         }
//         const numDashes = 4 * currState[i].length - 1;
//         const numSpaces = Math.floor((4 * currState[i].length) / currState[i].length);
//         console.log(" ".repeat(numSpaces) + rowStr + " ".repeat(numSpaces));
//         console.log("    " + "-".repeat(numDashes));
//     }

//     for (let i = middle; i < rowCount - 1; i++) {
//         let rowStr = "| ";
//         for (let j = 0; j < currState[i].length; j++) {
//             rowStr += currState[i][j] + " | ";
//         }
//         const numDashes = 4 * currState[i].length + 3;
//         const numSpaces = Math.floor(numDashes / currState[i].length);
//         console.log(" ".repeat(numSpaces) + rowStr + " ".repeat(numSpaces));
//         console.log("    " + "-".repeat(numDashes));
//     }

//     // Last row
//     let lastRowStr = "| ";
//     for (let j = 0; j < currState[rowCount - 1].length; j++) {
//         lastRowStr += currState[rowCount - 1][j] + " | ";
//     }
//     const finalDashes = 4 * currState[rowCount - 1].length - 1;
//     const finalSpaces = Math.floor(finalDashes / currState[rowCount - 1].length);
//     console.log(" ".repeat(finalSpaces) + lastRowStr + " ".repeat(finalSpaces));
//     console.log("    " + "-".repeat(finalDashes));
// }

// Simplified way to print the board in JS
function printBoard(board) {
  const n = board.length;

  // First, build all the rows as strings (joined with spaces)
  const rows = board.map(row => row.join(" "));

  // Find the max row length (to center all rows accordingly)
  const maxLength = Math.max(...rows.map(r => r.length));

  for (let i = 0; i < n; i++) {
    const rowStr = rows[i];
    // Calculate leading spaces to center this row
    const totalPadding = maxLength - rowStr.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const indent = " ".repeat(leftPadding);

    console.log(indent + rowStr);
  }
}


////////////////// Move generator ends here ////////////////

function count(currState, player) {
    let count = 0;
    for (let i = 0; i < currState.length; i++) {
        for (let j = 0; j < currState[i].length; j++) {
            if (currState[i][j] === player) {
                count++;
            }
        }
    }
    return count;
}

function findValue(currState, yourPlayer) {
    const opponent = findOpponent(yourPlayer);
    let winningIndex = 0;
    let opponentIndex = 0;

    // Count total pieces for player and opponent
    const totalCountPlayer = count(currState, yourPlayer);
    const totalCountOpponent = count(currState, opponent);

    // Determine goal rows for each player
    if (yourPlayer === "w") {
        winningIndex = currState.length - 1;
        opponentIndex = 0;
    } else if (yourPlayer === "b") {
        winningIndex = 0;
        opponentIndex = currState.length - 1;
    }

    // Count pieces in the goal rows
    let countInWinningIndex = 0;
    let countInOpponentIndex = 0;

    for (const piece of currState[winningIndex]) {
        if (piece === yourPlayer) countInWinningIndex++;
    }

    for (const piece of currState[opponentIndex]) {
        if (piece === opponent) countInOpponentIndex++;
    }

    let value;

    // Win/loss/draw conditions
    if (countInWinningIndex !== 0 &&
        countInWinningIndex === totalCountPlayer &&
        countInOpponentIndex !== totalCountOpponent) {
        value = 10;
    } else if (count(currState, opponent) === 0) {
        value = 10;
    } else if (countInOpponentIndex !== 0 &&
               countInOpponentIndex === totalCountOpponent &&
               countInWinningIndex !== totalCountPlayer) {
        value = -10;
    } else if (count(currState, yourPlayer) === 0) {
        value = -10;
    } else if (countInWinningIndex === totalCountPlayer && countInOpponentIndex === totalCountOpponent) {
        if (countInWinningIndex > countInOpponentIndex) {
            value = 10;
        } else if (countInOpponentIndex > countInWinningIndex) {
            value = -10;
        } else {
            value = 0;
        }
    } else {
        // No clear win/loss — apply heuristic
        if (currState[winningIndex].includes(yourPlayer)) {
            const countPlayerRemaining = count(currState, yourPlayer) - countInWinningIndex;
            const countOpponentRemaining = count(currState, opponent) - countInOpponentIndex;
            value = countInWinningIndex - countInOpponentIndex + (countPlayerRemaining - countOpponentRemaining);
        } else {
            value = count(currState, yourPlayer) - count(currState, opponent);
        }
        // value += positionalScore(currState, yourPlayer) - positionalScore(currState, opponent); // uncomment to improve heuristic
    }

    return value;
}

function positionalScore(currState, player) {
    let score = 0;
    const rows = currState.length;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < currState[i].length; j++) {
            if (currState[i][j] === player) {
                // For example, for 'w' closer to bottom is better,
                // for 'b' closer to top is better
                let progress = (player === 'w') ? i : (rows - 1 - i);
                score += progress;
            }
        }
    }
    return score;
}

function findOpponent(player) {
    if (player === "w") return "b";
    if (player === "b") return "w";
    return "";
}

////////////////// Minimax-based Oska AI implementation ////////////////

function findOpponent(player) {
    return player === "w" ? "b" : "w";
}

function oskaplayer(currState, player, depth) {
    let bestMove = currState;
    let maxVal = -Infinity;
    const neighbors = movegen(currState, player);

    for (const neighbor of neighbors) {
        const value = MinValue(neighbor, player, depth - 1);
        if (value > maxVal) {
            maxVal = value;
            bestMove = neighbor;
        }
    }
    return bestMove;
}

function MaxValue(currState, player, depth) {
    const opponent = findOpponent(player);
    const myMoves = movegen(currState, player);
    const oppMoves = movegen(currState, opponent);

    if (depth === 0 || (myMoves.length === 0 && oppMoves.length === 0)) {
        return findValue(currState);
    }

    if (myMoves.length === 0 && oppMoves.length > 0) {
        return MaxValue(currState, opponent, depth - 1);
    }

    let value = -Infinity;
    for (const move of myMoves) {
        value = Math.max(value, MinValue(move, player, depth - 1));
    }
    return value;
}

function MinValue(currState, player, depth) {
    const opponent = findOpponent(player);
    const myMoves = movegen(currState, player);
    const oppMoves = movegen(currState, opponent);

    if (depth === 0 || (myMoves.length === 0 && oppMoves.length === 0)) {
        return findValue(currState);
    }

    if (myMoves.length === 0 && oppMoves.length > 0) {
        return MinValue(currState, opponent, depth - 1);
    }

    let value = Infinity;
    for (const move of myMoves) {
        value = Math.min(value, MaxValue(move, player, depth - 1));
    }
    return value;
}

function findValue(currState) {
    const whiteCount = count(currState, "w");
    const blackCount = count(currState, "b");
    return whiteCount - blackCount; // Positive if white is winning, negative if black is winning
}


////////////////// Testing with fake board states ////////////////
// Simple test - opening position (starting position)
const board1 = [
  ["w", "w", "w", "w"],
  ["-", "-", "-"],
  ["-", "-"],
  ["-", "-", "-"],
  ["b", "b", "b", "b"]
];

// Slightly advanced - white about to jump a black pawn
const board2 = [
  ["-", "w", "w", "w"],
  ["-", "b", "-"],
  ["-", "-"],
  ["-", "-", "-"],
  ["b", "-", "b", "b"]
];

// Medium complexity - pieces mixed up in the middle
const board3 = [
  ["-", "w", "-", "w"],
  ["-", "b", "w"],
  ["-", "b"],
  ["-", "w", "b"],
  ["b", "-", "-", "b"]
];

// Hard case - multiple jumps possible, tricky to decide best move
const board4 = [
  ["w", "-", "w", "-"],
  ["-", "b", "-"],
  ["b", "-"],
  ["-", "b", "w"],
  ["-", "-", "b", "b"]
];

// Very hard - almost endgame scenario
const board5 = [
  ["-", "-", "-", "w"],
  ["-", "b", "w"],
  ["-", "-"],
  ["-", "b", "-"],
  ["-", "-", "b", "b"]
];

const boards = [board1, board2, board3, board4, board5];
const player = "w"; // or "b"
const depth = 3; // depth can be tuned for performance vs strength

boards.forEach((board, index) => {
  console.log(`\nTest Case ${index + 1}:`);
  console.log("Current board:");
  printBoard(board);
  
  const nextMove = oskaplayer(board, player, depth);
  
  console.log("AI's chosen move:");
  printBoard(nextMove);
});
