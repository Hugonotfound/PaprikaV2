var allWeekWeather = document.currentScript.getAttribute('allwidgets');
var APIKEY = "5022ca1b0125aca8cc60906125fc45ba"

function setDataWeekWeather(description, icon, i, data) {
    var weatherDescription = document.getElementById(description);
    var weatherIcon = document.getElementById(icon);
    weatherDescription.textContent = data.daily[i].weather[0].description + ' - ' + Math.round(data.daily[i].temp.day*10)/10 + '° '
    weatherIcon.setAttribute("src", "/img/weather_icon/" + data.daily[i].weather[0].icon + ".png");
}

function getWeatherWeek(latitude, longitude, WidgetNumber) {
    var weatherTemperature = document.getElementById('weekWeatheTemperature1-'+WidgetNumber);
    var weatherIcon = document.getElementById('weekWeatherIcon1-'+WidgetNumber);
    var weatherCity = document.getElementById('weekWeatherCity1-'+WidgetNumber);
    var weatherDescription = document.getElementById('weekWeatherDescription1-'+WidgetNumber);
    var weatherWidget = document.getElementById('weekWeatherWidget1-'+WidgetNumber);

    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ latitude + '&lon=' + longitude + '&units=metric&lang=fr&exclude=current,minutely,hourly,alerts&appid=' + APIKEY).then(function(response) {
            return response.json();
        }).then (function(data) {
            weatherTemperature.textContent = Math.round(data.daily[0].temp.day*10)/10 + '° ';
            weatherCity.textContent = data.lat + ' / ' + data.lon;
            weatherDescription.textContent = data.daily[0].weather[0].description
            weatherIcon.setAttribute("src", "/img/weather_icon/" + data.daily[0].weather[0].icon + ".png");
            if (data.daily[0].weather[0].icon == "01d" || data.daily[0].weather[0].icon == "02d")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/sun-day.jpeg); background-size: cover;")
            if (data.daily[0].weather[0].icon == "03d" || data.daily[0].weather[0].icon == "04d")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/cloud-day.jpeg); background-size: cover;")
            if (data.daily[0].weather[0].icon == "09d" || data.daily[0].weather[0].icon == "10d" || data.daily[0].weather[0].icon == "11d" || data.daily[0].weather[0].icon == "13d")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/rain-day.jpeg); background-size: cover;")
            if (data.daily[0].weather[0].icon == "01n" || data.daily[0].weather[0].icon == "02n")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/sun-night.jpeg); background-size: cover;")
            if (data.daily[0].weather[0].icon == "03n" || data.daily[0].weather[0].icon == "04n")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/cloud-night.jpeg); background-size: cover;")
            if (data.daily[0].weather[0].icon == "09n" || data.daily[0].weather[0].icon == "10n" || data.daily[0].weather[0].icon == "11n" || data.daily[0].weather[0].icon == "13n")
                weatherWidget.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2) ), url(/img/weather_background/rain-night.jpg); background-size: cover;")

            setDataWeekWeather('weekWeatherDescription2-'+WidgetNumber, 'weekWeatherIcon2-'+WidgetNumber, 1, data)
            setDataWeekWeather('weekWeatherDescription3-'+WidgetNumber, 'weekWeatherIcon3-'+WidgetNumber, 2, data)
            setDataWeekWeather('weekWeatherDescription4-'+WidgetNumber, 'weekWeatherIcon4-'+WidgetNumber, 3, data)
            setDataWeekWeather('weekWeatherDescription5-'+WidgetNumber, 'weekWeatherIcon5-'+WidgetNumber, 4, data)
        }).catch(function(error){
            console.log(error);
        });
}


function startLiveUpdateWeek () {
    var allWeWeather = JSON.parse(allWeekWeather)
    allWeWeather.forEach(function(widget) {
        setInterval(getWeatherWeek(widget.param2, widget.param3, widget.position), widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    startLiveUpdateWeek();
});