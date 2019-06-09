import React, { useEffect } from "react";
import Landing from "./sections/landing/landing";
import Dictionary from "./sections/dictionary/dictionary";
import Conjugator from "./sections/conjugator/conjugator";
import Footer from "./sections/footer/footer";

import "./App.css";

const BGCOLOR = "#ffd591";

const App = () => {
  const bgChange = () => {
    const landingSection = document.getElementById("landingSection");
    const landingSectionMobile = document.getElementById(
      "landingSectionMobile"
    );
    const dictionarySection = document.getElementById("dictionarySection");
    const conjugator = document.getElementById("conjugatorSection");

    let landingDictPosition, dictConjugatorPosition;
    if (landingSection.clientHeight > 0) {
      // computer view
      landingDictPosition = (landingSection.clientHeight / 3) * 2;
      dictConjugatorPosition =
        landingSection.clientHeight + dictionarySection.clientHeight / 3;
    } else if (landingSectionMobile.clientHeight) {
      // mobile view
      landingDictPosition = (landingSectionMobile.clientHeight / 3) * 2;
      dictConjugatorPosition =
        landingSectionMobile.clientHeight + dictionarySection.clientHeight / 3;
    }

    if (window.scrollY < landingDictPosition) {
      // user is at the top of the UI
      dictionarySection.style.background = "#ffffff";
      landingSection.style.background = BGCOLOR;
      landingSectionMobile.style.background = BGCOLOR;
    } else if (
      window.scrollY > landingDictPosition &&
      window.scrollY < dictConjugatorPosition
    ) {
      // user is on dictionary
      landingSection.style.background = "#ffffff";
      landingSectionMobile.style.background = "#ffffff";
      conjugator.style.background = "#ffffff";
      dictionarySection.style.background = BGCOLOR;
    } else if (window.scrollY > dictConjugatorPosition) {
      dictionarySection.style.background = "#ffffff";
      conjugator.style.background = BGCOLOR;
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", bgChange);
    bgChange();
  }, []);

  return (
    <>
      <Landing />
      <Dictionary />
      <Conjugator />
      <Footer />
    </>
  );
};

export default App;
