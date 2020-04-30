let proverbs = {
  snow: {
    saying: "No snowflake ever falls in the wrong place.",
    author: "-Zen proverb",
  },
  rain: {
    saying: "The sound of rain needs no translation.",
    author: "-Zen proverb",
  },
  sun: {
    saying: "Turn your face to the sun and the shadows fall behind you.",
    author: "-Maori proverb",
  },
  clouds: {
    saying: "A cloudy sky doesn't always cry rain.",
    author: "-African proverb",
  },
  storm: {
    saying: "A tree with strong roots laughs at storms.",
    author: "-Malay proverb",
  },
  mist: {
    saying: "Words are the fog one has to see through.",
    author: "-Zen proverb",
  },
  default: {
    saying: "After bad weather comes good weather.",
    author: "-Maltese proverb",
  },
};

function showProverb(mainDescription) {
  let proverbElement = document.querySelector("#proverb");
  let authorElement = document.querySelector("#author");
  switch (mainDescription) {
    case "clouds":
      proverbElement.innerHTML = proverbs.clouds.saying;
      authorElement.innerHTML = proverbs.clouds.author;
      break;
    case "snow":
      proverbElement.innerHTML = proverbs.snow.saying;
      authorElement.innerHTML = proverbs.snow.author;
      break;
    case "rain":
    case "drizzle":
      proverbElement.innerHTML = proverbs.rain.saying;
      authorElement.innerHTML = proverbs.rain.author;
      break;
    case "clear":
      proverbElement.innerHTML = proverbs.sun.saying;
      authorElement.innerHTML = proverbs.sun.author;
      break;
    case "thunderstorm":
      proverbElement.innerHTML = proverbs.storm.saying;
      authorElement.innerHTML = proverbs.storm.author;
      break;
    case "mist":
    case "fog":
      proverbElement.innerHTML = proverbs.mist.saying;
      authorElement.innerHTML = proverbs.mist.author;
      break;
    default:
      proverbElement.innerHTML = proverbs.default.saying;
      authorElement.innerHTML = proverbs.default.author;
  }
}

function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  return `${day} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  let minutes = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
  return `${hours}:${minutes}`;
}

let apiKey = "f39b4d69b61752ac1179fb7a3b6a8e55";
let apiUrl = "https://api.openweathermap.org/data/2.5/";

function getCityApiUrl(cityInput) {
  return `${apiUrl}weather?q=${cityInput}&appid=${apiKey}&units=metric`;
}

function getGeoApiUrl(lat, lon) {
  return `${apiUrl}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

function getCityForecastApiUrl(cityInput) {
  return `${apiUrl}forecast?q=${cityInput}&appid=${apiKey}&units=metric`;
}

function getGeoForecastApiUrl(lat, lon) {
  return `${apiUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
}

function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-city-input");
  let url = getCityApiUrl(cityInput.value);
  axios
    .get(url)
    .then(showSearchCurrentWeather)
    .catch(function (error) {
      alert("City not found");
      getCurrentPosition();
    });

  let forecastUrl = getCityForecastApiUrl(cityInput.value);
  axios.get(forecastUrl).then(showSearchForecast);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

function showSearchCurrentWeather(response) {
  let lastUpdated = document.querySelector("#last-updated");
  lastUpdated.innerHTML = `Last updated: ${formatDate(
    response.data.dt * 1000
  )}`;
  showCurrentData(response);
  styleCelsius();
}

function showSearchForecast(response) {
  showForecastData(response);
}

function showCurrentData(response) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;

  currentTemperature = Math.round(response.data.main.temp);
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = currentTemperature;

  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed * 3.6);

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;

  let weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  let mainDescription = response.data.weather[0].main;
  showProverb(mainDescription.toLowerCase());
}

function showForecastData(response) {
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = null;
  let forecastDetails = null;

  for (let i = 0; i < 6; i++) {
    forecastDetails = response.data.list[i];
    forecast.innerHTML += `
   <div class="col-2 next-hours">
              <h3 class="time">${formatHours(forecastDetails.dt * 1000)}</h3>
              <img class="weather-icons" src="https://openweathermap.org/img/wn/${
                forecastDetails.weather[0].icon
              }@2x.png" alt="${forecastDetails.weather[0].description}" />
              <div class="temperature">
                <span class="max-temperature">${Math.round(
                  forecastDetails.main.temp_max
                )}°</span>
                <span class="min-temperature">${Math.round(
                  forecastDetails.main.temp_min
                )}°</span>
              </div>
            </div>
  `;
  }
}

function styleUnselectedComponent(component) {
  let fahrenheitScale = document.querySelector(component);
  fahrenheitScale.style.fontWeight = "normal";
  fahrenheitScale.style.color = "gray";
}

function styleSelectedComponent(component) {
  let fahrenheitScale = document.querySelector(component);
  fahrenheitScale.style.fontWeight = "bold";
  fahrenheitScale.style.color = "black";
}

function makeLink(component, unitSymbol) {
  let scale = document.querySelector(component);
  scale.innerHTML = `<a href="#">°${unitSymbol}</a>`;
}

function removeLink(component, unitSymbol) {
  let scale = document.querySelector(component);
  scale.innerHTML = `°${unitSymbol}`;
}

function styleCelsius() {
  styleUnselectedComponent("#fahrenheit-scale");
  styleSelectedComponent("#celsius-scale");
  makeLink("#fahrenheit-scale", "F");
  removeLink("#celsius-scale", "C");
}

function styleFahrenheit() {
  styleSelectedComponent("#fahrenheit-scale");
  styleUnselectedComponent("#celsius-scale");
  makeLink("#celsius-scale", "C");
  removeLink("#fahrenheit-scale", "F");
}

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = Math.round(currentTemperature * (9 / 5) + 32);
  styleFahrenheit();
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = currentTemperature;
  styleCelsius();
}

let fahrenheit = document.querySelector("#fahrenheit-scale");
let celsius = document.querySelector("#celsius-scale");
fahrenheit.addEventListener("click", showFahrenheit);
celsius.addEventListener("click", showCelsius);

function showPosition(position) {
  let url = getGeoApiUrl(position.coords.latitude, position.coords.longitude);
  axios.get(url).then(showGeoCurrentWeather);

  let forecastUrl = getGeoForecastApiUrl(
    position.coords.latitude,
    position.coords.longitude
  );
  axios.get(forecastUrl).then(showGeoForecast);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

getCurrentPosition();

function showGeoCurrentWeather(response) {
  let lastUpdated = document.querySelector("#last-updated");
  lastUpdated.innerHTML = `Last updated: ${formatDate(
    response.data.dt * 1000
  )}`;
  showCurrentData(response);
  styleCelsius();
}

function showGeoForecast(response) {
  showForecastData(response);
}

let currentTemperature = null;
