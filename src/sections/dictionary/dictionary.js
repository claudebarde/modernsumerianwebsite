import React from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Skeleton,
  Checkbox,
  Tooltip
} from "antd";

import styles from "./dictionary.module.scss";

const { Title } = Typography;

const Dictionary = () => {
  return (
    <div className={`${styles.main} sections`} id="dictionarySection">
      <Card className={styles.dictionary}>
        <Row>
          <Col span={18}>
            <Title level={3}>Dictionary</Title>
            <Title level={4}>
              <Tooltip title="ab-inim-inima">
                <span>
                  {"\u{1200A}"}
                  {"\u{12157}"}
                  {"\u{12157}"}
                  {"\u{12000}"}
                </span>
              </Tooltip>
            </Title>
          </Col>
          <Col span={6}>
            <img src="images/undraw_search_2dfv.svg" alt="search" />
          </Col>
        </Row>
        <hr />
        <Row gutter={24}>
          <Col span={12}>
            <label htmlFor="search_sumerian">In Sumerian :</label>
            <br />
            <br />
            <Input.Search
              id="search_sumerian"
              placeholder="Search word in Sumerian"
              onSearch={value => console.log(value)}
              enterButton
            />
          </Col>
          <Col span={12}>
            <label htmlFor="search_english">In English :</label>
            <br />
            <br />
            <Input.Search
              id="search_english"
              placeholder="Search word in English"
              onSearch={value => console.log(value)}
              enterButton
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: "15px" }} type="flex" justify="end">
          <Col span={23}>
            <Checkbox.Group
              options={[
                {
                  label: "Order by instances",
                  value: "order_by_instances"
                },
                { label: "Exact Search", value: "exact_search" }
              ]}
              defaultValue={["Apple"]}
              onChange={checkedValues => console.log(checkedValues)}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: "15px" }}>
          <Col span={24}>
            <p>Results</p>
            <Skeleton active />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dictionary;
