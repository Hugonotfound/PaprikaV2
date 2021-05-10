//const News_Key = "280b2e3ca15e4a4b8925a403e4529fa4";
const News_Key = "c07a8f1588da4119a925eb8de48eae76";
var allCalendarWidgets = document.currentScript.getAttribute('allwidgets');

function getCalendar(WidgetNumber, language, sort) {
    const NewsTitle = document.getElementById('NewsTitle-' + WidgetNumber);
    const NewsPaper = document.getElementById('NewsPaper-' + WidgetNumber);
    const NewsDate = document.getElementById('NewsDate-' + WidgetNumber);
    const NewsLink = document.getElementById('NewsLink-' + WidgetNumber);

    var link = ""

    fetch("https://cors-anywhere.herokuapp.com/" + link).then(function (response) {
        return response.json();
    }).then(function (data) {

    }).catch(function (error) {
        console.log(error);
    });
}

function StartNewsUpdate() {
    var currentCalendar = JSON.parse(allCalendarWidgets)

    currentCalendar.forEach(function (widget) {
        setInterval(getCalendar(widget.position, widget.param2, widget.param3), widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    StartNewsUpdate();
});
