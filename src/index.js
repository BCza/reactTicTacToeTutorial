/* eslint-disable no-template-curly-in-string */
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './board';

const DRAW_STATE = "It's a draw";

const Game = () => {

    const [history, setHistory] = useState(
        [{squares: Array(9).fill(null), currentMove: null,}]
    );

    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [moves_decending, setMovesDecending] = useState(true);

  const handleClick = (i) => {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares, stepNumber) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';

    const currentRow = Math.floor(i/3) + 1;
    const currentCol = i % 3 + 1;

    setHistory(
        currentHistory.concat({
            squares,
            currentMove: [currentRow, currentCol]
        })
    ); 

    setStepNumber(history.length);
    setXIsNext(!xIsNext);
  }

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0); 
  }

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares, stepNumber);
    const winningLine = findWinningLine(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move :'Go to game start';
        const stepValue = move === stepNumber ? <b>{desc}</b> : desc;
        const button = <button onClick={() => {jumpTo(move)}}>{stepValue}</button>;

        const currentMove = history[move].currentMove;
        const moveSet =  currentMove ? <span className="move-item">({currentMove[0]},{currentMove[1]})</span> : null; 

        return (
            <li>
                <div>
                    <span>
                    {button}
                    {moveSet}
                    </span>
                </div>
            </li>
        );
    });

    const movesDisplayOrder = moves_decending ? moves : moves.reverse();
    const status = determineStatus(winner, xIsNext);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => handleClick(i)}
            winningLine={winningLine ? winningLine : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{movesDisplayOrder}</ul>
          <button onClick={() => setMovesDecending(!moves_decending)}>Toggle Moves</button>
        </div>
      </div>
    );
};

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function determineStatus(winner, xIsNext) {
    const isWinner =  winner !== null;
    const isDraw = winner && winner === DRAW_STATE;

    if(isWinner) {
        return isDraw ? DRAW_STATE : 'Winner: ' + winner;
    }

    return 'Next player: ' + (xIsNext ? 'X' : 'O');
}

function calculateWinner(squares, stepNumber) {
  const winningLine = findWinningLine(squares);

  if(winningLine) { 
      return squares[winningLine[0]];
  }

  const drawStepNumber = 9;
  if(stepNumber === drawStepNumber) {
      return DRAW_STATE;
  }

  return null;
};

function findWinningLine (squares) { 
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return lines[i];
        }
      }
    return null;
}
