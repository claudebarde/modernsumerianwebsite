import React from "react";
import { Row, Col, Divider, Icon } from "antd";

import styles from "./footer.module.scss";

// "\u{12174}\u{120A0}\u{12313}\u{12228}\u{122F0}\u{12000}"

const Footer = () => {
  return (
    <div className={styles.main} id="footerSection">
      <Row
        type="flex"
        justify="center"
        align="middle"
        style={{ height: "100%" }}
      >
        <Col xs={11} sm={8}>
          Modern Sumerian
          <br />
          <span style={{ fontSize: "1.5rem" }}>
            {"\u{12174}\u{120A0}\u{12313}\u{12228}\u{12000}"}
          </span>
        </Col>
        <Col xs={11} sm={8} style={{ textAlign: "right", fontSize: "1rem" }}>
          <a
            href="https://www.facebook.com/ModernSumerian/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <Icon type="facebook" theme="filled" />
          </a>
          <Divider type="vertical" />
          <a
            href="https://www.memrise.com/course/776887/modern-sumerian/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Lectures
          </a>
          <Divider type="vertical" />
          <a
            href="http://users.teilar.gr/~g1951d/Akkadian.zip"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Cuneiforms
          </a>
          <Divider type="vertical" />
          <a
            href="http://psd.museum.upenn.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            ePSD
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
