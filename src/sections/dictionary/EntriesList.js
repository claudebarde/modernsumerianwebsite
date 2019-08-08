import React from "react";
import { Row, Col, Table, Typography } from "antd";
import reactStringReplace from "react-string-replace";

import styles from "./entrieslist.module.scss";

const { Title, Text } = Typography;

const formatCategory = category => {
  let format = "";
  switch (category) {
    case "DN":
      format = "DN";
      break;
    case "AJ":
      format = "AJ";
      break;
    case "N":
      format = "Noun";
      break;
    case "V/t":
      format = "Transitive verb";
      break;
    case "V/i":
      format = "Intransitive verb";
      break;
    case "PN":
      format = "Plural noun";
      break;
    case "Nu":
      format = "Number";
      break;
    default:
      format = category;
  }

  return format;
};

const formatCharacters = word =>
  word
    .toLowerCase()
    .replace(/š/g, "sh")
    .replace(/ŋ/g, "ĝ")
    .replace(/ḫ/g, "h")
    .replace(/ṭ/g, "t")
    .replace(/\./g, "")
    .replace(/₂|₃|₄|ₓ/g, "")
    .replace(/[0-9]/g, "");

const output = ({ entry, index, border, search }) => (
  <div
    key={entry.sumerian + index}
    className={styles[border]}
    id={`ref${entry.reference}`}
  >
    <Row>
      <Col xs={24} span={14} className={styles.column}>
        <Row>
          <Col span={12}>
            <Title level={4}>
              <a
                href={`http://oracc.museum.upenn.edu/epsd2/cbd/sux/sux.x${
                  entry.r
                }.html`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatCharacters(entry.s).toUpperCase()}
              </a>
            </Title>
          </Col>
          <Col span={12}>
            <Text>{entry.gm.toUpperCase()}</Text>
          </Col>
        </Row>
      </Col>
      <Col xs={24} span={10} className={styles.column}>
        <Row className={styles.row}>
          <Col span={12}>
            <Text strong>Category:</Text>
          </Col>
          <Col span={12}>
            <Text strong>{formatCategory(entry.ca)}</Text>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col xs={24} sm={14} className={styles.column}>
        <Table
          dataSource={entry.c.map((item, i) => ({
            ...item,
            key: item.v + i
          }))}
          columns={[
            {
              title: "Cuneiforms",
              dataIndex: "c",
              key: "cuneiforms",
              render: value => {
                if (value === "none") return "--";

                return <span className={styles.cuneiforms}>{value}</span>;
              }
            },
            {
              title: "Value",
              dataIndex: "v",
              key: "value",
              render: value => formatCharacters(value)
            },
            {
              title: "Instances",
              dataIndex: "i",
              key: "instances"
            }
          ]}
          size="middle"
          pagination={false}
        />
      </Col>
      <Col xs={24} sm={10} className={styles.column}>
        <Table
          dataSource={entry.m.map((item, i) => ({
            ...item,
            key: item.v + item.i.toString() + i
          }))}
          columns={[
            {
              title: "Meaning",
              dataIndex: "v",
              key: "meaning",
              render: value => {
                if (!value) return "--";

                if (search.lang === "english") {
                  return reactStringReplace(value, search.word, (match, i) => (
                    <Text mark>{match}</Text>
                  )).map((el, i) => <span key={i}>{el}</span>);
                }

                return value;
              }
            },
            {
              title: "Instances",
              dataIndex: "i",
              key: "instances"
            }
          ]}
          size="middle"
          pagination={false}
        />
      </Col>
    </Row>
  </div>
);

const EntriesList = ({ entries, options, search }) => {
  return entries.map((entry, index) => {
    if (parseInt(entry.i) > 50) {
      return output({ entry, index, border: "greenborder", search });
    } else {
      return output({ entry, index, border: "noborder", search });
    }
  });
};

export default EntriesList;
