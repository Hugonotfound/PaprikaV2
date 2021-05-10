var alldigitwidg = document.currentScript.getAttribute('allwidgets');

function updateClock(Setting, WidgetNumber){
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear(),
        hou = now.getHours(),
        min = now.getMinutes(),
        sec = now.getSeconds(),
        pe = "";
        
        if (Setting == 12) {
          if(hou >= 12){
            pe = "PM";
          } else
            pe = "AM"
          if(hou == 0){
            hou = 12;
          }
          if(hou > 12){
            hou = hou - 12;
          }
        }

        Number.prototype.pad = function(digits){
          for(var n = this.toString(); n.length < digits; n = 0 + n);
          return n;
        }

        var months = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        var week = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"];
        var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), sec.pad(2), pe];
        for(var i = 0; i < ids.length; i++)
        document.getElementById(ids[i]+'-'+WidgetNumber).firstChild.nodeValue = values[i];
  }

function initClock(){
    var DigitWidg = JSON.parse(alldigitwidg)
    DigitWidg.forEach(function(widget) {
      updateClock(widget.param1, widget.position);
      window.setInterval("updateClock("+widget.param1+","+widget.position+")", 1000);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    initClock();
});