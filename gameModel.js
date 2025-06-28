// Generates all valid next states for a given player on the board
// Returns a list of boards representing the next possible moves
function movegen(board, player) {
    return generateNewStates(board, player);
}

function generateNewStates(currState, player) {
    const newStates = [];

    for (let i = 0; i < currState.length; i++) {
        for (let j = 0; j < currState[i].length; j++) {
            if (currState[i][j] === player) {
                const position = [i, j];

                const possibleMoves = moveable(currState, player, position);
                const possibleJumps = jumpable(currState, player, position);

                if (possibleMoves.some(obj => obj.move === "left")) {
                    const leftMove = moveLeft(currState, player, position);
                    newStates.push(leftMove);
                }
                if (possibleMoves.some(obj => obj.move === "right")) {
                    const rightMove = moveRight(currState, player, position);
                    newStates.push(rightMove);
                }
                if (possibleJumps.some(obj => obj.move === "left")) {
                    const leftJump = jumpLeft(currState, player, position);
                    newStates.push(leftJump);
                }
                if (possibleJumps.some(obj => obj.move === "right")) {
                    const rightJump = jumpRight(currState, player, position);
                    newStates.push(rightJump);
                }
            }
        }
    }
    return newStates;
}

// Returns a list of the new [i,j] positions that a player can move to
// Used to highlight the squares that the player can move to next
function generateLegalMoves(currState, player, position) {
    const legalMoves = [];

    if (moveable(currState, player, position).move.includes("left")) {
        const leftMove = moveLeft(currState, player, position);
        legalMoves.push({ move: "leftMove", newPos: leftMove.newPos });
    }
    if (moveable(currState, player, position).move.includes("right")) {
        const rightMove = moveRight(currState, player, position);
        legalMoves.push({ move: "rightMove", newPos: rightMove.newPos });
    }
    if (jumpable(currState, player, position).move.includes("left")) {
        const leftJump = jumpLeft(currState, player, position);
        legalMoves.push({ move: "leftJump", newPos: leftJump.newPos });
    }
    if (jumpable(currState, player, position).move.includes("right")) {
        const rightJump = jumpRight(currState, player, position);
        legalMoves.push({ move: "rightJump", newPos: rightJump.newPos });
    }

    return legalMoves;
}

