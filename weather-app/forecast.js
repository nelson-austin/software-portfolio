// Data Pulled from https://openweathermap.org/
// Create am account for your own apikey



const form = document.querySelector('#search-form');
const input = document.querySelector('#search-term');
const msg = document.querySelector('.form-msg');
const days = document.querySelector('.days');

const apiKey = 'fddb75827544bb7915ab737cd8bd0e60'


let inputVal = 'Atlanta';
const url = `http://api.openweathermap.org/data/2.5/forecast?q=${inputVal}&appid=${apiKey}&units=imperial`;
fetchForecast(url);

// Function is called for all fetch requests
async function fetchForecast(url) {
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // Seperate data into more usable objects
        const {city, list} = data;
        console.log(city);
        console.log(list.length);

        // Loop through data but only add every 8 data points
        for (i = 0; i < list.length; i=i+8) {

        


            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
            list[i].weather[0].icon}.svg`;
            // Each day is stored as a <li>
            const li = document.createElement('li');        
            const markup = `
                <figure>
                    <img src="${icon}" alt="${list[i].weather[0].description}">
                </figure>
                <div>
                    <h1>${list[i].main.temp}<sup>°F</sup></h1>
                    <p class="city-conditions">${list[i].weather[0].description}</p>
                    <h3 class="city-name">Atlanta</h3>
                </div>`;

            li.innerHTML = markup;
            days.appendChild(li);
            console.log(data);
        }

        // If the data fails to load, send to the catch block.
        // Let user know by sending a message
    } catch (error) {
        console.error('Error fetching weather data');
        msg.textContent = 'Forecast not found. Please try again later.';
    }
}
    
