import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Icon, Drawer } from "antd";

import styles from "./header.module.scss";

const Header = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);

  return (
    <>
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link to="/">
              <span style={{ fontSize: "1.2rem" }}>{"\u{1208D}"}</span>
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
            <Link to="/games">
              <span>Games</span>
            </Link>
          </li>
          <li>
            <Link to="/resources">
              <span>Resources</span>
            </Link>
          </li>
          <li>
            <Link to="/help">
              <span>Help</span>
            </Link>
          </li>
        </ul>
      </nav>
      <Icon
        type="menu"
        className={styles.burger}
        onClick={() => setVisibleMenu(!visibleMenu)}
      />
      <Drawer
        title="Sections"
        placement="top"
        onClose={() => setVisibleMenu(false)}
        visible={visibleMenu}
      >
        <nav className={styles.menuMobile}>
          <ul className={styles.menuMobileNav}>
            <li onClick={() => setVisibleMenu(false)}>
              <Link to="/">
                <span style={{ fontSize: "1.2rem" }}>{"\u{1208D}"}</span>
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
                <span>Games</span>
              </Link>
            </li>
            <li onClick={() => setVisibleMenu(false)}>
              <Link to="/ressources">
                <span>Ressources</span>
              </Link>
            </li>
            <li onClick={() => setVisibleMenu(false)}>
              <Link to="/help">
                <span>Help</span>
              </Link>
            </li>
          </ul>
        </nav>
      </Drawer>
    </>
  );
};

export default Header;
