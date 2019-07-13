import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Checkbox,
  Empty,
  Select,
  Badge,
  List,
  Button
} from "antd";
import TextTransition from "react-text-transition";

import conjugator from "../../sumerian-conjugator/sumerian-conjugator";
import { colorizeAffixes, COLORS } from "./colorizeAffixes";

import styles from "./conjugator.module.scss";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const db = firebase.firestore();

const { Title, Text } = Typography;

const Conjugator = () => {
  const [stem, setStem] = useState("");
  const [verbID, setVerbID] = useState(null);
  const [cuneiformVerb, setCuneiformVerb] = useState(undefined);
  const [transitive, setTransitive] = useState(undefined);
  const [aspect, setAspect] = useState(undefined);
  const [persons, setPersons] = useState({
    subject: undefined,
    directObject: undefined,
    indirectObject: undefined,
    obliqueObject: undefined
  });
  const [dimensionalPrefix, setDimensionalPrefixes] = useState(undefined);
  const [initialPersonPrefix, setInitialPersonPrefix] = useState(undefined);
  const [preformative, setPreformative] = useState(undefined);
  const [proclitic, setProclitic] = useState(undefined);
  const [reduplicated, setReduplicated] = useState(false);
  const [defaultVerbs, setDefaultVerbs] = useState([]);
  const [ventive, setVentive] = useState(false);
  const [middleMarker, setMiddleMarker] = useState(false);
  const [verb, setVerb] = useState(undefined);
  const [imperfectiveForm, setImperfectiveForm] = useState(undefined);

  const personsOptions = () => [
    <Select.Option value="firstSingular" key="1sing">
      First person singular
    </Select.Option>,
    <Select.Option value="secondSingular" key="2sing">
      Second person singular
    </Select.Option>,
    <Select.Option value="thirdSingularAnimate" key="3singhuman">
      Third person singular animate
    </Select.Option>,
    <Select.Option
      value="thirdSingularInanimate"
      key="3singnonhuman"
      disabled={middleMarker}
    >
      Third person singular inanimate
    </Select.Option>,
    <Select.Option value="firstPlural" key="1pl">
      First person plural
    </Select.Option>,
    <Select.Option value="secondPlural" key="2pl">
      Second person plural
    </Select.Option>,
    <Select.Option value="thirdPluralAnimate" key="3plhuman">
      Third person plural animate
    </Select.Option>,
    <Select.Option value="thirdPluralInanimate" key="3plnonhuman">
      Third person plural inanimate
    </Select.Option>
  ];

  const displayConjugatedVerb = () => {
    if (verb) {
      // displays syllable structure
      let _syllables = "";
      if (verb.syllables.prefixes.length > 0) {
        // adds prefixes
        verb.syllables.prefixes.forEach(
          prefix => (_syllables = `${prefix}-${_syllables}`)
        );
      }
      // adds verb stem
      _syllables = _syllables + verb.stem;
      if (verb.syllables.suffixes.length > 0) {
        // adds suffixes
        _syllables =
          _syllables +
          verb.syllables.suffixes.map(suffix => `-${suffix}`).join("");
      }

      return (
        <>
          <Row type="flex" justify="start" align="top">
            <Col xs={24} sm={3} className={styles.verbalForms}>
              Verb chain:
            </Col>
            <Col xs={24} sm={7}>
              <div className={styles.verbalForms}>{verb.conjugatedVerb}</div>
              <div>{displayVerbMeanings()}</div>
            </Col>
            <Col xs={24} sm={7} className={styles.verbalForms}>
              ({colorizeAffixes(verb)})
            </Col>
            <Col xs={24} sm={7}>
              <div className={styles.verbalForms}>
                {cuneiformVerb && (
                  <TextTransition text={verb.cuneiforms.chain} />
                )}
              </div>
              <div>
                <Text disabled>{_syllables}</Text>
              </div>
            </Col>
          </Row>

          <Row gutter={24} type="flex" justify="center">
            <Col xs={24} sm={12}>
              {verb.affixes && verb.affixes.length > 0 ? (
                <List
                  size="small"
                  header="Affixes"
                  dataSource={verb.affixes}
                  renderItem={item => (
                    <List.Item>{`${item.function} => ${item.form ||
                      "Ø"} (${item.rawForm || "Ø"})`}</List.Item>
                  )}
                />
              ) : (
                <List
                  size="small"
                  header="Affixes"
                  dataSource={["No data"]}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
              )}
            </Col>
            <Col xs={24} sm={12}>
              {verb.notes && verb.notes.length > 0 ? (
                <List
                  size="small"
                  header="Notes"
                  dataSource={verb.notes}
                  renderItem={item => <List.Item>{`- ${item}`}</List.Item>}
                />
              ) : (
                <List
                  size="small"
                  header="Notes"
                  dataSource={["No notes"]}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
              )}
            </Col>
          </Row>
        </>
      );
    }

    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  const displayVerbMeanings = () => {
    const verb = defaultVerbs.filter(verb => verb.id === verbID);

    return (
      <Text disabled>
        {Object.keys(verb[0].meaning)
          .map(meaning => `to ${meaning} ;`)
          .join(" ")
          .trim()
          .slice(0, -1)}
      </Text>
    );
  };

  useEffect(() => {
    const newVerb = conjugator({
      verbID,
      stem,
      aspect,
      transitive: transitive === "transitive" ? true : false,
      subject: persons.subject,
      directObject: persons.directObject,
      obliqueObject: persons.obliqueObject,
      dimensionalPrefix: [{ prefix: dimensionalPrefix, initialPersonPrefix }],
      indirectObject: persons.indirectObject,
      ventive,
      middleMarker,
      preformative,
      proclitic,
      reduplicated,
      defaultVerbs
    });
    setVerb(newVerb);
  }, [
    verbID,
    stem,
    transitive,
    aspect,
    persons,
    dimensionalPrefix,
    initialPersonPrefix,
    preformative,
    proclitic,
    ventive,
    middleMarker,
    reduplicated,
    defaultVerbs
  ]);

  useEffect(() => {
    (async () => {
      // checks if default verbs have not been downloaded in previous session
      if (window.sessionStorage) {
        const verbsStorage = window.sessionStorage.getItem("defaultVerbs");
        if (verbsStorage) {
          setDefaultVerbs(JSON.parse(verbsStorage));
        } else {
          // fetches default verbs for conjugator on load
          const _defaultVerbs = [];
          const results = await db.collection("sumerian_verbs").get();
          results.forEach(result => _defaultVerbs.push(result.data()));
          _defaultVerbs.sort((a, b) => (a.value > b.value ? 1 : -1));
          setDefaultVerbs(_defaultVerbs);
          // sets session storage
          window.sessionStorage.setItem(
            "defaultVerbs",
            JSON.stringify(_defaultVerbs)
          );
        }
      } else {
        // fetches default verbs for conjugator on load
        const _defaultVerbs = [];
        const results = await db.collection("sumerian_verbs").get();
        results.forEach(result => _defaultVerbs.push(result.data()));
        setDefaultVerbs(
          _defaultVerbs.sort((a, b) => (a.value > b.value ? 1 : -1))
        );
      }
    })();
  }, []);

  return (
    <div className={`${styles.main} sections`} id="conjugatorSection">
      <a
        href="https://github.com/claudebarde/ModernSumerianVerbConjugator"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubCorner}
        aria-label="View source on GitHub"
        style={{ zIndex: "999" }}
      >
        <svg
          className={styles.githubSVG}
          viewBox="0 0 250 250"
          style={{
            fill: "#fff7e6",
            color: "#ffd591",
            position: "absolute",
            top: "0",
            border: "0",
            right: "0",
            transition: "fill 0.7s"
          }}
          aria-hidden="true"
          id="github-logo"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{ transformOrigin: "130px 106px" }}
            className={styles.octoArm}
          />
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className={styles.octoBody}
          />
        </svg>
      </a>
      <Card className={styles.conjugator}>
        <Row>
          <Col span={18}>
            <Title level={3}>Conjugator</Title>
          </Col>
          <Col span={6}>
            <img
              //style={{ width: "50%", float: "right" }}
              className={styles.cardPicture}
              src="images/undraw_artificial_intelligence_upfn.svg"
              alt="conjugator"
            />
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Text disabled>
            (Verbal stem, transitivity, aspect and subject fields are mandatory)
          </Text>
        </div>
        <Row gutter={24} type="flex" justify="center" align="bottom">
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <span style={{ color: "red" }}>*</span> Verbal stem:
            </p>
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a verb"
              optionLabelProp="children"
              value={defaultVerbs
                .filter(verb => verbID === verb.id)
                .map(verb => `${verb.cuneiform} (${verb.value})`)
                .join("")}
              onChange={value => {
                // sets the cuneiform value for the stem
                defaultVerbs.forEach(verb => {
                  if (verb.id === value) {
                    if (aspect === "perfective") {
                      setStem(verb.value);
                    } else if (aspect === "imperfective") {
                      setStem(verb.imperfective.form);
                    } else {
                      setAspect("perfective");
                      setStem(verb.value);
                    }
                    setVerbID(verb.id);
                    setCuneiformVerb(verb.cuneiform);
                    setImperfectiveForm(verb.imperfective);
                    setTransitive(
                      verb.transitive ? "transitive" : "intransitive"
                    );
                  }
                });
              }}
            >
              {defaultVerbs.map((verb, i) => (
                <Select.Option key={`${verb.value}-${i}`} value={verb.id}>
                  {`${verb.cuneiform} (${verb.value})`}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <span style={{ color: "red" }}>*</span> Transitivity:
            </p>
            <Select
              placeholder="Transitivity"
              style={{ width: "100%" }}
              onChange={value => setTransitive(value)}
              value={transitive}
              allowClear={true}
            >
              <Select.Option value="transitive">Transitive</Select.Option>
              <Select.Option value="intransitive">Intransitive</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <span style={{ color: "red" }}>*</span> Aspect:
            </p>
            <Select
              value={aspect}
              placeholder="Aspect"
              style={{ width: "100%" }}
              onChange={value => {
                setAspect(value);
                // if the verb is amoung the default verbs
                if (value === "imperfective") {
                  // we update the stem
                  if (imperfectiveForm) {
                    setStem(imperfectiveForm.form);
                    setCuneiformVerb(imperfectiveForm.cuneiform);
                  }
                } else {
                  defaultVerbs.forEach(verb => {
                    if (verb.id === verbID) {
                      setStem(verb.value);
                      setCuneiformVerb(verb.cuneiform);
                    }
                  });
                }
              }}
              allowClear={true}
            >
              <Select.Option value="perfective">Perfective</Select.Option>
              <Select.Option value="imperfective">Imperfective</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={24} type="flex" justify="center" align="bottom">
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge color={COLORS.subject} text="* Subject:" />
            </p>
            <Select
              placeholder="Subject"
              style={{ width: "100%" }}
              onChange={value => setPersons({ ...persons, subject: value })}
              value={persons.subject}
              allowClear={true}
            >
              {personsOptions()}
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge color={COLORS.directObject} text="Direct Object:" />
            </p>
            <Select
              placeholder="Direct Object"
              style={{ width: "100%" }}
              onChange={value =>
                setPersons({ ...persons, directObject: value })
              }
              value={persons.directObject}
              allowClear={true}
              disabled={transitive === "intransitive"}
            >
              {personsOptions()}
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge color={COLORS.indirectObject} text="Indirect Object:" />
            </p>
            <Select
              placeholder="Indirect Object"
              style={{ width: "100%" }}
              onChange={value =>
                setPersons({ ...persons, indirectObject: value })
              }
              value={persons.indirectObject}
              allowClear={true}
            >
              {personsOptions()}
            </Select>
          </Col>
        </Row>
        <Row gutter={24} type="flex" justify="center" align="bottom">
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge color={COLORS.obliqueObject} text="Oblique Object:" />
            </p>
            <Select
              placeholder="Oblique Object"
              style={{ width: "100%" }}
              onChange={value =>
                setPersons({ ...persons, obliqueObject: value })
              }
              value={persons.obliqueObject}
              allowClear={true}
            >
              {personsOptions()}
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge
                color={COLORS.dimensionalPrefix}
                text="Dimensional Prefixes:"
              />
            </p>
            <Select
              placeholder="Dimensional Prefixes"
              style={{ width: "100%" }}
              onChange={value => setDimensionalPrefixes(value)}
              value={dimensionalPrefix}
              optionLabelProp="label"
              allowClear={true}
            >
              <Select.Option value="with" label="DA">
                DA
              </Select.Option>
              <Select.Option value="from" label="TA">
                TA
              </Select.Option>
              <Select.Option value="towards" label="SHI">
                SHI
              </Select.Option>
              <Select.Option value="in" label="NI">
                NI
              </Select.Option>
              <Select.Option value="on" label="E">
                E
              </Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge
                color={COLORS.initialPersonPrefix}
                text="Initial-Person Prefixes:"
              />
            </p>
            <Select
              placeholder="Initial-Person Prefixes"
              style={{ width: "100%" }}
              onChange={value => setInitialPersonPrefix(value)}
              value={initialPersonPrefix}
              allowClear={true}
            >
              {personsOptions()}
            </Select>
          </Col>
        </Row>
        <Row gutter={24} type="flex" justify="center" align="bottom">
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge
                color={COLORS.preformative}
                text="Preformative Prefixes:"
              />
            </p>
            <Select
              placeholder="Preformative Prefixes"
              style={{ width: "100%" }}
              onChange={value => setPreformative(value)}
              value={preformative}
              allowClear={true}
            >
              <Select.Option value="a">A</Select.Option>
              <Select.Option value="i">I</Select.Option>
              <Select.Option value="u">U</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <Badge color={COLORS.proclitic} text="Proclitics:" />
            </p>
            <Select
              placeholder="Proclitics"
              style={{ width: "100%" }}
              onChange={value => setProclitic(value)}
              value={proclitic}
              allowClear={true}
            >
              <Select.Option value="ha">HA</Select.Option>
              <Select.Option value="nu">NU</Select.Option>
              <Select.Option value="nan">NAN</Select.Option>
              <Select.Option value="ga">GA</Select.Option>
              <Select.Option value="bara">BARA</Select.Option>
            </Select>
          </Col>
          <Col
            xs={24}
            sm={7}
            className={styles.columns}
            style={{ textAlign: "left" }}
          >
            <Checkbox
              onChange={event => setVentive(event.target.checked)}
              checked={ventive}
            >
              <Badge color={COLORS.ventive} text="Ventive" />
            </Checkbox>
            <br />
            <Checkbox
              onChange={event => setMiddleMarker(event.target.checked)}
              checked={middleMarker}
            >
              <Badge color={COLORS.middleMarker} text="Middle Marker" />
            </Checkbox>
            <br />
            <Checkbox
              onChange={event => {
                setReduplicated(event.target.checked);
              }}
              checked={reduplicated}
            >
              <Badge color={COLORS.reduplicated} text="Reduplicated Stem" />
            </Checkbox>
          </Col>
        </Row>
        <div style={{ width: "100%", textAlign: "center", padding: "5px" }}>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setStem("");
              setVerbID(null);
              setCuneiformVerb(undefined);
              setTransitive(undefined);
              setAspect(undefined);
              setPersons({
                subject: undefined,
                directObject: undefined,
                indirectObject: undefined,
                obliqueObject: undefined
              });
              setDimensionalPrefixes(undefined);
              setInitialPersonPrefix(undefined);
              setPreformative(undefined);
              setProclitic(undefined);
              setReduplicated(false);
              setVentive(false);
              setMiddleMarker(false);
              setVerb(undefined);
              setImperfectiveForm(undefined);
            }}
          >
            Reset
          </Button>
        </div>
        <hr />
        <div>{displayConjugatedVerb()}</div>
      </Card>
    </div>
  );
};

export default Conjugator;
