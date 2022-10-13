// Get reference to the #search element ('Search' city button)
var searchBtn = document.querySelector("#search");
// Get reference to input field where user will enter a city name
var city = document.querySelector("#cityInput");
// Array to store cities in 'History' search
var cities = [];
// Key to access OpenWeather API
var APIKey = "38a07275b84946c812dcb08c2e4bd539";
// URLs
// https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}
var coordinatesURL = "https://api.openweathermap.org/data/3.0/onecall?";
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
var cityURL = "https://api.openweathermap.org/data/2.5/weather?q="
// URL to access weather icons
var iconURLroot = "http://openweathermap.org/img/wn/"
// Parameters to exclude from the API call
var excludeParams = "current,minutely,hourly,alerts";

// Function to add new cities to local storage 
function saveCity(newCity) {
    cities.push(newCity); // Add the city name to the cities array
    // Store cities array in local storage
    localStorage.setItem("Searched",JSON.stringify(cities));
    var cityHistory; 
}

// Function to create h4 elements to display temperature, wind, and humidity 
function fillInWeather (weatherDiv,temperature,windSpeed,humidityPctg) {
    var date = document.createElement("h2");
    var temp = document.createElement("h4");
    var wind = document.createElement("h4");
    var humidity = document.createElement("h4");
    temp.textContent = "Temp: " + temperature + " C";
    wind.textContent = "Wind: " + windSpeed + " m/s";
    humidity.textContent = "Humidity: " + humidityPctg + " %";
    temp.className = "weatherData";
    wind.className = "weatherData";
    humidity.className = "weatherData";
    weatherDiv.appendChild(temp);
    weatherDiv.appendChild(wind);
    weatherDiv.appendChild(humidity);
}

// Main function: Search a city on #search
function searchCity(event) {
    var lon, lat;
    event.preventDefault();
    // Build URL with searched city name to call API
    cityURL = cityURL + city.value + "&appid=" + APIKey + "&units=metric";
    // console.log(cityURL);
    // Get current weather for searched city
    fetch (cityURL)
    .then(function (response) {
        //console.log(response.status);
        return response.json();
    })
    .then (function (data){
        var currentCity = document.querySelector("#searchedCity");
        var cityName = document.createElement("h2");
        var weatherIcon = document.createElement("img");
        // Convert UTC timestamp to
        var date = new Date((data.dt + data.timezone)* 1000);
        cityName.className = "city-search";
        cityName.textContent = data.name + " (" + date.toLocaleDateString() + ")";
        // Build weather icon URL based on searched city
        var iconURL = [];
        iconURL[0] = iconURLroot + data.weather[0].icon + "@2x.png";
        weatherIcon.setAttribute("src",iconURL[0]);
        cityName.appendChild(weatherIcon);
        currentCity.appendChild(cityName);
        var temp = data.main.temp;
        var wind = data.wind.speed;
        var humidity = data.main.humidity;    
        fillInWeather(currentCity,temp,wind,humidity);
        lon = data.coord.lon;
        lat = data.coord.lat;
        // Build URL with coordinates to retrieve 5-day forecast
        coordinatesURL += "lat=" + lat + "&lon=" + lon + "&exclude=" + excludeParams + "&appid=" + APIKey + "&units=metric";
        console.log("coordinatesURL: " + coordinatesURL);
        fetch(coordinatesURL)
            .then(function (response) {
                //console.log(response.status);
                return response.json();
            })
            .then(function (data) {
                var longRange = document.querySelector("#fiveDays");
                for (var i = 1; i<=5; i++) {
                    var futureDate = document.createElement("h3");
                    var dayWeather = document.createElement("div");
                    var weatherIcon = document.createElement("img");
                    dayWeather.className = "card text-bg-secondary";
                    var date = new Date((data.daily[i].dt + data.timezone_offset) * 1000);
                    var temp = data.daily[i].temp.day;
                    var wind = data.daily[i].wind_speed;
                    var humidity = data.daily[i].humidity;
                    futureDate.textContent = date.toLocaleDateString();
                    futureDate.className = "date-search";
                    dayWeather.appendChild(futureDate);
                    iconURL[i] = iconURLroot + data.daily[i].weather[0].icon + "@2x.png";
                    console.log("iconURL: " + iconURL[i]);
                    weatherIcon.setAttribute("src", iconURL[i]);
                    weatherIcon.setAttribute("style", "width:3rem;height:3rem");
                    dayWeather.appendChild(weatherIcon);
                    fillInWeather(dayWeather, temp, wind, humidity);
                    longRange.appendChild(dayWeather);
                }
            });
    });

    // Verify if the last city searched for exists in local storage, if not add it 
    if (!cities.includes(city.value)) {
        saveCity(city.value);
    }

}
// Add event listener to 'Search' city button
searchBtn.addEventListener("click", searchCity);