function moveable(currState, player, position) {
    const moveable = [];
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);

    if (player === "w") {
        if (i < middle && j !== 0 && currState[i + 1][j - 1] === "-") {
            moveable.push({ move: "left", newPos: [i + 1, j - 1] });
        } else if (i >= middle && i !== currState.length - 1 && currState[i + 1][j] === "-") {
            moveable.push({ move: "left", newPos: [i + 1, j] });
        }

        if (i < middle && j !== currState[i].length - 1 && currState[i + 1][j] === "-") {
            moveable.push({ move: "right", newPos: [i + 1, j] });
        } else if (i >= middle && i !== currState.length - 1 && currState[i + 1][j + 1] === "-") {
            moveable.push({ move: "right", newPos: [i + 1, j + 1] });
        }
    } else if (player === "b") {
        if (i > middle && j !== 0 && currState[i - 1][j - 1] === "-") {
            moveable.push({ move: "left", newPos: [i - 1, j - 1] });
        } else if (i <= middle && i !== 0 && currState[i - 1][j] === "-") {
            moveable.push({ move: "left", newPos: [i - 1, j] });
        }

        if (i > middle && j !== currState[i].length - 1 && currState[i - 1][j] === "-") {
            moveable.push({ move: "right", newPos: [i - 1, j] });
        } else if (i <= middle && i !== 0 && currState[i - 1][j + 1] === "-") {
            moveable.push({ move: "right", newPos: [i - 1, j + 1] });
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
            jumpable.push({ move: "left", newPos: [i + 2, j - 2] });
        }
        // Jump left - below or equal middle row (including immediate above middle special case)
        else if (
            i >= middle &&
            i + 2 < currState.length &&
            j >= 0 &&
            currState[i + 1][j] === "b" &&
            currState[i + 2][j] === "-"
        ) {
            jumpable.push({ move: "left", newPos: [i + 2, j] });
        }
        // Jump right - not immediate above middle row
        if (
            i < middle - 1 &&
            i + 2 < currState.length &&
            j < currState[i].length - 2 &&
            currState[i + 1][j] === "b" &&
            currState[i + 2][j] === "-"
        ) {
            jumpable.push({ move: "right", newPos: [i + 2, j] });
        }
        // Jump right - below or equal middle row (including immediate above middle special case)
        else if (
            i >= middle &&
            i + 2 < currState.length &&
            j + 2 < currState[i + 2].length &&
            currState[i + 1][j + 1] === "b" &&
            currState[i + 2][j + 2] === "-"
        ) {
            jumpable.push({ move: "right", newPos: [i + 2, j + 2] });
        }
        // Special case: immediately above middle row jump left
        if (
            i === middle - 1 &&
            j - 1 >= 0 &&
            i + 2 < currState.length &&
            currState[i + 1][j - 1] === "b" &&
            currState[i + 2][j - 1] === "-"
        ) {
            jumpable.push({ move: "left", newPos: [i + 2, j - 1] });
        }
        // Special case: immediately above middle row jump right
        if (
            i === middle - 1 &&
            j < currState[i].length - 1 &&
            i + 2 < currState.length &&
            currState[i + 1][j] === "b" &&
            currState[i + 2][j + 1] === "-"
        ) {
            jumpable.push({ move: "right", newPos: [i + 2, j + 1] });
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
            jumpable.push({ move: "left", newPos: [i - 2, j - 2] });
        }
        // Jump left - above or equal middle row
        else if (
            i <= middle &&
            i - 2 >= 0 &&
            j >= 0 &&
            currState[i - 1][j] === "w" &&
            currState[i - 2][j] === "-"
        ) {
            jumpable.push({ move: "left", newPos: [i - 2, j] });
        }
        // Jump right - immediately below middle row
        if (
            i > middle + 1 &&
            i - 2 >= 0 &&
            j < currState[i].length - 2 &&
            currState[i - 1][j] === "w" &&
            currState[i - 2][j] === "-"
        ) {
            jumpable.push({ move: "right", newPos: [i - 2, j] });
        }
        // Jump right - above or equal middle row
        else if (
            i <= middle &&
            i - 2 >= 0 &&
            j + 2 < currState[i - 2].length &&
            currState[i - 1][j + 1] === "w" &&
            currState[i - 2][j + 2] === "-"
        ) {
            jumpable.push({ move: "right", newPos: [i - 2, j + 2] });
        }
        // Special case: immediately below middle row jump left
        if (
            i === middle + 1 &&
            j - 1 >= 0 &&
            i - 2 >= 0 &&
            currState[i - 1][j - 1] === "w" &&
            currState[i - 2][j - 1] === "-"
        ) {
            jumpable.push({ move: "left", newPos: [i - 2, j - 1] });
        }
        // Special case: immediately below middle row jump right
        if (
            i === middle + 1 &&
            j < currState[i].length - 1 &&
            i - 2 >= 0 &&
            currState[i - 1][j] === "w" &&
            currState[i - 2][j + 1] === "-"
        ) {
            jumpable.push({ move: "right", newPos: [i - 2, j + 1] });
        }
    }

    return jumpable;
}

function moveLeft(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);
    newState[i][j] = "-";
    let newPosition = position;

    if (player === "w" && i < middle) {
        newState[i + 1][j - 1] = player;
        newPosition = [i + 1, j - 1];
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j] = player;
        newPosition = [i + 1, j];
    } else if (player === "b" && i > middle) {
        newState[i - 1][j - 1] = player;
        newPosition = [i - 1, j - 1];
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j] = player;
        newPosition = [i - 1, j];
    }

    return { board: newState, newPos: newPosition };
}

function moveRight(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);
    newState[i][j] = "-";
    let newPosition = position;

    if (player === "w" && i < middle) {
        newState[i + 1][j] = player;
        newPosition = [i + 1, j];
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j + 1] = player;
        newPosition = [i + 1, j + 1];
    } else if (player === "b" && i > middle) {
        newState[i - 1][j] = player;
        newPosition = [i - 1, j];
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j + 1] = player;
        newPosition = [i - 1, j + 1];
    }

    return { board: newState, newPos: newPosition };
}

