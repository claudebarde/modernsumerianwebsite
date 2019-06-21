import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Typography } from "antd";

import styles from "./Overview.module.scss";

const { Title } = Typography;

const Overview = () => {
  return (
    <div className={`${styles.main} sections`} id="overviewSection">
      <Row
        type="flex"
        justify="space-around"
        style={{ width: "100%", padding: "0px 40px" }}
      >
        <Col sm={24} md={8} className={styles.column}>
          <Link to="/dictionary">
            <Card
              hoverable
              cover={
                <img
                  alt="dictionary"
                  src="images/undraw_search_2dfv.svg"
                  className={styles.overviewCardImage}
                />
              }
              className={styles.overviewCard}
            >
              <Title level={4}>The dictionary</Title>
              <p>
                Over 6,000 entries based on the ePSD and an easy way to look for
                words in Sumerian and in English.
              </p>
            </Card>
          </Link>
        </Col>
        <Col sm={24} md={8} className={styles.column}>
          <Link to="/conjugator">
            <Card
              hoverable
              cover={
                <img
                  alt="conjugator"
                  src="images/undraw_artificial_intelligence_upfn.svg"
                  className={styles.overviewCardImage}
                />
              }
              className={styles.overviewCard}
            >
              <Title level={4}>The conjugator</Title>
              <p>
                Do not fear Sumerian verbs anymore with an easy-to-use and
                straightforward verb conjugator.
              </p>
            </Card>
          </Link>
        </Col>
        <Col sm={24} md={8} className={styles.column}>
          <Link to="/games">
            <Card
              hoverable
              cover={
                <img
                  alt="games"
                  src="images/undraw_old_day_6x25.svg"
                  className={styles.overviewCardImage}
                />
              }
              className={styles.overviewCard}
            >
              <Title level={4}>The games</Title>
              <p>
                Take a quiz or play a game of flashcards to learn or to review
                Sumerian cuneiforms in a fun way.
              </p>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
