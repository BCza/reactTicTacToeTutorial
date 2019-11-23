import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import _times from 'lodash/times';

const DRAW_STATE = "It's a draw";
const ROWS = 3;
const COLS = 3;
const HIGHLIGHTED_COLOR = "Yellow";
const HIGHLIGHTED_CLASS = "square-hightlighted";
const REG_CLASS = "square";

function Square(props) {
    return (
    <button className={props.background === HIGHLIGHTED_COLOR ? HIGHLIGHTED_CLASS : REG_CLASS } onClick={() => props.onClick()} >
      {props.value}
    </button>
    );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares : Array(9).fill(null),
      xIsNext: true,
    };
  }

  renderSquare(i) {
    return <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        background={this.props.winningLine.includes(i) ? HIGHLIGHTED_COLOR : null }
      />;
  }

  render() {

    const board = _times(ROWS, (index) => {
        const children =  _times(COLS, (col_index) => { 
            const sq_index = index * 3 + col_index;
            return this.renderSquare(sq_index);
        });
        return <div className="board-row">{children}</div>;
    });

    return (
        <div>
            {board}
        </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      moves_decending: true
    }
  }

  onToggleClicked() {
      console.log("toggle");
      this.setState({
          moves_decending: !this.state.moves_decending
      });
  }

  handleClick(i) {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history.slice(0, stepNumber + 1);
    const current = this.state.history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares, this.state.stepNumber) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.stepNumber);
    const winningLine = findWinningLine(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move :'Go to game start';

        if(move === this.state.stepNumber) {
          return (
            <li>
              <button onClick={() => this.jumpTo(move)}>
              <b>
                {desc}
              </b>
              </button>
            </li>
          );
        }else {
          return (
            <li>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
        }
    });

    const movesDisplayOrder = this.state.moves_decending ? moves : moves.reverse();

    let status;

    if(winner) {
      
      if(winner !== DRAW_STATE) {
        status = 'Winner: ' + winner;
      }else { 
        status = DRAW_STATE;
      }
    }else { 
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={winningLine ? winningLine : []}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ul>{movesDisplayOrder}</ul>
          <button onClick={() => this.onToggleClicked()}>Toggle Moves</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares, stepNumber) {
  var winningLine = findWinningLine(squares);

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