function jumpLeft(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2); //2
    newState[i][j] = "-";
    let newPosition = position;

    if (player === "w" && i < middle - 1) {
        newState[i + 1][j - 1] = "-";
        newState[i + 2][j - 2] = player;
        newPosition = [i + 2, j - 2];
    } else if (player === "w" && i === middle - 1) {
        newState[i + 1][j - 1] = "-";
        newState[i + 2][j - 1] = player;
        newPosition = [i + 2, j - 1];
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j] = "-";
        newState[i + 2][j] = player;
        newPosition = [i + 2, j];
    } else if (player === "b" && i > middle + 1) {
        newState[i - 1][j - 1] = "-";
        newState[i - 2][j - 2] = player;
        newPosition = [i - 2, j - 2];
    } else if (player === "b" && i === middle + 1) {
        newState[i - 1][j - 1] = "-";
        newState[i - 2][j - 1] = player;
        newPosition = [i - 2, j - 1];
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j] = "-";
        newState[i - 2][j] = player;
        newPosition = [i - 2, j];
    }

    return { board: newState, newPos: newPosition };
}

function jumpRight(currState, player, position) {
    const newState = currState.map(row => [...row]);
    const [i, j] = position;
    const middle = Math.floor(currState.length / 2);
    newState[i][j] = "-";
    let newPosition = position;

    if (player === "w" && i < middle - 1) {
        newState[i + 1][j] = "-";
        newState[i + 2][j] = player;
        newPosition = [i + 2, j];
    } else if (player === "w" && i === middle - 1) {
        newState[i + 1][j] = "-";
        newState[i + 2][j + 1] = player;
        newPosition = [i + 2, j + 1];
    } else if (player === "w" && i >= middle) {
        newState[i + 1][j + 1] = "-";
        newState[i + 2][j + 2] = player;
        newPosition = [i + 2, j + 2];
    } else if (player === "b" && i > middle + 1) {
        newState[i - 1][j] = "-";
        newState[i - 2][j] = player;
        newPosition = [i - 2, j];
    } else if (player === "b" && i === middle + 1) {
        newState[i - 1][j] = "-";
        newState[i - 2][j + 1] = player;
        newPosition = [i - 2, j + 1];
    } else if (player === "b" && i <= middle) {
        newState[i - 1][j + 1] = "-";
        newState[i - 2][j + 2] = player;
        newPosition = [i - 2, j + 2];
    }

    return { board: newState, newPos: newPosition };
}

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

    // Count pieces in the goal rows
    let countInWinningIndex = 0;
    let countInOpponentIndex = 0;

    // Determine goal rows for each player
    if (yourPlayer === "w") {
        winningIndex = currState.length - 1;
        opponentIndex = 0;
    } else if (yourPlayer === "b") {
        winningIndex = 0;
        opponentIndex = currState.length - 1;
    }

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
        value = 10; // player's pieces have reached goal state and opponent's have not
        console.log("Value player has won ", value);
    } else if (countInWinningIndex !== 0 &&
        countInWinningIndex === totalCountPlayer &&
        countInOpponentIndex === totalCountOpponent) {
        value = -10; // Do not capture a player's piece to get home faster when it's their last piece
        console.log("Value opp has won at the same time ", value);
    } else if (totalCountOpponent === 0) {
        value = 10; // opponent has lost all pieces
        console.log("Value opp has lost all pieces ", value);
    } else if (countInOpponentIndex !== 0 &&
               countInOpponentIndex === totalCountOpponent &&
               countInWinningIndex !== totalCountPlayer) {
        value = -10; // opponent's pieces have reached goal state and player's have not
        console.log("Value opp has won ", value);
    } else if (totalCountPlayer === 0) {
        value = -10; // player has lost all pieces
        console.log("Value player has lost all pieces ", value);
    } else {
        // No clear win/loss — apply heuristic
        const countPlayerRemaining = totalCountPlayer - countInWinningIndex;
        const countOpponentRemaining = totalCountOpponent - countInOpponentIndex;
        if (currState[winningIndex].includes(yourPlayer)
        && !currState[opponentIndex].includes(opponent)) {
            // at least one player piece has reached goal but none of opponent's pieces have reached goal
            // We add the good things and subtract the bad
            value = countInWinningIndex - totalCountOpponent - countPlayerRemaining;
            // console.log("Lose all your pieces and take the opponent's");
        } else if (!currState[winningIndex].includes(yourPlayer)
        && currState[opponentIndex].includes(opponent)) {
            // at least one opponent piece reached goal but none of player's pieces have reached goal
            value = countInWinningIndex - countInOpponentIndex + countOpponentRemaining + countPlayerRemaining;
            // console.log("Do not lose your pieces and do not take the opponent's");
        } else if (currState[winningIndex].includes(yourPlayer)
        && currState[opponentIndex].includes(opponent)) {
            // both of them have made at least one in
            value = countInWinningIndex - countInOpponentIndex + countOpponentRemaining - countPlayerRemaining;
            // console.log("Lose all your pieces and do not take the opponent's");
        } else {
            // neither of them have made even one in
            value = totalCountPlayer - totalCountOpponent;
            // console.log("Do not lose your pieces and take the opponent's");
        }
        // console.log("Count in winning, opponent, playerRemaining, oppRemaining ", countInWinningIndex, countInOpponentIndex, countPlayerRemaining, countOpponentRemaining);
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
    return player === "w" ? "b" : "w";
}


