import React, { useState } from 'react';
import Game from './engine/game';
import './styles/app.scss';
import logo from './assets/icon-64.png';

function App() {
  const highScore = localStorage.getItem('hi-score') || 0;
  const [play, setPlay] = useState(false);
  const [prevScore, setPrevScore] = useState(0);
  const [closeGame, setCloseGame] = useState(true);
  const onGameOver = (score: number) => {
    if (score > highScore) {
      localStorage.setItem('hi-score', score.toString());
    }
    setPrevScore(score);
    setCloseGame(true);
    setPlay(false);
  }

  const onGameClose = ()=>{
    setCloseGame(true);
    setPlay(false);
  }

  return (
    <div className="App">
      {
        closeGame &&
        <div className="landing-page-container">
          <div className="score-container">
            <div className="hi-score-container">
              High Score : {highScore}
            </div>
            <div className="prev-score-container">
              Previous Score : {prevScore}
            </div>
          </div>
          <div className="title-container">
            <img src={logo} alt={'title-snake'} className={'title-container__img'} />
            <h1 className="title-container__title">The Snake Game</h1>
          </div>
          <div className="controls-container">
            <button className={'controls-container__button btn'} onClick={() => {
              setCloseGame(false);
              setPlay(true)
            }}
            >
              Start New Game
          </button>
          </div>
        </div>
      }

      {
        !closeGame &&
        <div className="game-container">
          <div className="game-container__game">
            <Game play={play} onGameOver={onGameOver} onGameClose = {onGameClose} initialGameSpeed={3} />
          </div>
          <div className="game-container__pause">
            <button className={'btn'} onClick={() => setPlay(!play)}>
              {!play ? 'Play' : 'Pause'}
            </button>
          </div>
          
        </div>
      }

    </div>
  );
}

export default App;
