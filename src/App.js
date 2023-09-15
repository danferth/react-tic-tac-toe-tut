import { useState } from "react";

// Squares for board
function Square({ value, win, onSquareClick }) {
  return (
    <button
      className={win ? "square winner" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

// Game board
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    xIsNext ? (nextSquares[i] = "X") : (nextSquares[i] = "O");
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  // EXTRA 4. check if all squares have been checked
  const allSquaresChecked = squares.includes(null);
  let status;
  if (winner) {
    status = "Winner: " + winner[0];
  } else {
    status = "Nextplayer: " + (xIsNext ? "X" : "O");
  }
  // EXTRA 4. no winner and all squares checked means it's a draw
  if (!allSquaresChecked && !winner) {
    status = "Game is a draw";
  }

  // EXTRA 2. (loop 1) create array squares
  let rowSquares = [];
  for (let i = 0; i <= 8; i++) {
    const rowItem = (
      <Square
        key={`square${i}`}
        value={squares[i]}
        // EXTRA 4. check for winner true and if square is included in winner[1]
        win={winner ? (winner[1].includes(i) ? true : false) : false}
        onSquareClick={() => handleClick(i)}
      />
    );
    rowSquares.push(rowItem);
  }
  // EXTRA 2. create BoardRow component
  const BoardRow = ({ children }) => {
    return <div className="board-row">{children}</div>;
  };

  // EXTRA 2. (loop 2) create board rows and insert squares
  let gameBoard = [];
  for (let board_n = 0; board_n < 3; board_n++) {
    const newRow = (
      <BoardRow key={board_n}>
        {rowSquares.slice(board_n * 3, board_n * 3 + 3)}
      </BoardRow>
    );
    gameBoard.push(newRow);
  }

  return (
    <>
      <div className="status">{status}</div>
      {/* EXTRA 2. display  */}
      {gameBoard}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortOrder, setSortOrder] = useState(true);
  // EXTRA 3. sortOrder ? Descending : Ascending
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setSortOrder(true);
  }

  // EXTRA 1. function to display current move #
  function currentDisplayedMove(currentMove) {
    if (currentMove > 0) {
      return `you are at move #${currentMove}`;
    }
  }
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function calculateMove(history, move) {
    // EXTRA 5. function to get row/col of move
    // 1. find index of new move
    const lastMove = history[move - 1];
    const newMove = history[move];
    let moveIndex;
    if (lastMove) {
      for (let i = 0; i < lastMove.length; i++) {
        if (newMove[i] !== lastMove[i]) {
          moveIndex = i;
        }
      }
    }
    // 2. calculate the (row, col) of the move
    if (moveIndex || moveIndex === 0) {
      let x = moveIndex;
      let row;
      let col;
      // find row
      if (x < 3) {
        row = "A";
      }
      if (x > 2 && x < 6) {
        row = "B";
      }
      if (x > 5 && x < 9) {
        row = "C";
      }
      if (x === 0 || x === 3 || x === 6) {
        col = "1";
      }
      if (x === 1 || x === 4 || x === 7) {
        col = "2";
      }
      if (x === 2 || x === 5 || x === 8) {
        col = "3";
      }
      // return the result for display
      return [row, col];
    }
  }

  // EXTRA 3. function to toggle sort history
  function movesFunc() {
    // build a descending list
    let moves = history.map((squares, move) => {
      // EXTRA 5. set move calculation to varable
      let moveCoordinates = calculateMove(history, move);
      let player = move % 2 === 0 ? "O" : "X";

      let description;
      if (move > 0) {
        description =
          "Move # " +
          move +
          " : " +
          player +
          " [row:" +
          moveCoordinates[0] +
          " | col:" +
          moveCoordinates[1] +
          "]";
      } else {
        description = "Go to game start";
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    });
    if (sortOrder) {
      // for descending
      return moves;
    } else {
      // for ascending return reversed
      return moves.reverse();
    }
  }

  let moves = movesFunc();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button
          onClick={() => {
            resetGame();
          }}
        >
          Reset Game
        </button>
        {/* EXTRA 3. Toggle to sort history */}
        <button
          onClick={() => {
            setSortOrder(!sortOrder);
          }}
        >
          Moves Sorted {sortOrder ? "Descending" : "Ascending"}
        </button>
        <ol>{moves}</ol>
        {/* EXTRA 1. show current move # */}
        <span>{currentDisplayedMove(currentMove)}</span>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // EXTRA 4. add winning line to return
      return [squares[a], lines[i]];
    }
  }
  return null;
}

// EXTRAS
// COMPLETE 1.For the current move only, show “You are at move #…” instead of a button.
// COMPLETE 2.Rewrite Board to use two loops to make the squares instead of hardcoding them.
// COMPLETE 3.Add a toggle button that lets you sort the moves in either ascending or descending order.
// COMPLETE 4.When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
// COMPLETE 5.Display the location for each move in the format (row, col) in the move history list.

// personal extras
// COMPLETE 1. add player (X or O) to move list
// COMPLETE 2. add a game reset button
