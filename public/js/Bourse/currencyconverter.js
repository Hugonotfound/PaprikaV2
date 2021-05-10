var allCurencyWidgets = document.currentScript.getAttribute('allwidgets');
var Key = "cf0976650df462658738"
var covertbase = [];


function getConverter(deviseOne, deviseTwo, WidgetNumber) {
    var link = "https://free.currconv.com/api/v7/convert?q=" + deviseOne + "_" + deviseTwo + "&compact=ultra&apiKey=" + Key;
    var currency1 = document.getElementById('ConverterDataFirst-'+WidgetNumber);
    var symbol1 = document.getElementById('ConverterSymbolFirst-'+WidgetNumber);
    var currency2 = document.getElementById('ConverterDataSecond-'+WidgetNumber);
    var symbol2 = document.getElementById('ConverterSymbolSecond-'+WidgetNumber);
    console.log(link);

    fetch(link).then(function (response) {
        return response.json()
    }).then(function (data) {
        symbol1.textContent = deviseOne;
        symbol2.textContent = deviseTwo;
        covertbase[WidgetNumber] = Object.values(data)[0];
        currency2.textContent = (parseInt(currency1.value) * parseFloat(covertbase[WidgetNumber])).toString()
    }).catch(function (error) {
        console.log(error);
    });
}


function updateCurrency(WidgetNumber) {
    var currency1 = document.getElementById('ConverterDataFirst-'+WidgetNumber);
    var currency2 = document.getElementById('ConverterDataSecond-'+WidgetNumber);

    currency2.textContent = (parseInt(currency1.value) * parseFloat(covertbase[WidgetNumber])).toString()
}

function startConverter() {
    var currencyWidg = JSON.parse(allCurencyWidgets)

	currencyWidg.forEach(function(widget) {
        setInterval(getConverter(widget.param2, widget.param3, widget.position), widget.param1);
	})
}

document.addEventListener('DOMContentLoaded', function () {
    startConverter();
});


