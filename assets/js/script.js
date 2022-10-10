// Get reference to the #search element ('Search' city button)
var searchBtn = document.querySelector("#search");
var city = document.querySelector("#cityInput");
var cities = [];

function saveCity(newCity) {
    cities.push(newCity); // Add the city name to the cities array
    // Store cities array in local storage
    localStorage.setItem("Searched",JSON.stringify(cities)); 
}

// Search a city on #search
function searchCity(event) {
    event.preventDefault();
    console.log(city.value);
    // Verify if the last city searched for exists in local storage, if not add it 
    if (!cities.includes(city.value)) {
        saveCity(city.value);
    }
    
}
// Add event listener to 'Search' city button
searchBtn.addEventListener("click", searchCity);