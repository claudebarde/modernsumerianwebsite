import React from "react";
import TextLoop from "react-text-loop";
import { Row, Col, List, Avatar, Typography } from "antd";

import { SYLLABARY } from "../resources/syllabary/syllabaryData";

import styles from "./footer.module.scss";

const { Text, Paragraph } = Typography;

// "\u{12174}\u{120A0}\u{12313}\u{12228}\u{122F0}\u{12000}"

const Footer = () => {
  const updates = [
    { date: "Jul 14, 2019", text: "Big update of the conjugator!" },
    { date: "Jul 1, 2019", text: "New footer with links and support" },
    { date: "Jun 20, 2019", text: "New quiz game" },
    { date: "Jun 18, 2019", text: "New flashcard game" },
    { date: "Jun 12, 2019", text: "New website!" }
  ];

  return (
    <div className={styles.main} id="footerSection">
      <Row type="flex" justify="center" align="top" style={{ height: "100%" }}>
        <Col xs={24} sm={6} className={styles.footerTitle}>
          <div>
            <Text strong>© 2019 Modern Sumerian</Text>
            <br />
            <span style={{ fontSize: "1.5rem" }}>
              {"\u{12174}\u{120A0}\u{12313}\u{12228}\u{12000}"}
            </span>
          </div>
          <br />
          <br />
          <div style={{ width: "100%", textAlign: "left" }}>
            <Text strong>Last updates:</Text>
            <br />
            <TextLoop mask={true} style={{ width: "100%" }}>
              {updates.map((update, i) => (
                <div key={`update-${i}`}>
                  <Text>{update.text}</Text>
                  <br />
                  <Text disabled>{update.date}</Text>
                </div>
              ))}
            </TextLoop>
          </div>
        </Col>
        <Col xs={24} sm={6} className={styles.footerCol}>
          <List
            size="small"
            bordered={false}
            header={<Text strong>Useful Links</Text>}
            dataSource={[
              <a
                href="https://www.facebook.com/ModernSumerian/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                > Facebook Group
              </a>,
              <a
                href="https://www.memrise.com/course/776887/modern-sumerian/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                > Lectures
              </a>,
              <a
                href="http://users.teilar.gr/~g1951d/Akkadian.zip"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                > Cuneiforms
              </a>,
              <a
                href="http://psd.museum.upenn.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                > ePSD
              </a>,
              <a
                href="mailto:emegir.umee@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                > Contact us
              </a>
            ]}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
        <Col xs={24} sm={12} className={styles.footerCol}>
          <div>
            <List
              size="small"
              bordered={false}
              header={
                <Text strong>
                  If you like this project, feel free to support it!
                </Text>
              }
              dataSource={[
                {
                  title: (
                    <div>
                      <span className={styles.footerCuneiform}>
                        {`\u{1225A}${SYLLABARY["A"]}${SYLLABARY["SHI"]}${
                          SYLLABARY["IB"]
                        }`}
                      </span>{" "}
                      <span className={styles.footerCuneiform}>
                        {`${SYLLABARY["GA"]}${SYLLABARY["HU"]}${
                          SYLLABARY["A"]
                        } !`}
                      </span>
                      Buy me a coffee!
                    </div>
                  ),
                  description: (
                    <a
                      href="https://www.buymeacoffee.com/8jJNf1zyp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.footerLink}
                    >
                      buymeacoffee.com/8jJNf1zyp
                    </a>
                  ),
                  image: "images/coffee.png"
                },
                {
                  title: "Bitcoin",
                  description: (
                    <Paragraph copyable className={styles.cryptoAddress}>
                      1F3cwLKsxeRkSp4LBLppfhFvmXssiioKUi
                    </Paragraph>
                  ),
                  image: "images/btc.png"
                },
                {
                  title: "Ethereum",
                  description: (
                    <Paragraph copyable className={styles.cryptoAddress}>
                      0x9EA34bcbc7F0B4F64a97A221Ca717cF0011db650
                    </Paragraph>
                  ),
                  image: "images/eth.png"
                }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
        {/*<Col xs={11} sm={8}>
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
        </Col>*/}
      </Row>
    </div>
  );
};

export default Footer;
