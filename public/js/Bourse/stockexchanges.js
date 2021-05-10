var allStockswidg = document.currentScript.getAttribute('allwidgets');

function searchStocks(theLink, theRealSymbol, theStockName, theRealStocValue, theStockDiff, theKey) {
    fetch(theLink).then(function(response) {
        return response.json();
    }).then (function(data) {
        console.log( "SarchStocks" + data.hasOwnProperty('Note'));
        if (data.hasOwnProperty('Note'))
            return;
        theRealSymbol.textContent = Object.values(data)[0][0]["1. symbol"]
        theStockName.textContent = Object.values(data)[0][0]["2. name"]
        getStocks(Object.values(data)[0][0]["1. symbol"], theRealStocValue, theStockDiff, theKey);
    }).catch(function(error){
        console.log(error);
    });
}

function getStocks(theSymbol, theStockValue, theStockDiff, theKey) {
    fetch("https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + theSymbol + "&interval=5min&apikey=" + theKey).then(function(response) {
        return response.json();
    }).then (function(data) {
        if (data.hasOwnProperty('Note'))
            return;
        theStockValue.textContent = (Math.round(Object.values(data)[0]["05. price"]*100)/100) + " USD";
        var diff = parseFloat(Object.values(data)[0]["09. change"])
        if (diff < 0)
            theStockDiff.setAttribute("style", "color: red;")
        else
            theStockDiff.setAttribute("style", "color: green;")
        theStockDiff.textContent = (Math.round(Object.values(data)[0]["09. change"]*100)/100) + "%"
    }).catch(function(error){
        console.log(error);
    });
}

function haveAllStocks(callStock1, callStock2, WidgetNumber) {
    var link1 = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+ callStock1 +"&apikey=3FEHXY3G3TDYYRV6"
    var link2 = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+ callStock2 +"&apikey=69UUVL8MTRRU8LIW"

    //--------

    var stock1symbol = document.getElementById('stockSymbol1-'+WidgetNumber);
    var stock1name = document.getElementById('stockName1-'+WidgetNumber);
    var stock1value = document.getElementById('stockValue1-'+WidgetNumber);
    var stock1diff = document.getElementById('stockDiff1-'+WidgetNumber);

    //--------
    var stock2symbol = document.getElementById('stockSymbol2-'+WidgetNumber);
    var stock2name = document.getElementById('stockName2-'+WidgetNumber);
    var stock2value = document.getElementById('stockValue2-'+WidgetNumber);
    var stock2diff = document.getElementById('stockDiff2-'+WidgetNumber);

    searchStocks(link1, stock1symbol, stock1name, stock1value, stock1diff, "XS6UJFJPN52SPFS2");
    searchStocks(link2, stock2symbol, stock2name, stock2value, stock2diff, "YN5160TIE0V2TC7O");
}

function StartStockUpdate () {
    var StocksWidj = JSON.parse(allStockswidg)
    StocksWidj.forEach(function(widget) {
        setInterval(haveAllStocks(widget.param1, widget.param2, widget.position), 600000);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    StartStockUpdate();
});