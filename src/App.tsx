import React, { useState } from "react";
import Game from "./engine/game";
import "./styles/app.scss";
import logo from "./assets/icon-64.png";

function App() {
  const highScore = localStorage.getItem("hi-score") || 0;
  const [play, setPlay] = useState(false);
  const [prevScore, setPrevScore] = useState(0);
  const [closeGame, setCloseGame] = useState(true);
  const [gameOverModal, setGameOverModal] = useState(false);
  const onGameOver = (score: number) => {
    setPrevScore(score);
    setGameOverModal(true);
    setPlay(false);
  };

  const onClickOkOnModal = () => {
    if (prevScore > highScore) {
      localStorage.setItem("hi-score", prevScore.toString());
    }
    setCloseGame(true);
    setGameOverModal(false);
  };

  const onGameClose = () => {
    setCloseGame(true);
    setPlay(false);
  };

  return (
    <div className="App">
      <div className={"modal-container " + (gameOverModal ? "modal-show" : "")}>
        <div className={"game-over-modal modal"}>
          <div className={"game-over-modal__text"}>
            <h2>GAME OVER</h2>
            {prevScore > highScore ? (
              <p className={"success-text subheading"}>
                Congratulation! you have made a high score
              </p>
            ) : (
              <p className={"failure-text subheading"}>
                Bad Luck! Try next time
              </p>
            )}
            <p className={"score-text"}> You Score {prevScore} points. </p>
          </div>
          <div className={"game-over-model__okbutton"}>
            <button className={"btn"} onClick={onClickOkOnModal}>
              OK
            </button>
          </div>
        </div>
      </div>
      {closeGame && (
        <div className="landing-page-container">
          <div className="score-container">
            <div className="hi-score-container">High Score : {highScore}</div>
            <div className="prev-score-container">
              Previous Score : {prevScore}
            </div>
          </div>
          <div className="title-container">
            <img
              src={logo}
              alt={"title-snake"}
              className={"title-container__img"}
            />
            <h1 className="title-container__title">The Snake Game</h1>
          </div>
          <div className="controls-container">
            <button
              className={"controls-container__button btn"}
              onClick={() => {
                setCloseGame(false);
                setPlay(true);
              }}
            >
              Start New Game
            </button>
          </div>
          <div className="attribution-container">
            <p>
              <span>&#169;</span>
              <span>
                {new Date().getFullYear()}. Project created by{" "}
                <a
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={"https://www.linkedin.com/in/namrata-tiwari-7ba137234/"}
                >
                  {" "}
                  Namrata Tiwari
                </a>
                <a
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={"https://www.linkedin.com/in/anasnew99/"}
                >
                  {" "}
                  Anas Aneeque
                </a>
                , , Mohd Ammar{" "}
              </span>
            </p>
            <p>
              Check out{" "}
              <a
                href={"https://github.com/Anasnew99/snake-game"}
                target={"_blank"}
                rel={"noreferrer"}
              >
                Github
              </a>
            </p>
          </div>
        </div>
      )}

      {!closeGame && (
        <div className="game-container">
          <div className="game-container__game">
            <Game
              play={play}
              onGameOver={onGameOver}
              onGameClose={onGameClose}
              initialGameSpeed={3}
            />
          </div>
          <div className="game-container__pause">
            <button className={"btn"} onClick={() => setPlay(!play)}>
              {!play ? "Play" : "Pause"}
            </button>
          </div>
          <div className={"game-container__controlIns"}>
            <p>
              <span color={"red"}>Controls</span> :{" "}
              <span color={"blue"}>Swipe</span> anywhere on board to change
              snake direction or use <span color={"blue"}>arrow</span> keys to
              change direction
            </p>
          </div>
          <div className="attribution-container">
            <p>
              <span>&#169;</span>
              <span>
                {new Date().getFullYear()}. Project created by{" "}
                <a
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={"https://www.linkedin.com/in/namrata-tiwari-7ba137234/"}
                >
                  {" "}
                  Namrata Tiwari
                </a>
                <a
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={"https://www.linkedin.com/in/anasnew99/"}
                >
                  {" "}
                  Anas Aneeque
                </a>
                , , Mohd Ammar{" "}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