////////////////// Minimax-based Oska AI implementation ////////////////

function oskaplayer(currState, player, depth) {
    let bestMove = currState;
    let maxVal = -Infinity;
    const neighbors = movegen(currState, player);

    if (neighbors.length === 0) {
        console.log("No valid moves AI can make.");
        return currState;
    }

    for (const { board } of neighbors) {
        const value = MinValue(board, player, depth - 1, player);
        if (value > maxVal) {
            maxVal = value;
            bestMove = board;
        }
    }
    return bestMove;
}

function MaxValue(currState, player, depth, maxPlayer) {
    const opponent = findOpponent(player);
    const myMoves = movegen(currState, player);
    const oppMoves = movegen(currState, opponent);

    // console.log("Next states = ", myMoves);

    if (depth === 0 || (myMoves.length === 0 && oppMoves.length === 0)) {
        return findValue(currState, maxPlayer);
    }

    if (myMoves.length === 0 && oppMoves.length > 0) {
        return MinValue(currState, opponent, depth - 1, maxPlayer);
    }

    let value = -Infinity;
    for (const { board } of myMoves) {
        value = Math.max(value, MinValue(board, opponent, depth - 1, maxPlayer));
    }
    return value;
}

function MinValue(currState, player, depth, maxPlayer) {
    const opponent = findOpponent(player);
    const myMoves = movegen(currState, player);  // 'player' is now the opponent of maxPlayer
    const oppMoves = movegen(currState, opponent);  // maxPlayer's possible moves

    if (depth === 0 || (myMoves.length === 0 && oppMoves.length === 0)) {
        return findValue(currState, maxPlayer);
    }

    if (myMoves.length === 0 && oppMoves.length > 0) {
        return MaxValue(currState, opponent, depth - 1, maxPlayer);
    }

    let value = Infinity;
    for (const { board } of myMoves) {
        value = Math.min(value, MaxValue(board, opponent, depth - 1, maxPlayer));
    }
    return value;
}


////////////////// Testing with fake board states ////////////////
// Simple test - opening position (starting position)
const board1 = [
  ["-", "w", "w", "w"],
  ["w", "-", "-"],
  ["b", "-"],
  ["-", "-", "-"],
  ["b", "-", "b", "b"]
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

// boards.forEach((board, index) => {
//   console.log(`\nTest Case ${index + 1}:`);
//   console.log("Current board:");
//   printBoard(board);
  
//   const nextMove = oskaplayer(board, player, depth);
  
//   console.log("AI's chosen move:");
//   printBoard(nextMove);
// });
