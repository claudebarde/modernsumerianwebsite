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
  List
} from "antd";
import conjugator from "../../sumerian-conjugator/sumerian-conjugator";

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

  const [stem, setStem] = useState("");
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
            coloredPrefixes[0] = `<span style="color:${COLORS.proclitic}">${
              item.form
            }</span>`;
            break;
          case "preformative":
            coloredPrefixes[1] = `<span style="color:${COLORS.preformative}">${
              item.form
            }</span>`;
            break;
          case "ventive":
            coloredPrefixes[2] = `<span style="color:${COLORS.ventive}">${
              item.form
            }</span>`;
            break;
          case "indirect object":
            coloredPrefixes[3] = `<span style="color:${
              COLORS.indirectObject
            }">${item.form}</span>`;
            break;
          case "initial person prefix":
            coloredPrefixes[4] = `<span style="color:${
              COLORS.initialPersonPrefix
            }">${item.form}</span>`;
            break;
          case "dimensional prefix":
            coloredPrefixes[5] = `<span style="color:${
              COLORS.dimensionalPrefix
            }">${item.form}</span>`;
            break;
          case "oblique object":
            coloredPrefixes[6] = `<span style="color:${COLORS.obliqueObject}">${
              item.form
            }</span>`;
            break;
          case "transitive direct object":
            coloredPrefixes[7] = `<span style="color:${COLORS.directObject}">${
              item.form
            }</span>`;
            break;
          case "transitive subject":
            coloredPrefixes[8] = `<span style="color:${COLORS.subject}">${
              item.form
            }</span>`;
            break;
          default:
            break;
        }
      } else if (item.type === "suffix") {
        switch (item.function) {
          case "intransitive subject":
          case "transitive subject":
            coloredSuffixes[0] = `<span style="color:${COLORS.subject}">${
              item.form
            }</span>`;
            break;
          case "transitive direct object":
            coloredSuffixes[1] = `<span style="color:${COLORS.directObject}">${
              item.form
            }</span>`;
            break;
          default:
            break;
        }
      }
    });

    return (
      coloredPrefixes.filter(el => !!el).join("-") +
      "-" +
      stem +
      "-" +
      coloredSuffixes.filter(el => !!el).join("-")
    );
  };

  const displayConjugatedVerb = () => {
    if (verb) {
      return (
        <Row gutter={24} type="flex" justify="center">
          <Col span={8}>
            {verb.conjugatedVerb ? (
              <List
                size="small"
                header="Verb chain"
                dataSource={[verb.conjugatedVerb]}
                renderItem={item => (
                  <>
                    <List.Item>
                      <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        {item}
                      </span>
                    </List.Item>
                    <List.Item>
                      <span
                        style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                        dangerouslySetInnerHTML={{ __html: colorizeAffixes() }}
                      />
                    </List.Item>
                  </>
                )}
              />
            ) : (
              <List
                size="small"
                header="Verb chain"
                dataSource={["No data"]}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            )}
          </Col>
          <Col span={8}>
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
          <Col span={8}>
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
      );
    }

    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
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
    console.log(newVerb);
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
      <Card className={styles.conjugator}>
        <Row>
          <Col span={18}>
            <Title level={3}>Conjugator</Title>
          </Col>
          <Col span={6}>
            <img
              style={{ width: "50%", float: "right" }}
              src="images/undraw_artificial_intelligence_upfn.svg"
              alt="conjugator"
            />
          </Col>
        </Row>
        <Row gutter={24} type="flex" justify="center" align="bottom">
          <Col xs={24} sm={7} className={styles.columns}>
            <p>
              <span style={{ color: "red" }}>*</span> Verbal stem:
            </p>
            <Input
              placeholder="Verbal stem"
              value={stem}
              onChange={event => setStem(event.target.value)}
            />
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
              <Badge color={COLORS.subject} text="Subject:" />
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
              <Select.Option value="kha">KHA</Select.Option>
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
