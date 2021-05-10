var allMovieSerchWidgets = document.currentScript.getAttribute('allwidgets');

var id = "15570"
const Movie_Key = "74a58d4da28fffdccf266070824b66be";

function formatDate(date) {
    var datelist = String(date).split("-");
    var result = datelist[2] + " ";

    switch(datelist[1]) {
        case "01": result += "Janvier";   break;
        case "02": result += "Fevrier";   break;
        case "03": result += "Mars";      break;
        case "04": result += "Avril";     break;
        case "05": result += "Mai";       break;
        case "06": result += "Juin";      break;
        case "07": result += "Juillet";   break;
        case "08": result += "Aout";      break;
        case "09": result += "Septembre"; break;
        case "10": result += "Octobre";   break;
        case "11": result += "Novembre";  break;
        case "12": result += "Décembre";  break;
    }
    result += " " + datelist[0];
    return result;
}

function getMovie(WidgetNumber, param2) {
    const FindMovieName = document.getElementById('FindMovieName-' + WidgetNumber);
    const FindMovieRate = document.getElementById('FindMovieRate-' + WidgetNumber);
    const FindMovieDate = document.getElementById('FindMovieDate-' + WidgetNumber);
    const FindMovieDescr = document.getElementById('FindMovieDescr-' + WidgetNumber);
    const FindMovieBackground = document.getElementById('FindMovieWidget-' + WidgetNumber);
    var FilmName = document.getElementById('SearchNewFilm-' + WidgetNumber).value;

    if (FilmName == null || FilmName === undefined)
        FilmName = "Tout nous sépare";
    FilmName = String(FilmName).replace(" ", "%20");
    fetch("https://api.themoviedb.org/3/search/" + (param2 == 1 ? "movie" : "tv") + "?api_key=" + Movie_Key + "&query=" + FilmName).then(function(response) {
        return response.json();
    }).then (function(data) {
        console.debug(data);
        if (data.total_results < 1)
            return;
        FindMovieName.textContent = (param2 == 1 ? String(data.results[0].title) : String(data.results[0].name));
        FindMovieDescr.textContent = String(data.results[0].overview);
        FindMovieRate.textContent = String(data.results[0].vote_average) + "⭐️ / 10";
        FindMovieDate.textContent = formatDate(String(data.results[0].release_date));
        FindMovieBackground.setAttribute("style", "background: linear-gradient( rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4) ), url(https://image.tmdb.org/t/p/original" + String(data.results[0].backdrop_path) + "); background-size: cover;")
    }).catch(function(error){
        console.log(error);
    });
}

function StartMovieUpdate () {
    var currentMovieyWidg = JSON.parse(allMovieSerchWidgets)

    currentMovieyWidg.forEach(function(widget) {
        setInterval(getMovie(widget.position, widget.param2), widget.param1);
	})
}

document.addEventListener('DOMContentLoaded', function() {
    StartMovieUpdate();
});
