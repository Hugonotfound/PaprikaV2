var allPingWidget = document.currentScript.getAttribute('allwidgets');

function formatLinkName(link) {
    result = String(link);

    result = result.replace("https://", "");
    result = result.replace("http://", "");
    result = result.replace("cors-anywhere.herokuapp.com/", "");
    result = result.replace(".com", "");
    result = result.replace(".net", "");
    result = result.replace(".org", "");
    result = result.replace(".eu", "");
    result = result.replace(".fr", "");
    result = result.charAt(0).toUpperCase() + result.slice(1) + " :";
    return result;
}

function getServerStatus(WidgetNumber, site1, site2) {
    console.log("Pinging :-)")
    const ServerName = document.getElementById('ServerName-' + WidgetNumber);
    const ServerStatus = document.getElementById('ServerStatus-' + WidgetNumber);
    const ServerName2 = document.getElementById('ServerName2-' + WidgetNumber);
    const ServerStatus2 = document.getElementById('ServerStatus2-' + WidgetNumber);
    var link = "https://cors-anywhere.herokuapp.com/"

    fetch(link + site1).then(function(response) {
        return response.status;
    }).then (function(status) {
        ServerName.textContent = formatLinkName(site1);
        ServerStatus.textContent = (status == 200 ? "Up ✅" : "Down ❌");
    }).catch(function(error){
//        console.log(error);
    });

    fetch(link + site2).then(function(response) {
        return response.status;
    }).then (function(status) {
        ServerName2.textContent = formatLinkName(site2);
        ServerStatus2.textContent = (status == 200 ? "Up ✅" : "Down ❌");
    }).catch(function(error){
//        console.log(error);
    });
}

function StartServerUpdate () {
    var pingwidg = JSON.parse(allPingWidget);

    pingwidg.forEach(function(widget) {
        getServerStatus(widget.position, widget.param2, widget.param3);
        window.setInterval("getServerStatus(\""+widget.position+"\",\""+widget.param2+"\",\""+widget.param3+"\")", widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    StartServerUpdate();
});
