import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Landing from "./sections/landing/Landing";
import Dictionary from "./sections/dictionary/Dictionary";
import Conjugator from "./sections/conjugator/Conjugator";
import Footer from "./sections/footer/Footer";
import Header from "./sections/header/Header";
import Games from "./sections/games/Games";
import ScrollToTop from "./ScrollToTop";
import NoMatchPage from "./sections/nomatchpage/NoMatchPage";

import "./App.css";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Route exact path="/" component={Landing} />
      <Route path="/dictionary" component={Dictionary} />
      <Route path="/conjugator" component={Conjugator} />
      <Route path="/games" component={Games} />
      <Route component={NoMatchPage} />
      <Footer />
    </Router>
  );
};

export default App;
