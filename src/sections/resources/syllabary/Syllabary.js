import React from "react";
import { Card, Table, Row, Col, Tooltip, Icon, Modal } from "antd";

import styles from "./Syllabary.module.scss";

import { syllabaryData } from "./syllabaryData";

const Syllabary = () => {
  const formatDataInCell = data => {
    let cuneiform;
    if (Array.isArray(data)) {
      switch (data[1]) {
        case "none":
          cuneiform = <Icon type="question-circle" />;
          break;
        case "comment":
          cuneiform = (
            <Tooltip title={data[2]} placement="bottom">
              <span style={{ color: "#1890ff" }}>{data[0]}</span>
            </Tooltip>
          );
          break;
        case "creation":
          cuneiform = (
            <Tooltip title="created from similar cuneiform" placement="bottom">
              <span style={{ color: "#fa541c" }}>{data[0]}</span>
            </Tooltip>
          );
          break;
        case "proposal":
          cuneiform = (
            <Tooltip
              title={`proposed instead of ${data[0]}`}
              placement="bottom"
              onClick={() => {
                Modal.info({
                  title: "New cuneiform proposal",
                  content: (
                    <div>
                      <p className={styles.cuneiform}>{`${data[2]} replaces ${
                        data[0]
                      }`}</p>
                    </div>
                  ),
                  onOk() {}
                });
              }}
            >
              <span style={{ color: "#52c41a" }}>{data[2]}</span>
            </Tooltip>
          );
          break;
        default:
          cuneiform = <Icon type="question-circle" />;
      }
    } else {
      if (data === "none") {
        cuneiform = <Icon type="question-circle" />;
      } else {
        cuneiform = data;
      }
    }

    return cuneiform;
  };

  const formatCellValue = value => (
    <Row>
      <Col span={12}>
        <div className={styles.phonetic}>{value[0]}</div>
        <div className={styles.cuneiform}>{formatDataInCell(value[1])}</div>
      </Col>
      <Col span={12}>
        <div className={styles.phonetic}>{value[2]}</div>
        <div className={styles.cuneiform}>{formatDataInCell(value[3])}</div>
      </Col>
    </Row>
  );

  const columns = [
    {
      title: "Consonant",
      dataIndex: "consonant",
      key: "consonant",
      className: styles.consonantCell,
      render: value => <strong>{value}</strong>
    },
    {
      title: (
        <span>
          A <span className={styles.cuneiform}>{`\u{12000}`}</span>
        </span>
      ),
      dataIndex: "a",
      key: "a",
      align: "center",
      render: value => formatCellValue(value)
    },
    {
      title: (
        <span>
          E <span className={styles.cuneiform}>{`\u{1208A}`}</span>
        </span>
      ),
      dataIndex: "e",
      key: "e",
      align: "center",
      render: value => formatCellValue(value)
    },
    {
      title: (
        <span>
          I <span className={styles.cuneiform}>{`\u{1213F}`}</span>
        </span>
      ),
      dataIndex: "i",
      key: "i",
      align: "center",
      render: value => formatCellValue(value)
    },
    {
      title: (
        <span>
          U <span className={styles.cuneiform}>{`\u{1230B}`}</span>
        </span>
      ),
      dataIndex: "u",
      key: "u",
      align: "center",
      render: value => formatCellValue(value)
    }
  ];

  return (
    <Card className={styles.syllabary}>
      <Table
        dataSource={syllabaryData}
        columns={columns}
        pagination={false}
        title={() => "Sumerian syllabary"}
      />
    </Card>
  );
};

export default Syllabary;
