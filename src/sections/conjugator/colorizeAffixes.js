import React from "react";
import { Tooltip } from "antd";

export const COLORS = {
  subject: "#597ef7",
  directObject: "#73d13d",
  indirectObject: "#ff7a45",
  obliqueObject: "#9254de",
  dimensionalPrefix: "#f759ab",
  initialPersonPrefix: "#ffd6e7",
  preformative: "#ff4d4f",
  proclitic: "#ffa940",
  ventive: "#36cfc9",
  middleMarker: "#ff4d4f",
  reduplicated: "#b7eb8f"
};

const affixesStyle = { fontWeight: "bold", fontSize: "1.2rem" };

export const colorizeAffixes = verb => {
  let coloredPrefixes = [].fill("", 0, 10);
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
            <Tooltip placement="bottom" title="ventive" key="verbchain-ventive">
              <span style={{ ...affixesStyle, color: COLORS.ventive }}>
                {item.form}
              </span>
              <span style={affixesStyle}>-</span>
            </Tooltip>
          );
          break;
        case "middle marker":
          coloredPrefixes[3] = (
            <Tooltip
              placement="bottom"
              title="middle marker"
              key="verbchain-middleMarker"
            >
              <span style={{ ...affixesStyle, color: COLORS.middleMarker }}>
                {item.form}
              </span>
              <span style={affixesStyle}>-</span>
            </Tooltip>
          );
          break;
        case "indirect object":
          coloredPrefixes[4] = (
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
          coloredPrefixes[5] = (
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
          coloredPrefixes[6] = (
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
          coloredPrefixes[7] = (
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
          coloredPrefixes[8] = (
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
          coloredPrefixes[9] = (
            <Tooltip placement="bottom" title="subject" key="verbchain-subject">
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
            <Tooltip placement="bottom" title="subject" key="verbchain-subject">
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
        <span style={affixesStyle}>{verb.stem}</span>
      </Tooltip>
    )
    .concat(coloredSuffixes.filter(el => !!el));
};
