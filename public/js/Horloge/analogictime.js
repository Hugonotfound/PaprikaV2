var allanalowidgets = document.currentScript.getAttribute('allwidgets');

function updateAnalogClock(WidgetNumber){
	var secDiv = document.getElementById('sec-'+WidgetNumber);
	var minDiv = document.getElementById('min-'+WidgetNumber);
	var hourDiv = document.getElementById('hours-'+WidgetNumber);
	
	var days = document.getElementById('dayname1-'+WidgetNumber);
	var months = document.getElementById('month1-'+WidgetNumber);
	var years = document.getElementById('year1-'+WidgetNumber);
  	let date = new Date();
	let sec = date.getSeconds() / 60;
	let min = (date.getMinutes() + sec) / 60;
	let hours = (date.getHours() + min) / 12;

	secDiv.style.transform = "rotate(" + (sec * 360) + "deg)";
	minDiv.style.transform = "rotate(" + (min * 360) + "deg)";
	hourDiv.style.transform = "rotate(" + (hours * 360) + "deg)";

	let dname = date.getDay()
	let mo = date.getMonth()
	let dnum = date.getDate()
	let yr = date.getFullYear()

	var months1 = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
	var week1 = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

	days.textContent = week1[dname] + ' ' + dnum;
	months.textContent = months1[mo];
	years.textContent = yr;
}

function initClockAnalog(){
	var analoWidg = JSON.parse(allanalowidgets)
	analoWidg.forEach(function(widget) {
		updateAnalogClock(widget.position);
		window.setInterval("updateAnalogClock("+widget.position+")", 1000);
	})
}

document.addEventListener('DOMContentLoaded', function() {
	initClockAnalog();
});