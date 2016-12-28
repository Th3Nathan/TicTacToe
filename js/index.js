"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Stateless functional component. Only consists of render method.
function Square(props) {
  return React.createElement(
    "div",
    { className: "square", onClick: function onClick() {
        return props.onClick();
      } },
    React.createElement(
      "h1",
      { className: "piece" },
      props.value
    )
  );
}

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.state = {
      squares: Array(9).fill(null),
      xIsNext: false,
      winner: null,
      winnerBoardDisplay: "none",
      tieBoardDisplay: "none",
      aiActive: false
    };
    return _this;
  }

  Board.prototype.activateAI = function activateAI() {
    this.setState({
      aiActive: true
    });
    this.reset();
  };

  Board.prototype.deactivateAI = function deactivateAI() {
    this.setState({
      aiActive: false
    });
    this.reset();
  };

  Board.prototype.reset = function reset() {
    this.setState({
      winner: null,
      xIsNext: false,
      squares: Array(9).fill(null)
    });
  };

  Board.prototype.handleWin = function handleWin(winner) {
    var that = this;
    this.setState({
      winner: winner,
      winnerBoardDisplay: "block"
    });
    setTimeout(function () {
      that.reset();
      that.setState({
        winnerBoardDisplay: "none"
      });
    }, 1500);
  };

  Board.prototype.handleTie = function handleTie() {
    var that = this;
    this.setState({
      tieBoardDisplay: "block"
    });
    setTimeout(function () {
      that.reset();
      that.setState({
        tieBoardDisplay: "none"
      });
    }, 1500);
  };

  Board.prototype.handleClick = function handleClick(i) {
    var squares = this.state.squares;
    if (this.state.winner || this.state.squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({ squares: squares,
      xIsNext: !this.state.xIsNext });
    var winner = checkForWinner(squares);

    if (winner) {
      this.handleWin(winner);
    }

    if (checkForTie(squares)) {
      this.handleTie();
    }

    //Following runs if AI active. Fills a square and checks for game end.
    if (this.state.aiActive) {
      var selection = findMove(squares);
      squares[selection] = "X";
      this.setState({
        squares: squares,
        xIsNext: false
      });

      var winner = checkForWinner(squares);
      if (winner) {
        this.handleWin(winner);
      }
      if (checkForTie(squares)) {
        this.handleTie();
      }
    }
  };

  Board.prototype.renderSquare = function renderSquare(index) {
    var _this2 = this;

    return React.createElement(Square, { value: this.state.squares[index], onClick: function onClick() {
        return _this2.handleClick(index);
      } });
  };

  Board.prototype.render = function render() {
    var _this3 = this;

    var _state = this.state;
    var squares = _state.squares;
    var winner = _state.winner;
    var winnerBoardDisplay = _state.winnerBoardDisplay;
    var tieBoardDisplay = _state.tieBoardDisplay;
    var xIsNext = _state.xIsNext;

    var winStyle = { display: winnerBoardDisplay };
    var tieStyle = { display: tieBoardDisplay };

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        { style: winStyle, className: "win_box message_box" },
        "the winner is ",
        winner,
        "!"
      ),
      React.createElement(
        "h1",
        { onClick: function onClick() {
            return _this3.activateAI();
          }, className: "ai_set message_box" },
        "VS AI"
      ),
      React.createElement(
        "h1",
        { onClick: function onClick() {
            return _this3.deactivateAI();
          }, className: "two_player_set message_box" },
        "VS Human"
      ),
      React.createElement(
        "h1",
        { style: tieStyle, className: "message_box" },
        "It's a tie!"
      ),
      React.createElement(
        "div",
        { className: "board" },
        this.renderSquare(0),
        this.renderSquare(1),
        this.renderSquare(2),
        this.renderSquare(3),
        this.renderSquare(4),
        this.renderSquare(5),
        this.renderSquare(6),
        this.renderSquare(7),
        this.renderSquare(8)
      )
    );
  };

  return Board;
}(React.Component);

ReactDOM.render(React.createElement(Board, null), document.getElementById("container"));

var patterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

function checkForWinner(squares) {
  for (var i = 0; i < patterns.length; i++) {
    var a = patterns[i][0];
    var b = patterns[i][1];
    var c = patterns[i][2];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
}

function checkForTie(squares) {
  return squares.every(function (val) {
    return val !== null;
  });
}

//AI
function findMove(game) {
  //If there are two in a row, this chooses the third
  for (var i = 0; i < patterns.length; i++) {
    var a = patterns[i][0];
    var b = patterns[i][1];
    var c = patterns[i][2];
    if (!game[c] && game[a] && game[a] == game[b]) {
      return c;
    }
    if (!game[b] && game[c] && game[a] == game[c]) {
      return b;
    }
    if (!game[a] && game[b] && game[b] == game[c]) {
      return a;
    }
  }

  //following moves are to be taken if no need to critically defend or win
  //Prevent being forced
  if (game[0] == "O" && game[7] == "O") return 6;

  if (game[2] == "O" && game[7] == "O") return 9;

  if (game[9] == "O" && game[1] == "O") return 2;

  if (game[7] == "O" && game[1] == "O") return 0;

  //Move to center if open
  if (!game[4]) return 4;

  //Move diagonal if open
  if (!game[0]) return 0;
  if (!game[2]) return 2;
  if (!game[6]) return 6;
  if (!game[8]) return 8;
}