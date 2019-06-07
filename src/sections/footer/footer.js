import React from "react";
import { Row, Col } from "antd";

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
        <Col span={20}>
          Modern Sumerian
          <br />
          <span style={{ fontSize: "1.5rem" }}>
            {"\u{12174}\u{120A0}\u{12313}\u{12228}\u{12000}"}
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
