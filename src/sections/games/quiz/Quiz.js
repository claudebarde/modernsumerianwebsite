import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Empty,
  Button,
  Select,
  Skeleton
} from "antd";

import styles from "./Quiz.module.scss";

import WORDS from "../words";

const { Title } = Typography;
const GREEN = "#d9f7be";
const RED = "#ffccc7";

const Quiz = () => {
  const [level, setLevel] = useState(1);
  const [rightAnswers, setRightAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [sumerianWords, setSumerianWords] = useState([]);
  const [cardWord, setCardWord] = useState(undefined);
  const [loadNewCard, setLoadNewCard] = useState(false);

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const newCardWord = () => {
    if (sumerianWords.length > 0) {
      const index = getRandomInt(0, sumerianWords.length);
      const _sumerianWords = [...sumerianWords];
      const newWord = _sumerianWords.splice(index, 1)[0];
      // we fetch the whole data about the chosen word
      let newWordData = WORDS.filter(word => word.sumerian === newWord)[0];
      // level of difficulty dictates number of options available
      let numberOfOptions = 4;
      if (difficulty === 1) {
        numberOfOptions = 2;
      }
      // we add a property with randomly chosen definitions
      let definitions = [newWordData.english];
      while (definitions.length < numberOfOptions) {
        // we create a random entry
        const randomWord = WORDS[getRandomInt(0, WORDS.length)].english;
        // we check if the entry is not already in the array
        if (definitions.indexOf(randomWord) === -1) {
          definitions.push(randomWord);
        }
      }
      // we shuffle the new array
      definitions = shuffleArray(definitions);
      // we save the possible definitions
      newWordData.definitions = definitions;
      // we set the new word
      setCardWord(newWordData);
      // we save the new array with one word less
      setSumerianWords(_sumerianWords);
      // display new card
      setLoadNewCard(false);
    }
  };

  const verifyAnswer = definition => {
    if (cardWord.english === definition) {
      document.getElementById(
        `${definition}-button`
      ).style.backgroundColor = GREEN;
      // adds one right answer
      setRightAnswers(rightAnswers + 1);
      // loads new card
      setLoadNewCard(true);
      setTimeout(() => {
        newCardWord();
      }, 1000);
    } else {
      setWrongAnswers(wrongAnswers + 1);
      const wrongAnswer = document.getElementById(`${definition}-button`);
      wrongAnswer.style.backgroundColor = RED;
      wrongAnswer.setAttribute("disabled", true);
    }
  };

  useEffect(() => {
    // game sorts the data that will be used during the game
    const data = WORDS.map(word => word.sumerian);
    setSumerianWords(data);
  }, []);

  return (
    <Card className={styles.quiz}>
      <Row>
        <Col span={18}>
          <Title level={3}>Cuneiform Quiz</Title>
        </Col>
        <Col span={6}>
          <img
            src="images/undraw_questions_75e0.svg"
            alt="flashcard"
            className={styles.cardPicture}
          />
        </Col>
      </Row>
      <div className={styles.title}>
        <Title level={4}>Learn and review Sumerian cuneiforms</Title>
      </div>
      <div className={styles.cardsContainer}>
        <br />
        <br />
        <Row type="flex" justify="space-around">
          <Col xs={12} sm={6}>
            <Title level={4} className={styles.score}>
              Right Answers: {rightAnswers}
            </Title>
          </Col>
          <Col xs={12} sm={6}>
            <Title level={4} className={styles.score}>
              Wrong Answers: {wrongAnswers}
            </Title>
          </Col>
          <Col xs={12} sm={6}>
            <Title level={4} className={styles.score}>
              <Select
                placeholder="Difficulty"
                defaultValue={difficulty.toString()}
                onChange={value => setDifficulty(parseInt(value))}
              >
                <Select.Option value="0">Easy</Select.Option>
                <Select.Option value="1">Hard</Select.Option>
              </Select>
            </Title>
          </Col>
        </Row>
        {wrongAnswers === 5 ? (
          <Empty
            image="images/undraw_feeling_blue_4b7q.svg"
            imageStyle={{
              height: 70
            }}
            description={<span>Sorry, you lost!</span>}
          >
            <Button
              type="primary"
              onClick={() => {
                const data = WORDS.map(word => word.sumerian);
                setSumerianWords(data);
                setRightAnswers(0);
                setWrongAnswers(0);
                setSumerianWords([]);
                setCardWord(undefined);
                newCardWord();
              }}
            >
              Start again
            </Button>
          </Empty>
        ) : cardWord === undefined ? (
          <div className={styles.gameDisplay}>
            <Empty
              image="images/undraw_knowledge_g5gf.svg"
              imageStyle={{
                height: 70
              }}
              description={<span>Start a new game!</span>}
            >
              <Button type="primary" onClick={newCardWord}>
                Start
              </Button>
            </Empty>
          </div>
        ) : loadNewCard ? (
          <>
            <Card className={styles.cardWord} loading />
            <Card className={styles.cardWord} loading />
          </>
        ) : (
          <>
            <Card
              className={styles.cardWord}
              title={
                <div>
                  <span className={styles.cardCuneiform}>
                    {cardWord.unicode}
                  </span>
                  <br />
                  <br />
                  <span>{cardWord.sumerian}</span>
                </div>
              }
            >
              {cardWord.definitions.map(definition => (
                <Button
                  className={styles.definitionButton}
                  id={`${definition}-button`}
                  key={definition}
                  onClick={() => verifyAnswer(definition)}
                  block
                >
                  {definition}
                </Button>
              ))}
            </Card>
            <br />
            <Button
              type="primary"
              onClick={() => {
                const data = WORDS.map(word => word.sumerian);
                setSumerianWords(data);
                setRightAnswers(0);
                setWrongAnswers(0);
                setSumerianWords(WORDS.map(word => word.sumerian));
                setCardWord(undefined);
              }}
            >
              Reset
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default Quiz;
