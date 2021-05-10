var allSickWidgets = document.currentScript.getAttribute('allwidgets');

function reverseString(str) {
    return str.split("").reverse().join("");
}

function formatNumbers(number) {
    var result = "";
    var temp = reverseString(String(number));

    for (var i = 0; i < temp.length; i++) {
        if (i % 3 == 0 && i != 0)
            result += "."
        result += temp[i];
    }
    return reverseString(result);
}

function getSickness(WidgetNumber, country) {
    const SicknessDead = document.getElementById('SicknessDead-' + WidgetNumber);
    const SicknessHill = document.getElementById('SicknessHill-' + WidgetNumber);
    const SicknessDate = document.getElementById('SicknessDate-' + WidgetNumber);
    const SicknessHealed = document.getElementById('SicknessHealed-' + WidgetNumber);
    const SicknessRegion = document.getElementById('SicknessRegion-' + WidgetNumber);
    var link = "https://covid-api.com/api/reports?q=" + country;
    if (country == null || country == "") {
        link = "https://covid-api.com/api/reports/total";
        fetch(link).then(function (response) {
            return response.json();
        }).then(function (data) {
            SicknessHill.textContent = formatNumbers(data.data.active);
            SicknessDead.textContent = formatNumbers(data.data.deaths);
            SicknessHealed.textContent = formatNumbers(data.data.recovered);
            SicknessDate.textContent = data.data.last_update;
            SicknessRegion.textContent = "Worldwide"
        }).catch(function (error) {
            console.log(error);
        });
        return;
    }

    fetch(link).then(function (response) {
        return response.json();
    }).then(function (data) {
        SicknessHill.textContent = formatNumbers(data.data[0].active);
        SicknessDead.textContent = formatNumbers(data.data[0].deaths);
        SicknessHealed.textContent = formatNumbers(data.data[0].recovered);
        SicknessDate.textContent = data.data[0].last_update;
        SicknessRegion.textContent = data.data[0].region.name + ", " + data.data[0].region.province;
    }).catch(function (error) {
        console.log(error);
    });
}

function StartSickUpdate() {
    var currenSick = JSON.parse(allSickWidgets);

    currenSick.forEach(function (widget) {
        setInterval(getSickness(widget.position, widget.param2), widget.param1);
    })
}

document.addEventListener('DOMContentLoaded', function () {
    StartSickUpdate();
});
