
const APP_ID = '1f19bc9cecfda41bf0714f3d92a7543e';
const DEFAULT_VALUE = '--';

const searchInput = document.querySelector('#search-bar-input');
const cityName = document.querySelector('#country');
const describeWeather = document.querySelector('#describe-weather');
const temp = document.querySelector('#temp');

const sunUpTime = document.querySelector('#sunUp-time');
const sunDownTime = document.querySelector('#sunDown-time');
const humidityParameter = document.querySelector('#humidity-parameter');
const wind = document.querySelector('#wind-parameter');

searchInput.addEventListener('change', (e) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res => {
            const data = await res.json();
            console.log('[Search Input]', data);
            cityName.innerHTML = data.name || DEFAULT_VALUE;
            describeWeather.innerHTML = data.weather[0].description || DEFAULT_VALUE;
            temp.innerHTML = Math.floor(data.main.temp) || DEFAULT_VALUE;
            sunUpTime.innerHTML = moment.unix(data.sys.sunrise).format('H:mm') || DEFAULT_VALUE;
            sunDownTime.innerHTML = moment.unix(data.sys.sunset).format('H:mm') || DEFAULT_VALUE;
            humidityParameter.innerHTML = data.main.humidity || DEFAULT_VALUE;
            wind.innerHTML = (data.wind.speed * 3.6).toFixed(1) || DEFAULT_VALUE;
        });
});