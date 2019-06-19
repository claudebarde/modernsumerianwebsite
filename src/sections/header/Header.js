import React from "react";
import { Link } from "react-router-dom";

import styles from "./header.module.scss";

const Header = () => {
  return (
    <div className={styles.menu}>
      <Link to="/">
        <span style={{ fontSize: "1rem" }}>{"\u{1208D}"}</span>
      </Link>
      <Link to="/dictionary">
        <span>Dictionary</span>
      </Link>
      <Link to="/conjugator">
        <span>Conjugator</span>
      </Link>
      <Link to="/flashcardgame">
        <span>Game</span>
      </Link>
    </div>
  );
};

export default Header;
