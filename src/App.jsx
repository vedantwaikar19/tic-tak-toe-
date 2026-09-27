import { useState } from 'react';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const EMPTY_BOARD = Array(9).fill(null);

function getWinningLine(board) {
  return WINNING_LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function Mark({ value, small = false }) {
  if (value === 'X') {
    return <svg className={`mark mark-x${small ? ' mark-small' : ''}`} viewBox="0 0 48 48" aria-hidden="true"><path d="M11 11l26 26M37 11L11 37" /></svg>;
  }
  if (value === 'O') {
    return <svg className={`mark mark-o${small ? ' mark-small' : ''}`} viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="15" /></svg>;
  }
  return null;
}

function App() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const finished = Boolean(winner) || board.every(Boolean);
  const isDraw = finished && !winner;

  function play(index) {
    if (board[index] || finished) return;

    const nextBoard = [...board];
    nextBoard[index] = turn;
    const line = getWinningLine(nextBoard);
    setBoard(nextBoard);

    if (line) {
      setWinner(turn);
      setWinningLine(line);
      setScores((current) => ({ ...current, [turn]: current[turn] + 1 }));
    } else if (nextBoard.every(Boolean)) {
      setScores((current) => ({ ...current, draws: current.draws + 1 }));
    } else {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  }

  function newRound() {
    setBoard(EMPTY_BOARD);
    setTurn('X');
    setWinner(null);
    setWinningLine([]);
  }

  function resetMatch() {
    newRound();
    setScores({ X: 0, O: 0, draws: 0 });
  }

  const status = winner
    ? `${winner === 'X' ? 'Player X' : 'Player O'} takes this round!`
    : isDraw
      ? "It's a draw. Nice game!"
      : `${turn === 'X' ? 'Player X' : 'Player O'}'s turn`;

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Tic-tac-toe home">
          <span className="brand-mark"><Mark value="X" small /></span>
          <span>tic tac toe</span>
        </a>
        <div className="topbar-note">A game for two</div>
        <a className="top-link" href="#how-to-play">How to play</a>
      </header>

      <section className="intro" id="home">
        <div className="eyebrow">PAPER, PENCIL, AND A LITTLE LUCK</div>
        <h1>Tic <em>tac</em> toe</h1>
        <p>A quick game for two. X goes first.</p>
      </section>

      <section className="game-layout" aria-label="Tic-tac-toe game">
        <div className="game-card">
          <div className="game-topline">
            <div className="round-label"><span className="round-icon">{scores.X + scores.O + scores.draws + (finished ? 0 : 1)}</span><div><strong>THE BOARD</strong><small>ROUND {scores.X + scores.O + scores.draws + (finished ? 0 : 1)}</small></div></div>
            <span className="two-player">TWO PLAYERS</span>
          </div>

          <div className={`turn-banner${finished ? ' turn-banner-finished' : ''}`} role="status" aria-live="polite">
            <div className="turn-player"><Mark value={winner || (isDraw ? null : turn)} small /><span>{status}</span></div>
            <span className="turn-hint">{finished ? 'Start another round' : 'Choose a square'}</span>
          </div>

          <div className="board" role="grid" aria-label="Tic-tac-toe board">
            {board.map((cell, index) => (
              <button
                className={`square${cell ? ` square-${cell.toLowerCase()}` : ''}${winningLine.includes(index) ? ' square-winner' : ''}`}
                type="button"
                role="gridcell"
                key={index}
                onClick={() => play(index)}
                disabled={Boolean(cell) || finished}
                aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}${cell ? `, ${cell}` : ', empty'}`}
              >
                <Mark value={cell} />
                {!cell && !finished && <span className="sr-only">Place {turn}</span>}
              </button>
            ))}
          </div>

          <div className="game-actions">
            <button className="primary-button" type="button" onClick={newRound}>
              {finished ? 'Play again' : 'New round'} <span aria-hidden="true">↗</span>
            </button>
            <button className="text-button" type="button" onClick={resetMatch}>Reset match</button>
          </div>
        </div>

        <aside className="side-panel">
          <section className="score-card" aria-label="Scoreboard">
            <div className="side-heading"><span>SCORE</span></div>
            <div className="players">
              <div className={`player-row${!finished && turn === 'X' ? ' player-active' : ''}`}>
                <span className="player-token token-x"><Mark value="X" small /></span>
                <div className="player-name"><strong>Player X</strong><span>{!finished && turn === 'X' ? 'YOUR TURN' : 'CROSSES'}</span></div>
                <strong className="player-score">{scores.X}</strong>
              </div>
              <div className={`player-row${!finished && turn === 'O' ? ' player-active' : ''}`}>
                <span className="player-token token-o"><Mark value="O" small /></span>
                <div className="player-name"><strong>Player O</strong><span>{!finished && turn === 'O' ? 'YOUR TURN' : 'NOUGHTS'}</span></div>
                <strong className="player-score">{scores.O}</strong>
              </div>
            </div>
            <div className="draw-row"><span>Draws</span><strong>{scores.draws}</strong></div>
          </section>

          <section className="tip-card" id="how-to-play">
            <div className="side-heading"><span>HOW TO PLAY</span></div>
            <h2>Three in a row<br /><em>wins the game.</em></h2>
            <p>Take turns placing Xs and Os. Match three across, down, or diagonally to win. Fill the board with no match and it's a draw.</p>
          </section>
        </aside>
      </section>

      <footer className="page-footer"><span>Have fun!</span><span>Next game starts with X</span></footer>
    </main>
  );
}

export default App;
