import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col, Affix, Modal, Button, Input } from "antd";

import styles from "./Help.module.scss";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const db = firebase.firestore();
const INDEXES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];

const { Title, Text } = Typography;

const Help = () => {
  const [ePSDelement, setePSDelement] = useState(undefined);
  const [firstEPSDelement, setFirstEPSDelement] = useState(undefined);
  const [alreadySaved, setAlreadySaved] = useState([]);
  const [freshData, setFreshData] = useState([]);
  const [loadingFreshData, setLoadingFreshData] = useState(false);
  const [contributor, setContributor] = useState("");

  const showConfirm = el => {
    if (ePSDelement) {
      const unicode = el.codePointAt(0).toString(16);
      let elementToSend = {
        ...ePSDelement,
        unicode: unicode.toUpperCase(),
        timestamp: Date.now(),
        contributor
      };

      Modal.confirm({
        title: "Do you want to validate this match?",
        content: (
          <div>
            Does{" "}
            <img
              src={`http://psd.museum.upenn.edu/epsd/psl/img/popup/${
                ePSDelement.images[0]
              }`}
              alt="cuneiform"
              className={styles.confirmImage}
            />{" "}
            contain{" "}
            {firstEPSDelement ? (
              <>
                <span className={styles.cuneiform}>
                  {String.fromCodePoint(`0x${firstEPSDelement.unicode}`)}
                </span>
                <span className={styles.cuneiform}>
                  {String.fromCodePoint(`0x${unicode}`)}
                </span>
              </>
            ) : (
              <span className={styles.cuneiform}>
                {String.fromCodePoint(`0x${unicode}`)}
              </span>
            )}{" "}
            ?
          </div>
        ),
        cancelText: firstEPSDelement ? "Cancel" : "Add a second cuneiform",
        async onOk() {
          let newEntry = {};
          if (firstEPSDelement) {
            newEntry = {
              firstElement: firstEPSDelement,
              secondElement: elementToSend
            };
          } else {
            newEntry = { ...elementToSend };
          }
          try {
            // we save the new entry
            await db.collection("sumerian_help").add(newEntry);
            // we display a new entry
            await fetchCuneiformImage();
            // we delete an evental first element
            setFirstEPSDelement(undefined);
          } catch (err) {
            console.log(err);
            setFirstEPSDelement(undefined);
          }
        },
        onCancel() {
          if (firstEPSDelement) {
            setFirstEPSDelement(undefined);
          } else {
            setFirstEPSDelement(elementToSend);
          }
        }
      });
    }
  };

  const unicodeTable = () => {
    const results = [];
    const start = parseInt(12000, 16);
    const end = parseInt(12399, 16);
    const rowOfCuneiforms = [];
    const savedCuneiforms = alreadySaved.map(item =>
      String.fromCodePoint(`0x${item.unicode.toString(16)}`)
    );
    // we loop through all the Unicode blocks for cuneiforms
    for (let i = start; i <= end; i++) {
      //console.log(String.fromCodePoint(`0x${i.toString(16)}`));
      if (rowOfCuneiforms.length < 4) {
        rowOfCuneiforms.push(String.fromCodePoint(`0x${i.toString(16)}`));
      } else {
        results.push(
          <Row key={`row${results.length}`} type="flex" justify="center">
            {rowOfCuneiforms.map((el, index) => (
              <Col
                key={`row${results.length}-col${index}`}
                xs={12}
                sm={4}
                className={styles.cuneiformCol}
                onClick={() => showConfirm(el)}
                style={savedCuneiforms.includes(el) ? { color: "#73d13d" } : {}}
              >
                {el}
              </Col>
            ))}
          </Row>
        );
        // we empty the array
        rowOfCuneiforms.length = 0;
      }
    }
    // we check if there are elements left in array
    if (rowOfCuneiforms.length !== 0) {
      results.push(
        <Row key={`row${results.length}`} type="flex" justify="center">
          {rowOfCuneiforms.map((el, index) => (
            <Col
              key={`row${results.length}-col${index}`}
              xs={12}
              sm={4}
              className={styles.cuneiformCol}
              onClick={() => showConfirm(el)}
            >
              {el}
            </Col>
          ))}
        </Row>
      );
      // we empty the array
      rowOfCuneiforms.length = 0;
    }

    return results;
  };

  const fetchCuneiformImage = async () => {
    setLoadingFreshData(true);
    // downloads main dictionary
    let newData = [];
    const dataInSessionStorage = window.sessionStorage.getItem(
      "helpForDictionary"
    );
    if (
      window.sessionStorage &&
      dataInSessionStorage &&
      JSON.parse(dataInSessionStorage).length > 0
    ) {
      newData = JSON.parse(dataInSessionStorage);
    } else {
      const rand = INDEXES[Math.floor(Math.random() * INDEXES.length)];
      const doc = await db
        .collection("english_sumerian_dictionary")
        .doc(`english-sumerian-dictionary-${rand}`)
        .get();
      if (doc.exists) {
        // saves data from dictionary
        Object.keys(doc.data()).forEach(english => {
          newData.push(doc.data()[english]);
        });
      }
      // we save data coming back from server
      newData = newData.flat();
      // we save it in sessionstorage
      if (window.sessionStorage) {
        window.sessionStorage.setItem(
          "helpForDictionary",
          JSON.stringify(newData)
        );
      }
    }
    setFreshData(newData);
    // we get the first element in the data
    const element = newData.shift();
    // we set the image
    setePSDelement(element);
    // we update the data in the session storage
    window.sessionStorage.setItem("helpForDictionary", JSON.stringify(newData));
    // the loading is over
    setLoadingFreshData(false);
  };

  useEffect(() => {
    (async () => {
      // saves references of already saved elements
      /*const elements = [];
      const savedDocs = await db.collection("sumerian_unicode").get();
      savedDocs.forEach(doc =>
        elements.push({ picture: doc.data()["epsd-pic"], unicode: doc.id })
      );
      setAlreadySaved(elements);*/
    })();
    // sets saved contributor name
    if (window.localStorage) {
      const user = window.localStorage.getItem("user");
      setContributor(user);
    }
  }, []);

  return (
    <div className={`${styles.main} sections`} id="conjugatorSection">
      <Card className={styles.help}>
        <Title level={4}>
          Let's create the largest online Sumerian dictionary!
        </Title>
        <div>
          In order to make Sumerian an everyday language,
          <wbr /> we need a dictionary that's easy to search, easy to use and
          easy to understand.
          <br />
          <br />
          To create a dictionary that we can use on the Internet for Sumerian,
          we have to match Unicode representations of the cuneiforms with their
          meanings. This has never been done before. Sumerian dictionaries have
          either image files for the cuneiforms (like the ePSD) or the Unicode
          representations of cuneiforms are matched with Akkadian or Babylonian
          words. This Unicode dictionary is crucial in order to write and read
          Sumerian online, but also to create various tools that can make use of
          it, like the conjugator or other apps.
          <br />
          <br />
          I started some of this work by myself but it is a colossal entreprise:
          there are over 900 Unicode blocks for cuneiforms and over 6,000
          entries in the ePSD.
          <br />
          <br />
          If you have two minutes of free time and you want to contribute, you
          can use the table below. <br />
          You will be presented with a picture of one or multiple cuneiforms and
          you must find the corresponding cuneiform(s) in the table.
          <br /> People who will input more than 50 right answers will have
          their names in the acknowledgements of the dictionary :) But you can
          also remain anonymous if you prefer.
          <br />
          <br />I will review myself every entry submitted by everyone and add
          them to the Sumerian online dictionary that will then be available and
          public on the "Dictionary" page.
          <br />
          <br />
          This cannot be done without you, be a part of it :)
          <br />
          <br />
          <Text disabled>
            (You need to install a cuneiform font to display the characters, for
            example{" "}
            <a
              href="http://users.teilar.gr/~g1951d/Akkadian.zip"
              target="_blank"
              rel="noopener noreferrer"
            >
              this one
            </a>
            .)
          </Text>
        </div>
        <div className={styles.startReview}>
          <Input
            placeholder="Your name (not mandatory)"
            value={contributor}
            onChange={event => {
              setContributor(event.target.value);
              if (window.localStorage) {
                window.localStorage.setItem("user", event.target.value);
              }
            }}
          />
          <br />
          <br />
          <Button
            type="primary"
            onClick={fetchCuneiformImage}
            loading={loadingFreshData}
          >
            {loadingFreshData ? "Loading..." : "Start !"}
          </Button>
        </div>
        <br />
        <br />
        <Affix offsetTop={60}>
          {ePSDelement ? (
            <div className={styles.cuneiformImage}>
              <img
                src={`http://psd.museum.upenn.edu/epsd/psl/img/popup/${
                  ePSDelement.images[0]
                }`}
                alt="cuneiform"
              />
            </div>
          ) : (
            <div className={styles.noCuneiformPreview}>
              <Title level={4}>No preview available</Title>
            </div>
          )}
        </Affix>
        <br />
        {unicodeTable()}
      </Card>
    </div>
  );
};

export default Help;
