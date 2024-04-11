// Data Pulled from https://openweathermap.org/
// Create am account for your own apikey



const form = document.querySelector('#search-form');
const input = document.querySelector('#search-term');
const msg = document.querySelector('.form-msg');
const list = document.querySelector('.cities');

const apiKey = 'fddb75827544bb7915ab737cd8bd0e60'


// Add event listener when user clicks search
form.addEventListener('submit', e => {
    e.preventDefault();

    msg.textContent = '';
    msg.classList.remove('visible');

    let inputVal = input.value;
    form.reset();
    input.focus();


    // Each list item is a different city's weather being displayed.
    // Create an array of all cities.
    const listItemsArray = Array.from(list.querySelectorAll('.cities li'));
    if (listItemsArray.length > 0) {

        // If listItemsArray has data, filter it.
        // We are looking to see if the data being searched would be a 
        // duplicate from any previous results alreay being rendered.
        const filteredArray = listItemsArray.filter(el => {
            let content = '';
            let cityName = el.querySelector('.city-name').textContent.toLowerCase()

            content = cityName;
            return content == inputVal.toLowerCase();
            
        })
    
        // If user searched for a city already being displayed, don't 
        // display it and send a message
        if (filteredArray.length > 0) {
            msg.textContent = `${inputVal} already added! Please search for another city.`;
            msg.classList.add('visible');
            console.log('success!!')
            return
        }
        

    }
    


    // Otherwise, send a new fetch request to pull the data
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;
    fetchWeather(url);
})

// Function is called for all fetch requests
async function fetchWeather(url) {
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        // Seperate data into more usable objects
        const {main, name, weather} = data;


        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]}.svg`;
        console.log(main.temp);
        // Each city is stored as a <li>
        const li = document.createElement('li');        
        const markup = `
            <figure>
                <img src="${icon}" alt="${weather}[0]['description']}">
            </figure>
            <div>
                <h1>${main.temp}<sup>°F</sup></h1>
                <p class="city-conditions">${weather[0]['description']}</p>
                <h3 class="city-name">${name}</h3>
                <a href=forecast.html>Daily Forecast</a>
            </div>`;

        li.innerHTML = markup;
        list.appendChild(li);
        console.log(data);
        

        // If the data fails to load, send to the catch block.
        // Let user know by sending a message
    } catch (error) {
        console.error('Error fetching weather data');
        msg.textContent = 'City not found. Please try again.';
    }
}
    
