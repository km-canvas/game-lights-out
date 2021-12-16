import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  };
  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
    this.makeTable = this.makeTable.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = []; 
    for(let y=0; y < this.props.nrows; y++) {
      let row = [];
      for(let x=0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn)
      }
      board.push(row);
    }
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);
    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x]; // setting clicked cell to opposite boolean
      }
    }
    flipCell(y, x); // flip clicked cell to true/false
    flipCell(y, x - 1); // flip cell to left
    flipCell(y, x + 1); // flip cell to right
    flipCell(y - 1, x); // flip cell below
    flipCell(y + 1, x); // flip cell above
    // win when every cell is turned off
    let hasWon = board.every(row => row.every(cell => !cell))
    this.setState({board, hasWon});
  }

  makeTable() {
    let tblBoard = [];
    for(let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for(let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`
        row.push(<Cell key={coord} isLit={this.state.board[y][x]}
        flipCellsAroundMe={() => this.flipCellsAround(coord)}/>)
      } 
      tblBoard.push(<tr key={y}>{row}</tr>)
    }
    return (
      <table className="Board">
        <tbody>
          {tblBoard}
        </tbody>
      </table>
    )
  }

  render() {
    // if the game is won, just show a winning msg & otherwise show
    return (
      <div>
        {this.state.hasWon ? (
          <div className="winner">
            <span className="neon-orange">you</span>
            <span className="neon-blue">WIN!</span>
          </div>
         ) : (
          <div>
            <div className="Board-title">
              <div className="neon-orange">Lights</div>
              <div className="neon-blue">Out</div>
            </div>
            {this.makeTable()}
          </div>
         )}
      </div>
    );
  }
}

export default Board;
