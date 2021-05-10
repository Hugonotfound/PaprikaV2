var user = document.currentScript.getAttribute('user');
var allEpitechWidjets = document.currentScript.getAttribute('allwidgets');

async function functiontest(link) {
    var reponse = await fetch(link);

    console.debug(reponse);
    if (reponse.status == 200)
        return await reponse.json();
    return null;
}

function getEpitech(widgetposition, Theuser, link) {
    const GPA = document.getElementById('GPA-' + widgetposition);
    const Name = document.getElementById('EpitechName-' + widgetposition);
    const TechIcon = document.getElementById('TechIcon-' + widgetposition);
    const Credits = document.getElementById('EpitechCredits-' + widgetposition);
    const EpitechPromo = document.getElementById('EpitechPromo-' + widgetposition);

    var reponse = functiontest(link);

    if (reponse == null)
        return;
    reponse.then(function(data) {
        console.log(data);
        Name.textContent = data.title;
        GPA.textContent = "GPA: " + data.gpa[0].gpa;
        Credits.textContent = "Crédits: " + data.credits;
        EpitechPromo.textContent = "Promo - " + data.promo;
    }).catch(function(error){
        console.log(error);
    });
}

function StartEpitechUpdate() {
    var myuser = JSON.parse(user);
    var EpitechWidj = JSON.parse(allEpitechWidjets);

	EpitechWidj.forEach(function(widget) {
        var link = "https://cors-anywhere.herokuapp.com/" + widget.param2 + '/user/' + widget.param3 + '/?format=json';

        setInterval(getEpitech(widget.position, myuser, link), widget.param1);
	})
}

document.addEventListener('DOMContentLoaded', function() {
    StartEpitechUpdate();
});