import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Skeleton,
  Checkbox,
  Tooltip,
  Icon,
  Empty,
  Pagination
} from "antd";
import firebase from "firebase/app";
import "firebase/firestore";

import styles from "./dictionary.module.scss";
import firebaseConfig from "../../config";

firebase.initializeApp(firebaseConfig);

const { Title, Text } = Typography;

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();

const Dictionary = () => {
  const [orderByInstances, setOrderByInstances] = useState(false);
  const [exactSearch, setExactSearch] = useState(false);
  const [loadingSearch_su, setLoadingSearch_su] = useState(false);
  const [loadingSearch_en, setLoadingSearch_en] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [displayResults, setDisplayResults] = useState([]);
  const [orderedResults, setOrderedResults] = useState(0);
  const [currentDictPage, setCurrentDictPage] = useState(1);

  const fetchData = async (lang, word) => {
    if (lang && word) {
      // resets results pagination
      setOrderedResults(0);
      // sets values according to language
      let docName, dictionaryIndex, collection;
      if (lang === "sumerian") {
        // sets loading button
        setLoadingSearch_su(true);
        // checks if user hasn't already searched the same dictionary
        docName = `sumerian-english-dictionary-${word[0].toUpperCase()}`;
        collection = "sumerian_english_dictionary";
      } else if (lang === "english") {
        // sets loading button
        setLoadingSearch_en(true);
        // checks if user hasn't already searched the same dictionary
        docName = `english-sumerian-dictionary-${word[0].toUpperCase()}`;
        collection = "english_sumerian_dictionary";
      }

      dictionaryIndex = searchResults.findIndex(dict => dict.name === docName);
      if (dictionaryIndex !== -1) {
        // if dictionary has been already loaded
        processData(searchResults[dictionaryIndex].data, word);
      } else {
        // fetches results
        const doc = await db
          .collection(collection)
          .doc(docName)
          .get();
        if (doc.exists) {
          // saves dictionary for later look-up
          setSearchResults([
            ...searchResults,
            { name: docName, data: doc.data() }
          ]);
          processData(doc.data(), word);
        } else {
          console.log("No results");
        }
      }
      setLoadingSearch_su(false);
      setLoadingSearch_en(false);
    }
  };

  const processData = (data, word) => {
    // processes results
    const results = Object.keys(data)
      .filter(entry => {
        if (exactSearch) {
          // if exact search is requested
          return entry === word;
        }

        return entry.indexOf(word) !== -1;
      })
      .map(entry => data[entry])
      .flat()
      .sort((a, b) => {
        // order by instances if required
        if (orderByInstances) {
          return b.instances - a.instances;
        }

        return 0;
      })
      .map(item => (
        // builds individual card for words
        <Card
          hoverable
          cover={
            <img
              src={`http://psd.museum.upenn.edu/epsd/psl/img/popup/${
                item.images[0]
              }`}
              alt="cuneiform"
              className={styles.cuneiformWord}
            />
          }
          key={item.reference}
          className={styles.displayWord}
        >
          <Tooltip title="Link to the ePSD" placement="right">
            <Text strong>
              <a
                href={`http://psd.museum.upenn.edu/epsd/${item.reference}.html`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit" }}
              >
                {item.sumerian.toUpperCase().replace("Š", "SH")}
              </a>
            </Text>
          </Tooltip>
          <br />
          <br />
          <Text>[{item.generalMeaning.toLowerCase()}]</Text>
          <br />
          <br />
          <Text>{item.meanings.join(", ")}</Text>
          <br />
          <br />
          <Text type="secondary">
            {item.instances === 0
              ? "No instance"
              : item.instances === 1
              ? `${item.instances} instance`
              : `${item.instances} instances`}
          </Text>
          <br />
          <br />
          <Text disabled>reference: {item.reference}</Text>
        </Card>
      ));
    // saves cards
    setDisplayResults(results);
  };

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
            <img
              src="images/undraw_search_2dfv.svg"
              alt="search"
              className={styles.cardPicture}
            />
          </Col>
        </Row>
        <hr />
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <label htmlFor="search_sumerian">In Sumerian :</label>
            <br />
            <br />
            <Input.Search
              id="search_sumerian"
              placeholder="Search word in Sumerian"
              onSearch={value => fetchData("sumerian", value.trim())}
              enterButton={
                loadingSearch_su ? (
                  <Icon type="loading" />
                ) : (
                  <Icon type="search" />
                )
              }
            />
          </Col>
          <Col xs={24} sm={12}>
            <label htmlFor="search_english">In English :</label>
            <br />
            <br />
            <Input.Search
              id="search_english"
              placeholder="Search word in English"
              onSearch={value => {
                fetchData("english", value.trim());
                // resets pagination
                setCurrentDictPage(1);
              }}
              enterButton={
                loadingSearch_en ? (
                  <Icon type="loading" />
                ) : (
                  <Icon type="search" />
                )
              }
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
              onChange={checkedValues => {
                // exact search
                if (checkedValues.includes("exact_search")) {
                  setExactSearch(true);
                } else {
                  setExactSearch(false);
                }
                // order by instances
                if (checkedValues.includes("order_by_instances")) {
                  setOrderByInstances(true);
                } else {
                  setOrderByInstances(false);
                }
              }}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: "15px" }}>
          <Col span={24}>
            {displayResults.length > 0 ? (
              <div className={styles.displayResults}>
                <Row gutter={16}>
                  <Col xs={24} sm={8}>
                    {displayResults[orderedResults]}
                  </Col>
                  <Col xs={24} sm={8}>
                    {displayResults[orderedResults + 1]}
                  </Col>
                  <Col xs={24} sm={8}>
                    {displayResults[orderedResults + 2]}
                  </Col>
                </Row>
                <br />
                <Pagination
                  size="small"
                  current={currentDictPage}
                  total={displayResults.length}
                  showTotal={total => `Total ${total} results`}
                  defaultPageSize={3}
                  className={styles.pagination}
                  onChange={(page, pageSize) => {
                    setOrderedResults((page - 1) * 3);
                    setCurrentDictPage(page);
                  }}
                />
              </div>
            ) : loadingSearch_su || loadingSearch_en ? (
              <Skeleton active />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dictionary;
