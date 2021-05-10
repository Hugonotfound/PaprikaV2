//const News_Key = "280b2e3ca15e4a4b8925a403e4529fa4";
const News_Key = "c07a8f1588da4119a925eb8de48eae76";
var allNewsWidgets = document.currentScript.getAttribute('allwidgets');

function formatDateTime(date) {
    var datelist = String(date).split("-");
    var result = datelist[2].split("T")[0] + " ";

    switch (datelist[1]) {
        case "01": result += "Janvier"; break;
        case "02": result += "Fevrier"; break;
        case "03": result += "Mars"; break;
        case "04": result += "Avril"; break;
        case "05": result += "Mai"; break;
        case "06": result += "Juin"; break;
        case "07": result += "Juillet"; break;
        case "08": result += "Aout"; break;
        case "09": result += "Septembre"; break;
        case "10": result += "Octobre"; break;
        case "11": result += "Novembre"; break;
        case "12": result += "Décembre"; break;
    }
    result += " " + datelist[0] + " - ";
    result += String(datelist[2]).split("T")[1].split(":")[0] + "h";
    result += String(datelist[2]).split("T")[1].split(":")[1];
    result = result.replace("Z", "");
    return result;
}

function getNews(WidgetNumber, language, sort) {
    const NewsTitle = document.getElementById('NewsTitle-' + WidgetNumber);
    const NewsPaper = document.getElementById('NewsPaper-' + WidgetNumber);
    const NewsDate = document.getElementById('NewsDate-' + WidgetNumber);
    const NewsLink = document.getElementById('NewsLink-' + WidgetNumber);
    const NewsTitle2 = document.getElementById('NewsTitle2-' + WidgetNumber);
    const NewsPaper2 = document.getElementById('NewsPaper2-' + WidgetNumber);
    const NewsDate2 = document.getElementById('NewsDate2-' + WidgetNumber);
    const NewsLink2 = document.getElementById('NewsLink2-' + WidgetNumber);

    var subject = document.getElementById('SearchNews-' + WidgetNumber).value;

    subject = String(subject).replace(" ", "%20");
    fetch("https://cors-anywhere.herokuapp.com/" + "http://newsapi.org/v2/everything?q=" + subject + "&language=" + language + "&sortBy=" + sort + "&apiKey=" + News_Key).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data.totalResults < 1) {
            NewsTitle.textContent = "Je n'ai rien trouvé";
            NewsPaper.textContent = "";
            NewsDate.textContent = "";
            NewsLink.setAttribute("href", "");
            NewsTitle2.textContent = "";
            NewsPaper2.textContent = "";
            NewsDate2.textContent = "";
            NewsLink2.setAttribute("href", "");
            return;
        }
        NewsTitle.textContent = data.articles[0].title.substring(0, 40) + "...";
        NewsPaper.textContent = data.articles[0].description.substring(0, 80) + "...";
        NewsDate.textContent = formatDateTime(String(data.articles[0].publishedAt)) + " from " + data.articles[0].source.name;
        NewsLink.setAttribute("href", data.articles[0].url);
        if (data.totalResults < 2) {
            NewsTitle2.textContent = "";
            NewsPaper2.textContent = "";
            NewsDate2.textContent = "";
            NewsLink2.setAttribute("href", "");
            return;
        }

        NewsTitle2.textContent = data.articles[1].title;
        NewsPaper2.textContent = data.articles[1].description.substring(0, 50) + "...";
        NewsDate2.textContent = formatDateTime(String(data.articles[1].publishedAt)) + " from " + data.articles[1].source.name;
        NewsLink2.setAttribute("href", data.articles[1].url);
    }).catch(function (error) {
        console.log(error);
    });
}

function StartNewsUpdate() {
    var currentNewsWidget = JSON.parse(allNewsWidgets)

    currentNewsWidget.forEach(function (widget) {
        setInterval(getNews(widget.position, widget.param2, widget.param3), widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    StartNewsUpdate();
});
