import React from "react";
import { Card, Row, Col, Typography, Steps } from "antd";

import styles from "./roadmap.module.scss";

const { Title } = Typography;
const { Step } = Steps;

const Roadmap = () => {
  return (
    <div className={`${styles.main} sections`} id="roadmapSection">
      <Card className={styles.steps}>
        <Title level={3}>Roadmap</Title>
        <Row>
          <Col span={12} offset={6}>
            <Steps direction="vertical" current={0}>
              <Step
                title="New website"
                description="Further tests must be run on the new dictionary and the new verb conjugator."
              />
              <Step
                title="Syllabary"
                description="New section with the syllabary used for Modern Sumerian."
              />
              <Step
                title="Unicode Cuneiforms"
                description="Addition of Unicode cuneiforms in dictionary (that will probably take a while)."
              />
              <Step
                title="Verb Conjugator with Cuneiforms"
                description="Rendition of verb chains in cuneiforms."
              />
              <Step
                title="Modern Sumerian Lectures"
                description="New lectures hosted on the dedicated website."
              />
            </Steps>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Roadmap;
