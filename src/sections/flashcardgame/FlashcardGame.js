import React, { useState, useEffect } from "react";
import {
  Typography,
  Row,
  Col,
  Card,
  Skeleton,
  Alert,
  Button,
  Modal,
  Select,
  Icon,
  Empty
} from "antd";

import styles from "./FlashcardGame.module.scss";

import WORDS from "./words";

const { Title } = Typography;

const FlashcardGame = () => {
  const [level, setLevel] = useState(0);
  const [points, setPoints] = useState(0);
  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [difficulty, setDifficulty] = useState(0);
  const [game, setGame] = useState([]);
  const [combinaison, setCombinaison] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(undefined);
  const [showCongrats, setShowCongrats] = useState(false);
  const [initialWord, setInitialWord] = useState(undefined);

  const getRandomInt = (min, max) => {
    /*min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;*/
    return Math.floor(Math.random() * (max - min) + min);
  };

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateCards = initialWord => {
    let cards = [];
    if (level === 1) {
      cards.push(
        {
          sumerian: WORDS[initialWord].sumerian,
          unicode: WORDS[initialWord].unicode
        },
        { english: WORDS[initialWord].english }
      );
    } else {
      cards.push(
        {
          sumerian: WORDS[initialWord].sumerian,
          unicode: WORDS[initialWord].unicode
        },
        { english: WORDS[initialWord].english }
      );
      // keeps track of words that were alreayd picked up to have unique words
      const alreadyChosen = [initialWord];
      for (let i = 1; i < level; i++) {
        let index = getRandomInt(0, WORDS.length);
        // verifies only unique words are added
        while (alreadyChosen.includes(index)) {
          index = getRandomInt(0, WORDS.length);
        }
        alreadyChosen.push(index);
        // adds new cards
        cards.push(
          {
            sumerian: WORDS[index].sumerian,
            unicode: WORDS[index].unicode
          },
          { english: WORDS[index].english }
        );
      }
      cards = shuffleArray(cards);
    }

    const arrangedCards = [];
    let i, j, temparray, chunk;
    if (cards.length % 3 === 0) {
      // rows of 3 cards
      chunk = 3;
    } else {
      // rows of 4 cards
      chunk = 4;
    }
    // arranges cards into chunks of 3 or 4
    for (i = 0, j = cards.length; i < j; i += chunk) {
      temparray = cards.slice(i, i + chunk);
      arrangedCards.push(temparray);
    }

    return arrangedCards;
  };

  const selectCard = cardWord => {
    if (combinaison.length < 2) {
      const newCombinaison = [...combinaison, cardWord];
      setCombinaison(newCombinaison);
    } else if (combinaison.length === 2) {
      setCombinaison([cardWord]);
    }
  };

  // initializes game with random word
  useEffect(() => {
    setInitialWord(getRandomInt(0, WORDS.length));
  }, []);
  // loads new game after word is initialized
  useEffect(() => {
    if (initialWord || initialWord === 0) {
      setGame(generateCards(initialWord));
      setIsLoading(false);
    }
  }, [initialWord]);
  // checks combinaison
  useEffect(() => {
    // colors selected divs
    combinaison.forEach(card => {
      const cardID = document.getElementById(`card-${card}`);
      if (cardID) cardID.style.backgroundColor = "#e6f7ff";
    });
    if (combinaison.length === 2) {
      // stores element references
      const firstSelection = document.getElementById(`card-${combinaison[0]}`);
      const secondSelection = document.getElementById(`card-${combinaison[1]}`);
      // validates answers
      const findCombinaison = WORDS.filter(
        card =>
          (card.sumerian === combinaison[0] &&
            card.english === combinaison[1]) ||
          (card.sumerian === combinaison[1] && card.english === combinaison[0])
      );
      // if right combinaison
      if (findCombinaison.length === 1) {
        // changes color
        firstSelection.style.backgroundColor = "#d9f7be";
        secondSelection.style.backgroundColor = "#d9f7be";
        // disables card
        firstSelection.setAttribute("disabled", true);
        secondSelection.setAttribute("disabled", true);
        // gives point
        setPoints(points + 1);
        // increments right answers counter
        setRightAnswers(rightAnswers + 1);
      } else {
        // if wrong combinaison
        firstSelection.style.backgroundColor = "#ffccc7";
        secondSelection.style.backgroundColor = "#ffccc7";
        // takes point
        setPoints(points > 0 ? points - 1 : 0);
        // saves wrong answers
        const _wrongAnswers = combinaison.map(
          word =>
            WORDS.filter(el => el.sumerian === word || el.english === word)[0]
        );
        setWrongAnswers([...wrongAnswers, ..._wrongAnswers]);
        setTimeout(() => {
          // resets color
          firstSelection.style.backgroundColor = "#ffffff";
          secondSelection.style.backgroundColor = "#ffffff";
        }, 1000);
      }
    }
  }, [combinaison]);
  // gets user to next level as soon as number of right answers === level
  useEffect(() => {
    if (rightAnswers === level) {
      //sets new level
      setLevel(level + 1);
      // resets all cards to white background
      const cards = document.getElementsByClassName("flashcard");
      Array.prototype.forEach.call(cards, card => {
        console.log("hello");
        card.style.backgroundColor = "#ffffff";
      });
      // resets right answers
      setRightAnswers(0);
      // sets back to loading status
      setIsLoading(true);
      setShowCongrats(true);
    }
  }, [rightAnswers]);
  // resets card game when new level is reached
  useEffect(() => {
    if (level !== 0 && level <= WORDS.length) {
      // user gets 5 more seconds every 5 level
      if (level % 5 === 0) {
        setCountdown(countdown + 10);
      }
      setTimeout(() => {
        setGame(generateCards(initialWord));
        setIsLoading(false);
        setShowCongrats(false);
      }, 500);
    } else if (level === 0 && countdown === 0) {
      // regenerates a game from level 0 after countdown is over
      setGame(generateCards(initialWord));
    }
  }, [level]);
  // updates countdown and terminate game after time's elapsed
  useEffect(() => {
    let interval = null;
    //console.log(countdown);
    if (countdown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown >= 0 && countdown - 1);
      }, 1000);
    } else {
      if (countdown === 0) {
        const _wrongAnswers = [...new Set(wrongAnswers)];
        Modal.success({
          title: "Congratulations!",
          bodyStyle: { margin: "0px" },
          content: (
            <div>
              <Row style={{ textAlign: "center", marginLeft: "-38px" }}>
                <Col span={8}>{`Difficulty: ${
                  difficulty === 0 ? "easy" : "hard"
                }`}</Col>
                <Col span={8}>{`Level: ${level}`}</Col>
                <Col span={8}>{`${points} ${
                  points < 2 ? "point" : "points"
                }`}</Col>
              </Row>
              <br />
              {wrongAnswers.length > 0 && (
                <Card
                  title="Your wrong answers"
                  style={{ textAlign: "center", marginLeft: "-38px" }}
                  size="small"
                >
                  {_wrongAnswers.map(answer => (
                    <Card.Grid key={answer.sumerian}>
                      <span className={styles.cuneiform}>{answer.unicode}</span>
                      <br />
                      <span style={{ whiteSpace: "nowrap" }}>
                        {answer.sumerian.toUpperCase()}
                      </span>
                      <br />
                      <span style={{ whiteSpace: "nowrap" }}>
                        {answer.english}
                      </span>
                    </Card.Grid>
                  ))}
                </Card>
              )}
            </div>
          )
        });
        setLevel(1);
        setPoints(0);
        setRightAnswers(0);
        setCombinaison([]);
        setWrongAnswers([]);
      }
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  return (
    <div className={`${styles.main} sections`} id="flashcardGameSection">
      <Card className={styles.flashcardGame}>
        <Row>
          <Col span={18}>
            <Title level={3}>Flashcard Game</Title>
          </Col>
          <Col span={6}>
            <img
              src="images/undraw_old_day_6x25.svg"
              alt="flashcard"
              className={styles.cardPicture}
            />
          </Col>
        </Row>
        <div className={styles.cardsContainer}>
          <br />
          <br />
          <Row type="flex" justify="center">
            <Col span={18}>
              <Title level={4} className={styles.title}>
                Have fun and learn new cuneiforms !
              </Title>
            </Col>
          </Row>
          <br />
          <br />
          <Row type="flex" justify="space-around">
            <Col xs={12} sm={6}>
              <Title level={4} className={styles.score}>
                Level {level}
              </Title>
            </Col>
            <Col xs={12} sm={6}>
              <Title level={4} className={styles.score}>
                Points: {points}
              </Title>
            </Col>
            <Col xs={12} sm={6}>
              <Title level={4} className={styles.score}>
                {countdown ? (
                  `Countdown: ${countdown}`
                ) : (
                  <>
                    <Select
                      placeholder="Difficulty"
                      defaultValue={difficulty.toString()}
                      onChange={value => setDifficulty(value)}
                      className={styles.selectDifficulty}
                    >
                      <Select.Option value="0">Easy</Select.Option>
                      <Select.Option value="1">Hard</Select.Option>
                    </Select>
                  </>
                )}
              </Title>
            </Col>
          </Row>
          {!countdown ? (
            <Empty
              image="images/undraw_To_the_stars_qhyy.svg"
              imageStyle={{
                height: 70
              }}
              description={<span>Start a new game!</span>}
            >
              <Button type="primary" onClick={() => setCountdown(40)}>
                Start
              </Button>
            </Empty>
          ) : isLoading ? (
            showCongrats ? (
              <div className={styles.congratsMessage}>
                <Alert message="Congratulations!" type="success" showIcon />
                <Skeleton active />
              </div>
            ) : (
              <div className={styles.congratsMessage}>
                <Skeleton active />
              </div>
            )
          ) : (
            game.map((fourCards, rowIndex) => (
              <Row
                key={`row-cards-${rowIndex}`}
                gutter={14}
                style={{ marginTop: "10px" }}
                type="flex"
                justify="space-around"
                align="middle"
              >
                {fourCards.map((card, colIndex) => (
                  <Col
                    xs={fourCards.length === 3 ? 8 : 12}
                    sm={24 / fourCards.length}
                    key={`col-cards-${rowIndex}-${colIndex}`}
                    style={{ marginBottom: "5px" }}
                  >
                    {card.hasOwnProperty("sumerian") ? (
                      <Card
                        size="small"
                        className={styles.flashcard}
                        onClick={() => selectCard(card.sumerian)}
                        id={`card-${card.sumerian}`}
                        disabled={false}
                        hoverable={true}
                      >
                        <span className={styles.cuneiform}>{card.unicode}</span>
                        {difficulty === 0 && (
                          <>
                            <br />
                            <br />
                            <span className={styles.transliteration}>
                              {card.sumerian.toUpperCase()}
                            </span>
                          </>
                        )}
                      </Card>
                    ) : (
                      <Card
                        className={styles.flashcard}
                        onClick={() => selectCard(card.english)}
                        id={`card-${card.english}`}
                        disabled={false}
                        hoverable={true}
                      >
                        {difficulty === 0 && (
                          <>
                            <span className={styles.englishIcon}>
                              <Icon type="align-center" />
                            </span>
                            <br />
                            <br />
                          </>
                        )}
                        <span className={styles.transliteration}>
                          {card.english.toUpperCase()}
                        </span>
                      </Card>
                    )}
                  </Col>
                ))}
              </Row>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default FlashcardGame;
