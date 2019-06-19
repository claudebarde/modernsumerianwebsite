import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "antd";

import styles from "./header.module.scss";

const Header = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);

  return (
    <>
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link to="/">
              <span style={{ fontSize: "1rem" }}>{"\u{1208D}"}</span>
            </Link>
          </li>
          <li>
            <Link to="/dictionary">
              <span>Dictionary</span>
            </Link>
          </li>
          <li>
            <Link to="/conjugator">
              <span>Conjugator</span>
            </Link>
          </li>
          <li>
            <Link to="/flashcardgame">
              <span>Game</span>
            </Link>
          </li>
        </ul>
      </nav>
      <nav
        className={styles.menuMobile}
        style={
          visibleMenu
            ? { backgroundColor: "#fff7e6" }
            : { backgroundColor: "#ffd591" }
        }
      >
        <Icon
          type="menu"
          className={styles.burger}
          onClick={() => setVisibleMenu(!visibleMenu)}
        />
        <ul
          style={visibleMenu ? { display: "block" } : { display: "none" }}
          className={styles.menuMobileNav}
        >
          <li onClick={() => setVisibleMenu(false)}>
            <Link to="/">
              <span style={{ fontSize: "1rem" }}>{"\u{1208D}"}</span>
            </Link>
          </li>
          <li onClick={() => setVisibleMenu(false)}>
            <Link to="/dictionary">
              <span>Dictionary</span>
            </Link>
          </li>
          <li onClick={() => setVisibleMenu(false)}>
            <Link to="/conjugator">
              <span>Conjugator</span>
            </Link>
          </li>
          <li onClick={() => setVisibleMenu(false)}>
            <Link to="/flashcardgame">
              <span>Game</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
