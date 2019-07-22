import React from "react";
import { Typography, Row, Col } from "antd";

import Roadmap from "../roadmap/Roadmap";
import Overview from "../overview/Overview";

import styles from "./landing.module.scss";

const { Title, Text } = Typography;

const Landing = () => {
  return (
    <>
      <div className={`${styles.main} sections`} id="landingSection">
        <div className={styles.description}>
          <Row type="flex" justify="space-around" align="middle">
            <Col span={12}>
              <img
                src="/images/emegir-umee.png"
                alt="emegir-umee"
                className={styles.landingPicture}
              />
            </Col>
            <Col span={12}>
              <Title>Modern Sumerian</Title>
              <Title level={3}>
                A language of the past <br />
                for the world of today
              </Title>
              <br />
              <Text>
                Sumerian is the oldest written language known so far. Thanks to
                various sources, linguists have successfully reconstructed this
                language and we have now a good understanding of its grammar and
                its vocabulary. Making a usable language out of a language that
                hasn't been spoken in 4.000 years is a challenge, but also a
                great tribute.
                <br />
                <br />
                That is the goal of the "Modern Sumerian" project. We try to
                stay as close as possible to the original Sumerian language
                while adapting it to the modern world. With tools specially
                created for this task and a lot of passion, this is an
                achievable goal !
              </Text>
            </Col>
          </Row>
        </div>
      </div>
      <div
        className={`${styles.mainMobile} sections`}
        id="landingSectionMobile"
      >
        <Title level={2}>Modern Sumerian</Title>
        <Title level={4}>
          A language of the past <br />
          for the world of today
        </Title>
        <br />
        <img
          src="/images/emegir-umee.png"
          alt="emegir-umee"
          className={styles.landingPicture}
        />
        <br />
        <Text>
          Sumerian is the oldest written language known so far. Thanks to
          various sources, linguists have successfully reconstructed this
          language and we have now a good understanding of its grammar and its
          vocabulary. Making a usable language out of a language that hasn't
          been spoken in 4.000 years is a challenge, but also a great tribute.
          <br />
          <br />
          That is the goal of the "Modern Sumerian" project. We try to stay as
          close as possible to the original Sumerian language while adapting it
          to the modern world. With tools specially created for this task and a
          lot of passion, this is an achievable goal !
        </Text>
      </div>
      <Overview />
      <Roadmap />
    </>
  );
};

export default Landing;
