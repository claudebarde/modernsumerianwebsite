import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card } from "antd";
import TextLoop from "react-text-loop";
import styles from "./Weather.module.scss";

const weatherDescriptions = {
  200: { english: "Thunderstorm with rain", sumerian: "", cuneiforms: "" },
  201: { english: "Thunderstorm with rain", sumerian: "", cuneiforms: "" },
  202: { english: "Thunderstorm with rain", sumerian: "", cuneiforms: "" },
  230: { english: "Thunderstorm", sumerian: "", cuneiforms: "" },
  231: { english: "Thunderstorm", sumerian: "", cuneiforms: "" },
  232: { english: "Thunderstorm", sumerian: "", cuneiforms: "" },
  233: { english: "Thunderstorm", sumerian: "", cuneiforms: "" },
  300: { english: "Drizzle", sumerian: "", cuneiforms: "" },
  301: { english: "Drizzle", sumerian: "", cuneiforms: "" },
  302: { english: "Drizzle", sumerian: "", cuneiforms: "" },
  500: { english: "Light Rain", sumerian: "", cuneiforms: "" },
  501: { english: "Moderate Rain", sumerian: "", cuneiforms: "" },
  502: { english: "Heavy Rain", sumerian: "", cuneiforms: "" },
  511: { english: "Rain", sumerian: "Im musheĝed", cuneiforms: "𒅎 𒈬𒀀𒀭𒀁" },
  520: { english: "Rain", sumerian: "Im musheĝed", cuneiforms: "𒅎 𒈬𒀀𒀭𒀁" },
  521: { english: "Rain", sumerian: "Im musheĝed", cuneiforms: "𒀀𒅎 𒈬𒀀𒀭𒀁" },
  522: { english: "Rain", sumerian: "Im musheĝed", cuneiforms: "𒅎 𒈬𒀀𒀭𒀁" },
  600: { english: "Snow", sumerian: "", cuneiforms: "" },
  601: { english: "Snow", sumerian: "", cuneiforms: "" },
  602: { english: "Snow", sumerian: "", cuneiforms: "" },
  610: { english: "Snow and rain", sumerian: "", cuneiforms: "" },
  611: { english: "Sleet", sumerian: "", cuneiforms: "" },
  612: { english: "Sleet", sumerian: "", cuneiforms: "" },
  621: { english: "Snow", sumerian: "", cuneiforms: "" },
  622: { english: "Snow", sumerian: "", cuneiforms: "" },
  623: { english: "Snow", sumerian: "", cuneiforms: "" },
  700: { english: "Mist", sumerian: "", cuneiforms: "" },
  711: { english: "Smoke", sumerian: "", cuneiforms: "" },
  721: { english: "Haze", sumerian: "", cuneiforms: "" },
  731: { english: "Sand/dust", sumerian: "", cuneiforms: "" },
  741: { english: "Fog", sumerian: "Barsheĝ", cuneiforms: "𒁇𒀀𒀭" },
  751: { english: "Fog", sumerian: "Barsheĝ", cuneiforms: "𒁇𒀀𒀭" },
  800: {
    english: "Clear sky",
    sumerian: "Ud dalla munie",
    cuneiforms: "𒌓 𒈦𒄘𒃼 𒈬𒉌𒌓𒁺"
  },
  801: { english: "Few clouds", sumerian: "dungu tukua", cuneiforms: "𒅎𒋛𒀀 𒌇𒀀" },
  802: {
    english: "Scattered clouds",
    sumerian: "Dungu tukua",
    cuneiforms: "𒅎𒋛𒀀 𒌇𒀀"
  },
  803: {
    english: "Broken clouds",
    sumerian: "Dungu tukua",
    cuneiforms: "𒅎𒋛𒀀 𒌇𒀀"
  },
  804: {
    english: "Overcast clouds",
    sumerian: "Dungu tukua",
    cuneiforms: "𒅎𒋛𒀀 𒌇𒀀"
  },
  900: { english: "Unknown Precipitation", sumerian: "", cuneiforms: "" }
};

const cities = {
  nippur: "𒂗𒆤𒆠",
  ur: "𒋀𒀕𒆠"
};

