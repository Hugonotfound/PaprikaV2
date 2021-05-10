var allDWeather = document.currentScript.getAttribute('allwidgets');
var APIKEY = "5022ca1b0125aca8cc60906125fc45ba"

function getWeatherDouble(WidgetNumber, city, city2) {
    const weatherTemperature = document.getElementById('weatherTemperature1-'+WidgetNumber);
    const weatherIcon = document.getElementById('weatherIcon1-'+WidgetNumber);
    const weatherCity = document.getElementById('weatherCity1-'+WidgetNumber);
    const weatherDescription = document.getElementById('weatherDescription1-'+WidgetNumber);
    const weatherWidget = document.getElementById('weatherWidget1-'+WidgetNumber);
    const weatherTemperature2 = document.getElementById('weatherTemperature2-'+WidgetNumber);
    const weatherIcon2 = document.getElementById('weatherIcon2-'+WidgetNumber);
    const weatherCity2 = document.getElementById('weatherCity2-'+WidgetNumber);
    const weatherDescription2 = document.getElementById('weatherDescription2-'+WidgetNumber);
    const weatherWidget2 = document.getElementById('weatherWidget2-'+WidgetNumber);

    fetch('https://api.openweathermap.org/data/2.5/weather?q='+ city +'&units=metric&lang=fr&appid=' + APIKEY).then(function(response) {
            return response.json();
        }).then (function(data) {
            weatherTemperature.textContent = Math.round(data.main.temp*10)/10 + '° ';
            weatherCity.textContent = data.name + ', ' + data.sys.country;
            weatherDescription.textContent = data.weather[0].description
            weatherIcon.setAttribute("src", "/img/weather_icon/" + data.weather[0].icon + ".png");
            if (data.weather[0].icon == "01d" || data.weather[0].icon == "02d")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/sun-day.jpeg); background-size: cover;")
            if (data.weather[0].icon == "03d" || data.weather[0].icon == "04d")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/cloud-day.jpeg); background-size: cover;")
            if (data.weather[0].icon == "09d" || data.weather[0].icon == "10d" || data.weather[0].icon == "11d" || data.weather[0].icon == "13d")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/rain-day.jpeg); background-size: cover;")
            if (data.weather[0].icon == "01n" || data.weather[0].icon == "02n")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/sun-night.jpeg); background-size: cover;")
            if (data.weather[0].icon == "03n" || data.weather[0].icon == "04n")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/cloud-night.jpeg); background-size: cover;")
            if (data.weather[0].icon == "09n" || data.weather[0].icon == "10n" || data.weather[0].icon == "11n" || data.weather[0].icon == "13n")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/rain-night.jpg); background-size: cover;")
        }).catch(function(error){
            console.log(error);
        });
        fetch('https://api.openweathermap.org/data/2.5/weather?q='+ city2 +'&units=metric&lang=fr&appid=' + APIKEY).then(function(response) {
            return response.json();
        }).then (function(data) {
            weatherTemperature2.textContent = Math.round(data.main.temp*10)/10 + '° ';
            weatherCity2.textContent = data.name + ', ' + data.sys.country;
            weatherDescription2.textContent = data.weather[0].description
            weatherIcon2.setAttribute("src", "/img/weather_icon/" + data.weather[0].icon + ".png");
            if (data.weather[0].icon == "01d" || data.weather[0].icon == "02d")
                weatherWidget2.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/sun-day.jpeg); background-size: cover;")
            if (data.weather[0].icon == "03d" || data.weather[0].icon == "04d")
                weatherWidget2.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/cloud-day.jpeg); background-size: cover;")
            if (data.weather[0].icon == "09d" || data.weather[0].icon == "10d" || data.weather[0].icon == "11d" || data.weather[0].icon == "13d")
                weatherWidget2.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/rain-day.jpeg); background-size: cover;")
            if (data.weather[0].icon == "01n" || data.weather[0].icon == "02n")
                weatherWidget2.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/sun-night.jpeg); background-size: cover;")
            if (data.weather[0].icon == "03n" || data.weather[0].icon == "04n")
                weatherWidget2.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/cloud-night.jpeg); background-size: cover;")
            if (data.weather[0].icon == "09n" || data.weather[0].icon == "10n" || data.weather[0].icon == "11n" || data.weather[0].icon == "13n")
                weatherWidget2.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/rain-night.jpg); background-size: cover;")
        }).catch(function(error){
            console.log(error);
        });
}

var city = document.currentScript.getAttribute('two');
var city2 = document.currentScript.getAttribute('three');

function startLiveUpdateDouble () {
    var doubleweatherWidj = JSON.parse(allDWeather)
	doubleweatherWidj.forEach(function(widget) {
        setInterval(getWeatherDouble(widget.position, widget.param2, widget.param3), widget.param1);
	})
}

document.addEventListener('DOMContentLoaded', function() {
    startLiveUpdateDouble();
});