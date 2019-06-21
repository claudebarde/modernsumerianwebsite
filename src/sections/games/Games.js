import React from "react";
import { Alert } from "antd";

import styles from "./Games.module.scss";

import FlashcardGame from "./flashcardgame/FlashcardGame";
import Quiz from "./quiz/Quiz";

const Games = () => {
  return (
    <div className={`${styles.main} sections`} id="gameSection">
      <Alert
        className={styles.fontAlert}
        message={
          <div>
            You need to install a cuneiform font to display the characters.
            <br />
            The one used for these games is avaible{" "}
            <a
              href="http://users.teilar.gr/~g1951d/Akkadian.zip"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </div>
        }
        type="info"
        showIcon
        closable
        banner
      />
      <br />
      <FlashcardGame />
      <Quiz />
    </div>
  );
};

export default Games;