const Weather = () => {
  const [nippurWeather, setNippurWeather] = useState(undefined);
  const [urWeather, setUrWeather] = useState(undefined);
  const [yourWeather, setYourWeather] = useState(undefined);
  const [loadingUserLocation, setLoadingUserLocation] = useState(false);

  const displayWeather = ({
    dayTime,
    temperature,
    weatherCode,
    weatherDescription,
    icon,
    city
  }) => {
    const weatherDisplay = (
      <Card
        hoverable
        title={
          <Row style={{ whiteSpace: "normal" }}>
            <Col xs={24} md={12} style={{ textAlign: "left" }}>
              {`Weather in ${city}`}
            </Col>
            <Col xs={24} md={12} className={styles.titleInCuneiforms}>{`𒉆𒀭 ${
              cities[city.toLowerCase()] ? cities[city.toLowerCase()] : city
            }𒀀`}</Col>
          </Row>
        }
        style={{ margin: "5px 10px" }}
        bodyStyle={{ padding: "5px" }}
      >
        <Row type="flex" justify="space-around" align="middle">
          <Col xs={5} md={8} style={{ textAlign: "center" }}>
            <img
              src={`/images/weather-icons/${icon}.png`}
              alt="weather icon"
              className={styles.weatherIcon}
            />
          </Col>
          <Col xs={19} md={16}>
            <TextLoop mask={true} className={styles.weatherDescriptions}>
              <div>
                <p
                  className={styles.weatherDescription}
                >{`${temperature} ℃`}</p>
                <p className={styles.weatherDescription}>
                  {weatherDescriptions[weatherCode].english}
                </p>
              </div>
              <div>
                <p
                  className={styles.weatherDescription}
                >{`${temperature} 𒅊`}</p>
                <p className={styles.weatherDescription}>
                  {weatherDescriptions[weatherCode].cuneiforms
                    ? weatherDescriptions[weatherCode].cuneiforms
                    : weatherDescriptions[weatherCode].english}
                </p>
              </div>
              <div>
                <p
                  className={styles.weatherDescription}
                >{`${temperature} ℃`}</p>
                <p className={styles.weatherDescription}>
                  {weatherDescriptions[weatherCode].sumerian
                    ? weatherDescriptions[weatherCode].sumerian
                    : weatherDescriptions[weatherCode].english}
                </p>
              </div>
            </TextLoop>
          </Col>
        </Row>
      </Card>
    );
    if (city.toLowerCase() === "nippur") {
      setNippurWeather(weatherDisplay);
    } else if (city.toLowerCase() === "ur") {
      setUrWeather(weatherDisplay);
    } else {
      setYourWeather(weatherDisplay);
    }
  };

  const fetchWeather = async (lat, lon, city) => {
    try {
      const result = await fetch(
        `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=0c3b0f77f3b844ad8d59ab0022513bef`
      );
      const weather = await result.json();
      const weatherData = weather.data[0];
      // we extract the useful information
      const data = {
        temperature: weatherData.temp,
        dayTime: weatherData.pod === "d" ? "day" : "night",
        weatherCode: weatherData.weather.code,
        weatherDescription: weatherData.weather.description,
        icon: weatherData.weather.icon,
        cityName: weatherData.city_name
      };
      // we save the data in sessionStorage
      if (city === "nippur") {
        sessionStorage.setItem("nippurWeather", JSON.stringify(data));
      } else if (city === "ur") {
        sessionStorage.setItem("urWeather", JSON.stringify(data));
      } else {
        sessionStorage.setItem("yourCityWeather", JSON.stringify(data));
      }

      return data;
    } catch (err) {
      console.log("Unable to fetch weather:", err);
      return null;
    }
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      /* geolocation is available */
      setLoadingUserLocation(true);
      navigator.geolocation.getCurrentPosition(async position => {
        const weather = await fetchWeather(
          position.coords.latitude,
          position.coords.longitude,
          "yourCity"
        );
        displayWeather({ ...weather, city: weather.cityName });
      }, locationError);
    } else {
      /* geolocation IS NOT available */
      console.log("not available");
    }
  };

  const locationError = () => {
    setLoadingUserLocation(false);
  };

  useEffect(() => {
    const nippurLat = 32.126444;
    const nippurLon = 45.233381;
    const urLat = 30.963056;
    const urLon = 46.103056;
    if (sessionStorage) {
      // Nippur weather
      let nippurWeather = sessionStorage.getItem("nippurWeather");
      if (nippurWeather) {
        // if weather was already fetched for the same session
        nippurWeather = JSON.parse(nippurWeather);
        displayWeather({ ...nippurWeather, city: "Nippur" });
      } else {
        (async () => {
          const nippurWeather = await fetchWeather(
            nippurLat,
            nippurLon,
            "nippur"
          );
          displayWeather({ ...nippurWeather, city: "Nippur" });
        })();
      }
      // Ur weather
      let urWeather = sessionStorage.getItem("urWeather");
      if (urWeather) {
        // if weather was already fetched for the same session
        urWeather = JSON.parse(urWeather);
        displayWeather({ ...urWeather, city: "Ur" });
      } else {
        (async () => {
          const urWeather = await fetchWeather(urLat, urLon, "ur");
          displayWeather({ ...urWeather, city: "Ur" });
        })();
      }
      // your city weather
      let yourCityWeather = sessionStorage.getItem("yourCityWeather");
      if (yourCityWeather) {
        // if weather was already fetched for the same session
        yourCityWeather = JSON.parse(yourCityWeather);
        displayWeather({ ...yourCityWeather, city: yourCityWeather.cityName });
      }
    } else {
      console.log("No session storage");
    }
  }, []);

  return (
    <div className={`${styles.main} sections`} id="weatherSection">
      <Row
        type="flex"
        justify="space-around"
        align="middle"
        className={styles.weatherDisplay}
      >
        <Col sm={24} md={7}>
          {nippurWeather}
        </Col>
        <Col sm={24} md={7}>
          {urWeather}
        </Col>
        <Col sm={24} md={10}>
          {yourWeather === undefined ? (
            <div style={{ textAlign: "center" }}>
              <Button
                type="dashed"
                size="small"
                onClick={getLocation}
                loading={loadingUserLocation}
              >
                Load your weather
              </Button>
            </div>
          ) : (
            yourWeather
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Weather;
