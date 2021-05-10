var allwidgets = document.currentScript.getAttribute('allwidgets');
var APIKEY = "5022ca1b0125aca8cc60906125fc45ba"

function getWeatherSingle(cityone, WidgetNumber) {
    var weatherTemperature = document.getElementById('weatherTemperature-'+WidgetNumber);
    var weatherIcon = document.getElementById('weatherIcon-'+WidgetNumber);
    var weatherCity = document.getElementById('weatherCity-'+WidgetNumber);
    var weatherDescription = document.getElementById('weatherDescription-'+WidgetNumber);
    var weatherWidget = document.getElementById('weatherWidget-'+WidgetNumber);

    fetch('https://api.openweathermap.org/data/2.5/weather?q='+ cityone +'&units=metric&lang=fr&appid=' + APIKEY).then(function(response) {
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
}


function startLiveUpdateSingle () {
    var newAll = JSON.parse(allwidgets)
    newAll.forEach(function(widget) {
        setInterval(getWeatherSingle(widget.param2, widget.position), widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    startLiveUpdateSingle();
});