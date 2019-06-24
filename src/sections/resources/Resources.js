import React from "react";
import { Alert } from "antd";

import Syllabary from "./syllabary/Syllabary";

import styles from "./Resources.module.scss";

const Resources = () => {
  return (
    <div className={`${styles.main} sections`} id="resourcesSection">
      <Alert
        className={styles.fontAlert}
        message={
          <div>
            You need to install a cuneiform font to display the characters.
            <br />
            The one used for this website is available{" "}
            <a
              href="http://users.teilar.gr/~g1951d/Akkadian.zip"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </div>
        }
        type="info"
        showIcon
        closable
        banner
      />
      <br />
      <Syllabary />
    </div>
  );
};

export default Resources;
