import React from "react";
import { Tooltip } from "antd";

import styles from "./NoMatchPage.module.scss";

const NoMatchPage = () => {
  return (
    <div className={`${styles.main} sections`} id="dictionarySection">
      <div>
        <img alt="404" src="images/undraw_page_not_found_su7k.svg" />
        <p className={styles.cuneiforms}>
          <Tooltip title="ugu baden? (are you lost?)">
            <span>{`\u{12311}\u{12116}`}</span>
            <span>{`\u{12040}\u{12324}\u{12097}`}</span>
            <span>?</span>
          </Tooltip>
        </p>
        <p className={styles.cuneiforms}>
          <Tooltip title="kiba niĝname naĝal! (there is nothing here!)">
            <span>{`\u{121A0}\u{12040}`}</span>
            <span>{`\u{120FB}\u{1223E}\u{12228}`}</span>
            <span>{`\u{1223E}\u{12145}!`}</span>
          </Tooltip>
        </p>
      </div>
    </div>
  );
};

export default NoMatchPage;
