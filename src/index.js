function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  let day = days[now.getDay()];
  let hours = now.getHours();
  let minutes = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

  return `${day} ${hours}:${minutes}`;
}

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getHours();
  let minutes = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
  return `${hours}:${minutes}`;
}

function showForecast(response) {
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = null;
  let forecastDetails = null;

  for (let i = 0; i < 5; i++) {
    forecastDetails = response.data.list[i];
    forecast.innerHTML += `
   <div class="col next-hours">
              <h3 class="time">${formatHours(forecastDetails.dt * 1000)}</h3>
              <img class="weather-icons" src="http://openweathermap.org/img/wn/${
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

function searchCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-city-input");
  let h1 = document.querySelector("h1");
  let city = cityInput.value;
  let cityTitle = city
    .toLowerCase()
    .split(" ")
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
  h1.innerHTML = cityTitle;
  let url = getCityApiUrl(cityInput.value);
  axios.get(url).then(showCurrentWeather);
  /*.catch(function(error) {
      console.log(error);
    }); */
  // still needs to be fixed

  let forecastUrl = getCityForecastApiUrl(cityInput.value);
  axios.get(forecastUrl).then(showForecast);
}

function showCurrentWeather(response) {
  let lastUpdated = document.querySelector("#last-updated");
  lastUpdated.innerHTML = `Last updated: ${formatDate(
    response.data.dt * 1000
  )}`;

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
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  styleUnselectedComponent("#fahrenheit-scale");
  styleSelectedComponent("#celsius-scale");
  makeLink("#fahrenheit-scale", "F");
  removeLink("#celsius-scale", "C");
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

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

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = Math.round(currentTemperature * (9 / 5) + 32);
  styleSelectedComponent("#fahrenheit-scale");
  styleUnselectedComponent("#celsius-scale");
  makeLink("#celsius-scale", "C");
  removeLink("#fahrenheit-scale", "F");
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = currentTemperature;
  styleUnselectedComponent("#fahrenheit-scale");
  styleSelectedComponent("#celsius-scale");
  makeLink("#fahrenheit-scale", "F");
  removeLink("#celsius-scale", "C");
}

let fahrenheit = document.querySelector("#fahrenheit-scale");
let celsius = document.querySelector("#celsius-scale");
fahrenheit.addEventListener("click", showFahrenheit);
celsius.addEventListener("click", showCelsius);

function showGeoForecast(response) {
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = null;
  let forecastDetails = null;

  for (let i = 0; i < 5; i++) {
    forecastDetails = response.data.list[i];
    forecast.innerHTML += `
   <div class="col next-hours">
              <h3 class="time">${formatHours(forecastDetails.dt * 1000)}</h3>
              <img class="weather-icons" src="http://openweathermap.org/img/wn/${
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

function showPosition(position) {
  let url = getGeoApiUrl(position.coords.latitude, position.coords.longitude);
  axios.get(url).then(showCurrentLocation);

  let forecastUrl = getGeoForecastApiUrl(
    position.coords.latitude,
    position.coords.longitude
  );
  axios.get(forecastUrl).then(showGeoForecast);
}

function showCurrentLocation(response) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;

  let lastUpdated = document.querySelector("#last-updated");
  lastUpdated.innerHTML = `Last updated: ${formatDate(
    response.data.dt * 1000
  )}`;

  let temperatureNow = document.querySelector("#temperature-now");
  currentTemperature = Math.round(response.data.main.temp);
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
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", response.data.weather[0].description);

  styleUnselectedComponent("#fahrenheit-scale");
  styleSelectedComponent("#celsius-scale");
  makeLink("#fahrenheit-scale", "F");
  removeLink("#celsius-scale", "C");
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

getCurrentPosition();

let currentTemperature = null;
