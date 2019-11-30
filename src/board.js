import React from 'react';
import _times from 'lodash/times';
import Square, {HIGHLIGHTED_COLOR} from './square';

const ROWS = 3;
const COLS = 3;

function Board(props) {

    const renderSquare = (i) => {
    return <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        background={props.winningLine.includes(i) ? HIGHLIGHTED_COLOR : null }
        />;
    }

    const board = _times(ROWS, (index) => {
        const children =  _times(COLS, (col_index) => { 
            const sq_index = index * 3 + col_index;
            return renderSquare(sq_index);
        });
        return <div className="board-row">{children}</div>;
    });

    return (
        <div>
            {board}
        </div>
    );
}

export default Board;