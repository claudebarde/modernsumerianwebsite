import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Checkbox,
  Empty,
  Input,
  Select,
  Badge,
  List,
  Tooltip
} from "antd";
import conjugator from "../../sumerian-conjugator/sumerian-conjugator";
import { SYLLABARY } from "../resources/syllabary/syllabaryData";

import styles from "./conjugator.module.scss";

const { Title, Text } = Typography;

const Conjugator = () => {
  const COLORS = {
    subject: "#597ef7",
    directObject: "#73d13d",
    indirectObject: "#ff7a45",
    obliqueObject: "#9254de",
    dimensionalPrefix: "#f759ab",
    initialPersonPrefix: "#ffd6e7",
    preformative: "#ff4d4f",
    proclitic: "#ffa940",
    ventive: "#36cfc9"
  };

  const defaultVerbs = [
    { value: "shum", text: "\u{122E7} (shum)", cuneiform: "\u{122E7}" },
    { value: "naĝ", text: "\u{12158} (naĝ)", cuneiform: "\u{12158}" },
    { value: "ak", text: "\u{1201D} (ak)", cuneiform: "\u{1201D}" },
    { value: "gu", text: "\u{12165} (gu)", cuneiform: "\u{12165}" },
    { value: "ĝen", text: "\u{1207A} (ĝen)", cuneiform: "\u{1207A}" }
  ];

  const affixesStyle = { fontWeight: "bold", fontSize: "1.2rem" };

  const [stem, setStem] = useState("");
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
  const [ventive, setVentive] = useState(false);
  const [verb, setVerb] = useState(undefined);

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
    <Select.Option value="thirdSingularInanimate" key="3singnonhuman">
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

  const colorizeAffixes = () => {
    let coloredPrefixes = [].fill("", 0, 9);
    let coloredSuffixes = [].fill("", 0, 2);
    // we loop through the affixes in order
    verb.affixes.forEach(item => {
      if (item.type === "prefix") {
        switch (item.function) {
          case "proclitic":
            coloredPrefixes[0] = (
              <Tooltip
                placement="bottom"
                title="proclitic"
                key="verbchain-proclitic"
              >
                <span style={{ ...affixesStyle, color: COLORS.proclitic }}>
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "preformative":
            coloredPrefixes[1] = (
              <Tooltip
                placement="bottom"
                title="preformative"
                key="verbchain-preformative"
              >
                <span style={{ ...affixesStyle, color: COLORS.preformative }}>
                  {item.form || "Ø"}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "ventive":
            coloredPrefixes[2] = (
              <Tooltip
                placement="bottom"
                title="ventive"
                key="verbchain-ventive"
              >
                <span style={{ ...affixesStyle, color: COLORS.ventive }}>
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "indirect object":
            coloredPrefixes[3] = (
              <Tooltip
                placement="bottom"
                title="indirect object"
                key="verbchain-indirectObject"
              >
                <span style={{ ...affixesStyle, color: COLORS.indirectObject }}>
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "initial person prefix":
            coloredPrefixes[4] = (
              <Tooltip
                placement="bottom"
                title="initial person prefix"
                key="verbchain-initialPersonPrefix"
              >
                <span
                  style={{ ...affixesStyle, color: COLORS.initialPersonPrefix }}
                >
                  {item.form || "Ø"}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "dimensional prefix":
            coloredPrefixes[5] = (
              <Tooltip
                placement="bottom"
                title="dimensional prefix"
                key="verbchain-dimensionalPrefix"
              >
                <span
                  style={{ ...affixesStyle, color: COLORS.dimensionalPrefix }}
                >
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "oblique object":
            coloredPrefixes[6] = (
              <Tooltip
                placement="bottom"
                title="oblique object"
                key="verbchain-obliqueObject"
              >
                <span style={{ ...affixesStyle, color: COLORS.obliqueObject }}>
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "transitive direct object":
            coloredPrefixes[7] = (
              <Tooltip
                placement="bottom"
                title="direct object"
                key="verbchain-directObject"
              >
                <span style={{ ...affixesStyle, color: COLORS.directObject }}>
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          case "transitive subject":
            coloredPrefixes[8] = (
              <Tooltip
                placement="bottom"
                title="subject"
                key="verbchain-subject"
              >
                <span style={{ ...affixesStyle, color: COLORS.subject }}>
                  {item.form}
                </span>
                <span style={affixesStyle}>-</span>
              </Tooltip>
            );
            break;
          default:
            break;
        }
      } else if (item.type === "suffix") {
        switch (item.function) {
          case "intransitive subject":
          case "transitive subject":
            coloredSuffixes[0] = (
              <Tooltip
                placement="bottom"
                title="subject"
                key="verbchain-subject"
              >
                <span style={affixesStyle}>-</span>
                <span style={{ ...affixesStyle, color: COLORS.subject }}>
                  {item.form}
                </span>
              </Tooltip>
            );
            break;
          case "transitive direct object":
            coloredSuffixes[1] = (
              <Tooltip
                placement="bottom"
                title="direct object"
                key="verbchain-directObject"
              >
                <span style={affixesStyle}>-</span>
                <span style={{ ...affixesStyle, color: COLORS.directObject }}>
                  {item.form || "Ø"}
                </span>
              </Tooltip>
            );
            break;
          default:
            break;
        }
      }
    });

    return coloredPrefixes
      .filter(el => !!el)
      .concat(
        <Tooltip placement="bottom" title="stem" key="verbchain-stem">
          <span style={affixesStyle}>{stem}</span>
        </Tooltip>
      )
      .concat(coloredSuffixes.filter(el => !!el));
  };

  const displayConjugatedVerb = () => {
    if (verb) {
      return (
        <>
          <Row type="flex" justify="start">
            <Col span={24}>
              <Row style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                <Col xs={24} sm={8}>{`Verb chain: ${
                  verb.conjugatedVerb
                } `}</Col>
                <Col xs={24} sm={8}>
                  ({colorizeAffixes()})
                </Col>
                <Col className={styles.cuneiform} xs={24} sm={8}>
                  {writeCuneiforms(
                    {
                      prefixes: verb.syllables.prefixes,
                      suffixes: verb.syllables.suffixes
                    },
                    cuneiformVerb
                  )}
                </Col>
              </Row>
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

  const writeCuneiforms = (affixes, cuneiformVerb) => {
    const { prefixes, suffixes } = affixes;
    const VOWELS = ["a", "e", "i", "u"];
    let cuneiforms = cuneiformVerb;
    // we reverse the prefixes list so we can start building from the stem to the first prefix
    prefixes.reverse().forEach(syllable => {
      let result = "";
      // excludes single consonants
      if (VOWELS.includes(syllable) || syllable.length === 2) {
        let _syllable = SYLLABARY[syllable.toUpperCase()];
        if (_syllable === "none") {
          result = "Ø";
        } else if (Array.isArray(_syllable)) {
          result = _syllable[0] === "none" ? "Ø" : _syllable[0];
        } else {
          result = _syllable;
        }
      } else if (syllable.length === 3 || syllable.length === 4) {
        const a =
          SYLLABARY[syllable.slice(0, syllable.length - 1).toUpperCase()];
        const b = SYLLABARY[syllable.slice(-2).toUpperCase()];
        // first part of syllable
        if (a === "none") {
          result = "Ø";
        } else if (Array.isArray(a)) {
          result = a[0] === "none" ? "Ø" : a[0];
        } else {
          result = a;
        }
        // second part of syllable
        if (b === "none") {
          result += "Ø";
        } else if (Array.isArray(b)) {
          result += b[0] === "none" ? "Ø" : b[0];
        } else {
          result += b;
        }
      } else {
        result = "Ø";
      }
      cuneiforms = result + cuneiforms;
    });
    // suffixes
    let result;
    if (suffixes.length === 2) {
      const _syllable = SYLLABARY[suffixes.toUpperCase()];
      if (_syllable === "none") {
        result = "Ø";
      } else if (Array.isArray(_syllable)) {
        result = _syllable[0] === "none" ? "Ø" : _syllable[0];
      } else {
        result = _syllable;
      }
      cuneiforms = cuneiforms + result;
    } else if (suffixes === "n" && VOWELS.includes(stem[stem.length - 1])) {
      // suffix "n" after a vowel ending verb
      const constructedSuffix = stem[stem.length - 1].toUpperCase() + "N";
      const _syllable = SYLLABARY[constructedSuffix.toUpperCase()];
      if (_syllable === "none") {
        result = "Ø";
      } else if (Array.isArray(_syllable)) {
        result = _syllable[0] === "none" ? "Ø" : _syllable[0];
      } else {
        result = _syllable;
      }
      cuneiforms = cuneiforms + result;
    }

    return cuneiforms;
  };

  useEffect(() => {
    const newVerb = conjugator({
      stem,
      aspect,
      transitive: transitive === "transitive" ? true : false,
      subject: persons.subject,
      directObject: persons.directObject,
      obliqueObject: persons.obliqueObject,
      dimensionalPrefix: [{ prefix: dimensionalPrefix, initialPersonPrefix }],
      indirectObject: persons.indirectObject,
      ventive,
      preformative,
      proclitic
    });
    //console.log(newVerb);
    setVerb(newVerb);
  }, [
    stem,
    transitive,
    aspect,
    persons,
    dimensionalPrefix,
    initialPersonPrefix,
    preformative,
    proclitic,
    ventive
  ]);

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
            {/*<Input
              placeholder="Verbal stem"
              value={stem}
              onChange={event => setStem(event.target.value)}
            />*/}
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Verbal stem"
              value={stem}
              onChange={value => {
                console.log(value);
                setStem(value);
                defaultVerbs.forEach(
                  verb =>
                    verb.value === value && setCuneiformVerb(verb.cuneiform)
                );
              }}
            >
              {defaultVerbs.map(verb => (
                <Select.Option key={verb.value} value={verb.value}>
                  {verb.text}
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
              placeholder="Aspect"
              style={{ width: "100%" }}
              onChange={value => setAspect(value)}
              value={aspect}
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
            style={{ textAlign: "center" }}
          >
            <Checkbox
              onChange={event => setVentive(event.target.checked)}
              value={ventive}
            >
              <Badge color={COLORS.ventive} text="Ventive" />
            </Checkbox>
          </Col>
        </Row>
        <hr />
        <div>{displayConjugatedVerb()}</div>
      </Card>
    </div>
  );
};

export default Conjugator;
