import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Landing from "./sections/landing/Landing";
import Dictionary from "./sections/dictionary/Dictionary";
import Conjugator from "./sections/conjugator/Conjugator";
import Footer from "./sections/footer/Footer";
import Header from "./sections/header/Header";
import FlashcardGame from "./sections/flashcardgame/FlashcardGame";

import "./App.css";

const BGCOLOR = "#ffd591";

const App = () => {
  /*const bgChange = () => {
    const landingSection = document.getElementById("landingSection");
    const landingSectionMobile = document.getElementById(
      "landingSectionMobile"
    );
    const dictionarySection = document.getElementById("dictionarySection");
    const conjugatorSection = document.getElementById("conjugatorSection");
    const roadmapSection = document.getElementById("roadmapSection");
    const flashcardGameSection = document.getElementById(
      "flashcardGameSection"
    );
    const githubLogo = document.getElementById("github-logo");

    let landingDictPosition,
      dictConjugatorPosition,
      conjStepsPosition,
      flashcardGamePosition;
    if (landingSection.clientHeight > 0) {
      // computer view
      landingDictPosition = (landingSection.clientHeight / 3) * 2;
      dictConjugatorPosition =
        landingSection.clientHeight + (dictionarySection.clientHeight / 3) * 2;
      conjStepsPosition =
        landingSection.clientHeight +
        dictionarySection.clientHeight +
        conjugatorSection.clientHeight / 2;
      flashcardGamePosition =
        landingSection.clientHeight +
        dictionarySection.clientHeight +
        conjugatorSection.clientHeight +
        flashcardGameSection.clientHeight / 2;
    } else if (landingSectionMobile.clientHeight) {
      // mobile view
      landingDictPosition = (landingSectionMobile.clientHeight / 4) * 3;
      dictConjugatorPosition =
        landingSectionMobile.clientHeight +
        (dictionarySection.clientHeight / 3) * 2;
      conjStepsPosition =
        landingSectionMobile.clientHeight +
        dictionarySection.clientHeight +
        conjugatorSection.clientHeight / 2;
      flashcardGamePosition =
        landingSectionMobile.clientHeight +
        dictionarySection.clientHeight +
        conjugatorSection.clientHeight +
        flashcardGameSection.clientHeight / 2;
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
      conjugatorSection.style.background = "#ffffff";
      dictionarySection.style.background = BGCOLOR;
      // github logo
      githubLogo.style.fill = BGCOLOR;
      githubLogo.style.color = "#ffffff";
    } else if (
      window.scrollY > dictConjugatorPosition &&
      window.scrollY < conjStepsPosition
    ) {
      // user is on the conjugator
      dictionarySection.style.background = "#ffffff";
      conjugatorSection.style.background = BGCOLOR;
      flashcardGameSection.style.background = "#ffffff";
      // github logo
      githubLogo.style.fill = "#ffffff";
      githubLogo.style.color = BGCOLOR;
    } else if (
      window.scrollY > conjStepsPosition &&
      window.scrollY < flashcardGamePosition
    ) {
      // user is on the flashcard game
      flashcardGameSection.style.background = BGCOLOR;
      conjugatorSection.style.background = "#ffffff";
      roadmapSection.style.background = "#ffffff";
      // github logo
      githubLogo.style.fill = "#ffffff";
      githubLogo.style.color = BGCOLOR;
    } else if (window.scrollY > flashcardGamePosition) {
      // user is on the roadmap
      flashcardGameSection.style.background = "#ffffff";
      roadmapSection.style.background = BGCOLOR;
    }
  };*/

  useEffect(() => {
    /*window.addEventListener("scroll", bgChange);
    bgChange();*/
  }, []);

  return (
    <Router>
      <Header />
      <Route exact path="/" component={Landing} />
      <Route path="/dictionary" component={Dictionary} />
      <Route path="/conjugator" component={Conjugator} />
      <Route path="/flashcardgame" component={FlashcardGame} />
      <Footer />
    </Router>
  );
};

export default App;
