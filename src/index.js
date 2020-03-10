let now = new Date();
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

let currentDayAndTime = document.querySelector("#current-day-and-time");
currentDayAndTime.innerHTML = `${day} ${hours}:${minutes}`;

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
  axios
    .get(url)
    .then(showTemperature)
    .catch(function(error) {
      // handle error
      console.log(error);
    });
  cityInput.value = "";
}

function showTemperature(response) {
  let celsiusTemperature = Math.round(response.data.main.temp);
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = celsiusTemperature;

  styleUnselectedComponent("#fahrenheit-scale");
  styleSelectedComponent("#celsius-scale");
  makeLink("#fahrenheit-scale", "F");
  removeLink("#celsius-scale", "C");
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let apiKey = "f39b4d69b61752ac1179fb7a3b6a8e55";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather";

function getCityApiUrl(cityInput) {
  return `${apiUrl}?q=${cityInput}&appid=${apiKey}&units=metric`;
}

function getGeoApiUrl(lat, lon) {
  return `${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
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
  let celsiusNow = Number(temperatureNow.innerHTML);
  temperatureNow.innerHTML = Math.round(celsiusNow * (9 / 5) + 32);
  styleSelectedComponent("#fahrenheit-scale");
  styleUnselectedComponent("#celsius-scale");
  makeLink("#celsius-scale", "C");
  removeLink("#fahrenheit-scale", "F");
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  let fahrenheitNow = Number(temperatureNow.innerHTML);
  temperatureNow.innerHTML = Math.round(((fahrenheitNow - 32) * 5) / 9);
  styleUnselectedComponent("#fahrenheit-scale");
  styleSelectedComponent("#celsius-scale");
  makeLink("#fahrenheit-scale", "F");
  removeLink("#celsius-scale", "C");
}

let fahrenheit = document.querySelector("#fahrenheit-scale");
let celsius = document.querySelector("#celsius-scale");
fahrenheit.addEventListener("click", showFahrenheit);
celsius.addEventListener("click", showCelsius);

function showPosition(position) {
  let url = getGeoApiUrl(position.coords.latitude, position.coords.longitude);
  axios.get(url).then(showCurrentLocation);
}

function showCurrentLocation(response) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = Math.round(response.data.main.temp);
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
