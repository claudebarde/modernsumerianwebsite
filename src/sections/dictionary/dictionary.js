import React, { useState, useEffect } from "react";
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
  Alert,
  message
} from "antd";
import firebase from "firebase/app";
import "firebase/storage";
//import "firebase/firebase-functions";

import styles from "./dictionary.module.scss";
import firebaseConfig from "../../config";

import EntriesList from "./EntriesList";

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const { Title } = Typography;

const Dictionary = () => {
  const [orderByInstances, setOrderByInstances] = useState(false);
  const [exactSearch, setExactSearch] = useState(false);
  const [loadingSearch_su, setLoadingSearch_su] = useState(false);
  const [loadingSearch_en, setLoadingSearch_en] = useState(false);
  const [languageInput, setLanguageInput] = useState(undefined);
  const [searchInput, setSearchInput] = useState(undefined);
  const [searchResults, setSearchResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState([]);
  const [dictionaryReferences, setDictionaryReferences] = useState(undefined);
  const [windowWidth, saveWindowWidth] = useState(undefined);

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

  const fetchData = async (lang, word) => {
    if (lang && word && word.trim() !== searchInput) {
      setExactSearch(false);
      setOrderByInstances(false);
      // set language
      setLanguageInput(lang);
      setSearchInput(word.trim());
      // resets search data
      setSearchResults([]);
      setDisplayedResults([]);
      // finds references
      let refsToFetch = [];
      if (lang === "sumerian") {
        // format word
        word = word
          .replace(/sh/g, "š")
          .replace(/ĝ/g, "ŋ")
          .replace(/h/g, "ḫ");
        setLoadingSearch_su(true);
        refsToFetch = dictionaryReferences
          .filter(item => item[1].toString().includes(word))
          .map(item => item[2]);
      } else if (lang === "english") {
        setLoadingSearch_en(true);
        refsToFetch = dictionaryReferences
          .filter(item => item[0].toString().includes(word))
          .map(item => item[2]);
      }
      try {
        // fetches results from firestore
        const fetchWordsInDictionary = firebase
          .functions()
          .httpsCallable("fetchWordsInDictionary");
        const t0 = performance.now();
        const results = await fetchWordsInDictionary(refsToFetch);
        const t1 = performance.now();
        console.log("performance:", t1 - t0);
        // when we get the results
        let newResults = results.data;
        if (Array.isArray(newResults) && newResults.length > 0) {
          newResults = newResults.map(result => ({
            ...result,
            sumerian: formatCharacters(result.s),
            cuneiforms: result.c.map(item => ({
              ...item,
              value: formatCharacters(item.v)
            }))
          }));
          newResults.sort((a, b) => (a.s > b.s ? 1 : -1));
          console.log(newResults);
          setSearchResults(newResults);
          setDisplayedResults(newResults);
        } else {
          setSearchResults(undefined);
          setDisplayedResults(undefined);
        }
      } catch (error) {
        message.error("Unable to search dictionary");
      }
      setLoadingSearch_su(false);
      setLoadingSearch_en(false);
    }
  };

  const resultsTable = results => {
    // empty row
    let row = [];
    // final grid
    const grid = [];
    // number of elements per row depends on viewport width
    let numberOfCols = 4;
    if (windowWidth && windowWidth >= 667) {
      numberOfCols = 12;
    }
    // we loop through the results to organize them in a table-like grid
    results.forEach((result, index) => {
      if (index % numberOfCols === 0 && index !== 0) {
        // new row
        grid.push(
          <Row key={result + index} className={styles.resultsTableRow}>
            {row}
          </Row>
        );
        row = [];
        // we push elements into new row
        row.push(
          <Col
            xs={6}
            sm={2}
            key={result + index}
            className={styles.resultsTableCol}
          >
            <a href={`#ref${result.r}`}>{result.s}</a>
          </Col>
        );
      } else {
        // we push elements into new row
        row.push(
          <Col
            xs={6}
            sm={2}
            key={result + index}
            className={styles.resultsTableCol}
          >
            <a href={`#ref${result.r}`}>{result.s}</a>
          </Col>
        );
      }
    });
    // leftovers
    if (row.length > 0) {
      grid.push(
        <Row key="last-row" className={styles.resultsTableRow}>
          {row}
        </Row>
      );
    }

    return grid;
  };

  const orderSearchResults = checkedValues => {
    if (checkedValues.length === 0) {
      // default alphabetical order
      setExactSearch(false);
      setOrderByInstances(false);
      setDisplayedResults(searchResults);
    } else if (
      checkedValues.includes("order_by_instances") &&
      !checkedValues.includes("exact_search")
    ) {
      // only order by instances
      setExactSearch(false);
      setOrderByInstances(true);
      const newResults = [...searchResults];
      newResults.sort((a, b) => (parseInt(a.i) < parseInt(b.i) ? 1 : -1));
      setDisplayedResults(newResults);
    } else if (
      !checkedValues.includes("order_by_instances") &&
      checkedValues.includes("exact_search")
    ) {
      // only exact search
      setExactSearch(true);
      setOrderByInstances(false);
      let newResults = [...searchResults];
      if (languageInput === "sumerian") {
        newResults = newResults.filter(result => result.s === searchInput);
      } else if (languageInput === "english") {
        newResults = newResults.filter(result => result.gm === searchInput);
      }
      setDisplayedResults(newResults);
    } else if (
      checkedValues.includes("order_by_instances") &&
      checkedValues.includes("exact_search")
    ) {
      // order by instances and exact search
      setExactSearch(true);
      setOrderByInstances(true);
      let newResults = [...searchResults];
      if (languageInput === "sumerian") {
        newResults = newResults.filter(
          result => result.searchResults === searchInput
        );
      } else if (languageInput === "english") {
        newResults = newResults.filter(result => result.gm === searchInput);
      }
      newResults.sort((a, b) => (parseInt(a.i) < parseInt(b.i) ? 1 : -1));
      setDisplayedResults(newResults);
    }
  };

  useEffect(() => {
    saveWindowWidth(window.innerWidth);
    (async () => {
      if (window.sessionStorage) {
        const references = window.sessionStorage.getItem(
          "dictionaryReferences"
        );
        if (references) {
          setDictionaryReferences(JSON.parse(references));
        } else {
          const dictionaryRef = storage.refFromURL(
            "gs://modernsumerian.appspot.com/references.json"
          );
          const url = await dictionaryRef.getDownloadURL();
          const references = await fetch(url);
          const referencesJson = await references.json();
          if (Array.isArray(referencesJson)) {
            setDictionaryReferences(referencesJson);
            window.sessionStorage.setItem(
              "dictionaryReferences",
              JSON.stringify(referencesJson)
            );
          } else {
            setDictionaryReferences(null);
          }
        }
      } else {
        message.error("Your device does not support session storage!");
      }
    })();
  }, []);

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
        {dictionaryReferences === undefined && (
          <Alert
            message={
              <div>
                Downloading Dictionary References, please wait{" "}
                <Icon type="sync" style={{ marginLeft: "10px" }} spin />
              </div>
            }
            type="info"
            style={{ width: "40%", margin: "0 auto" }}
            showIcon
          />
        )}
        {dictionaryReferences === null && (
          <Alert
            message="An error has occurred, please refresh the page"
            type="error"
            style={{ width: "40%", margin: "0 auto" }}
            showIcon
          />
        )}
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
        {displayedResults && displayedResults.length > 0 && (
          <Row style={{ paddingTop: "15px" }} type="flex" justify="center">
            <Col xs={16} sm={8}>
              <Checkbox.Group
                options={[
                  {
                    label: "Order by instances",
                    value: "order_by_instances"
                  },
                  { label: "Exact Search", value: "exact_search" }
                ]}
                onChange={checkedValues => orderSearchResults(checkedValues)}
                value={[
                  exactSearch ? "exact_search" : "",
                  orderByInstances ? "order_by_instances" : ""
                ]}
              />
            </Col>
          </Row>
        )}
        <Row style={{ paddingTop: "15px" }}>
          <Col span={24}>
            {displayedResults && displayedResults.length > 0 ? (
              <>
                <Title level={4} style={{ textAlign: "center" }}>{`${
                  displayedResults.length
                } results`}</Title>
                <div className={styles.resultsTable}>
                  {resultsTable(displayedResults)}
                </div>
                <EntriesList
                  entries={displayedResults}
                  options={{}}
                  search={{ lang: languageInput, word: searchInput }}
                />
              </>
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
