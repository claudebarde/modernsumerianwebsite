import React from "react";
import { Row, Col, Table, Typography } from "antd";

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

const output = (entry, i, border) => (
  <div
    key={entry.sumerian + i}
    className={styles[border]}
    id={`ref${entry.reference}`}
  >
    <Row>
      <Col span={12} className={styles.column}>
        <Row>
          <Col span={12}>
            <Title level={4}>
              <a
                href={`http://oracc.museum.upenn.edu/epsd2/cbd/sux/sux.x${
                  entry.reference
                }.html`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.sumerian.toUpperCase()}
              </a>
            </Title>
          </Col>
          <Col span={12}>
            <Text>{entry.generalMeaning.toUpperCase()}</Text>
          </Col>
        </Row>
      </Col>
      <Col span={12} className={styles.column}>
        <Row className={styles.row}>
          <Col span={12}>
            <Text strong>Category:</Text>
          </Col>
          <Col span={12}>
            <Text strong>{formatCategory(entry.category)}</Text>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col span={12} className={styles.column}>
        <Table
          dataSource={entry.cuneiforms.map((item, i) => ({
            ...item,
            key: item.value + i
          }))}
          columns={[
            {
              title: "Cuneiforms",
              dataIndex: "cuneiforms",
              key: "cuneiforms",
              render: value => {
                if (value === "none") return "--";

                return <span className={styles.cuneiforms}>{value}</span>;
              }
            },
            {
              title: "Value",
              dataIndex: "value",
              key: "value"
            }
          ]}
          size="small"
          pagination={false}
        />
      </Col>
      <Col span={12} className={styles.column}>
        <Table
          dataSource={entry.meanings.map((item, i) => ({
            ...item,
            key: item.value + item.instances + i
          }))}
          columns={[
            {
              title: "Meaning",
              dataIndex: "value",
              key: "value",
              render: value => {
                if (!value) return "--";

                return value;
              }
            },
            {
              title: "Instances",
              dataIndex: "instances",
              key: "instances"
            }
          ]}
          size="small"
          pagination={false}
        />
      </Col>
    </Row>
  </div>
);

const EntriesList = ({ entries, options }) => {
  return entries.map((entry, i) => {
    if (parseInt(entry.instances) > 50) {
      return output(entry, i, "greenborder");
    } else {
      return output(entry, i, "noborder");
    }
  });
};

export default EntriesList;
