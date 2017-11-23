import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" style={{background: props.background}} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, highlight = false) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            background = {highlight ? '#86FF99' : ''}
        />;
    }

    render() {
        const winner = calculateWinner(this.props.squares);
        let status;
        if(winner) {
            status = 'Winner: ' + winner.winner;
            return (
                <div>
                    <div className="board-row">
                        {this.renderSquare(0, winner.winningLine.includes(0))}
                        {this.renderSquare(1, winner.winningLine.includes(1))}
                        {this.renderSquare(2, winner.winningLine.includes(2))}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3, winner.winningLine.includes(3))}
                        {this.renderSquare(4, winner.winningLine.includes(4))}
                        {this.renderSquare(5, winner.winningLine.includes(5))}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6, winner.winningLine.includes(6))}
                        {this.renderSquare(7, winner.winningLine.includes(7))}
                        {this.renderSquare(8, winner.winningLine.includes(8))}
                    </div>
                </div>
            );
        } else {
            status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
            return (
                <div>
                    <div className="board-row">
                        {this.renderSquare(0)}
                        {this.renderSquare(1)}
                        {this.renderSquare(2)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(3)}
                        {this.renderSquare(4)}
                        {this.renderSquare(5)}
                    </div>
                    <div className="board-row">
                        {this.renderSquare(6)}
                        {this.renderSquare(7)}
                        {this.renderSquare(8)}
                    </div>
                </div>
            );
        }
    }
}

class Game extends React.Component {
    constructor(){
        super();
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step){
        if(step === 0){
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0,
                history: [
                    {
                        squares: Array(9).fill(null)
                    }
                ]
            })
        } else {
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0,
            })
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner) {
            status = 'Winner: ' + winner.winner;
        } else if (this.state.stepNumber === 9) {
            status = 'No winner :(';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares = {current.squares}
                        onClick = {(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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
        [2, 4, 6],
    ];
    for(let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningLine: lines[i]
            }
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
