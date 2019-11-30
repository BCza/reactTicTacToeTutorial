import React from 'react';
import './index.css';

const HIGHLIGHTED_COLOR = "Yellow";
const HIGHLIGHTED_CLASS = "square-hightlighted";
const REG_CLASS = "square";

function Square(props) {
    return (
    <button className={props.background === HIGHLIGHTED_COLOR ? HIGHLIGHTED_CLASS : REG_CLASS } onClick={() => props.onClick()} >
      {props.value}
    </button>
    );
};

export default Square;
export {HIGHLIGHTED_COLOR};