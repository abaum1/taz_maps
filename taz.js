//initiate variables
var tazs;
var layerOptions = null;
var timevar = 'am'; //start map with am
var modevar = 'bike'; //start map bike
var legend;

// Create variable to hold map element, give initial settings to map
var map = L.map('map', { center: [37.763317, -122.443445], zoom: 12});

// Add Tile Layer
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmdvZ2dpbiIsImEiOiJjajB1anhqbDAwM2tyMnFscnRtbjQyeTZ0In0.ub1etlqSKPNxMYPTaKLy9w', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(map);


var colorramp = {0: {'label': '0%&ndash;15%', 'color': '#fee5d9'}, 1: {'label': '15%&ndash;30%', 'color': '#fcae91'}, 2: {'label': '30%&ndash;45%', 'color': '#fb6a4a'}, 3: {'label': '45%&ndash;60%', 'color': 
'#de2d26'}, 4: {'label': '60%&ndash;100%', 'color': '#a50f15'}};


function style(feature) {
    
    var pct = feature.properties[modevar+'_'+timevar];
    var color;
    if (pct >=0 && pct <= 15) {
        color = colorramp[0].color;
    } else if (pct >15 && pct <=30) {
        color = colorramp[1].color;
    } else if (pct >30 && pct <=45) {
        color = colorramp[2].color;
    } else if (pct >45 && pct <=60) {
        color = colorramp[3].color;
    } else {
        color = colorramp[4].color;
    }
        
    return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: 'black',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    
    var layer = e.target;
    var latlng = layer._latlng;
    
    var center = layer.getBounds().getCenter();
    
    //highlight layer
    layer.setStyle({
        weight: 5
    });

	// do not perform web highlighting in the given web browsers
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    var layer = e.target;
    tazs.resetStyle(e.target);
    info.update();
}

//on click, pan/zoom to feature and show popup
function clickFeature(e) {
    var target = e.target;
    var props = target.feature.properties;
    moreinfo.update(props);
}

function onEachFeature(feature, layer) {
    layer.on({
        mousemove: highlightFeature,
        mouseout: resetHighlight,
        click: clickFeature
    });
}

layerOptions = {
	style: style, onEachFeature: onEachFeature
};


//Add Selection Menu
//Create popup control for when hovering over polygon

var menu1 = '<select id="timeSelect">' +
'<option value="am">AM</option>' + 
'<option value="ea">EA</option>' +
'<option value="md">MD</option>' +
'<option value="ev">EV</option>' +
'<option value="pm">PM</option>' +
'</select>';

var menu2 = '<select id="modeSelect">' +
'<option value="bike">Bike</option>' + 
'<option value="drive_alone">Drive Alone</option>' +
'<option value="shared_ride_2">Shared Ride 2</option>' +
'<option value="shared_ride_3">Shared Ride 3</option>' +
'<option value="taxi">Taxi</option>' +
'<option value="transit">Transit</option>' +
'<option value="truck">Truck</option>' +
'<option value="walk">Walk</option>' +
'</select>';

var button = '<button onclick="updateMap();">Update Map</button>';

//Define Title
var title = '<h4>SF Trip Estimates</h4>';

menu = L.control({position: 'topleft'});

menu.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML =  title + "Time of Day: </br>" + menu1 + "</br>" + "Mode: </br>" + menu2 + "</br>" + button;
    return this._div;
};

menu.addTo(map);

var info = L.control({position: 'topleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML =  "<div id = 'updates'>Hover over a region to see figures</div>";
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    if ($.isEmptyObject(props)) {
        this._div.childNodes[0].innerHTML = "<div id = 'updates'>Hover over a region to see trip origins</div>";
    } else {
        var variable = modevar+'_'+timevar;
    	this._div.childNodes[0].innerHTML = "Percentage of Person Trips: " + props[variable] + "%";
    }
};

info.addTo(map);

var moreinfo = L.control({position: 'topleft'});

moreinfo.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML =  "<div id = 'updates'>Click to a region see trip destinations</div>";
    return this._div;
};

moreinfo.addTo(map);

// method that we will use to update the control based on feature properties passed
moreinfo.update = function (props) {
    var mode;
    var time;
    if (modevar== 'walk') {
        mode = 'Walking'
    } else if (modevar == 'bike') {
        mode = 'Biking'
    } else if (modevar == 'drive_alone') {
        mode = 'Drive Alone'
    } else if (modevar == 'shared_ride_2') {
        mode = 'Drive 2 People'
    } else if (modevar == 'shared_ride_3') {
        mode = 'Drive 3 People' 
    } else if (modevar == 'taxi') {
        mode = 'Taxi'
    } else if (modevar == 'transit') {
        mode = 'Transit'
    } else if (modevar == 'truck') {
        mode = 'Truck'
    }
    
    if (timevar == 'am') {
        time = 'AM'
    } else if (timevar == 'ea') {
        time = 'EA'
    } else if (timevar == 'md') {
        time = 'MD'
    } else if (timevar == 'ev') {
        time = 'EV'
    } else if (timevar == 'pm') {
        time = 'PM'
    }
    
    if ($.isEmptyObject(props)) {
        this._div.childNodes[0].innerHTML = 'Click on a region to see trip destinations';
    } else {
        this._div.childNodes[0].innerHTML = "<div id = 'updates'><b>In depth info about "+ mode + " " + time + " trips in " + props['FULLNAME']+":</b></div>";
        this._div.childNodes[0].innerHTML +="Percentage of Regionwide " + mode + " " + time + " Trips: " + props[modevar+'_'+timevar+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br><br><b>Percentage of these trips going to:</b>";
        this._div.childNodes[0].innerHTML +="<br>1. Downtown: "+ props[modevar+'_'+timevar+'_'+'1'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>2. SoMa: "+ props[modevar+'_'+timevar+'_'+'2'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>3. N. Beach/Chinatown: "+ props[modevar+'_'+timevar+'_'+'3'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>4. Western Market: "+ props[modevar+'_'+timevar+'_'+'4'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>5. Mission/Potrero: "+ props[modevar+'_'+timevar+'_'+'5'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>6. Noe/Glen/Bernal: "+ props[modevar+'_'+timevar+'_'+'6'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>7. Marina/N. Heights: "+ props[modevar+'_'+timevar+'_'+'7'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>8. Richmond: "+ props[modevar+'_'+timevar+'_'+'8'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>9. Bayshore: "+ props[modevar+'_'+timevar+'_'+'9'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>10. Outer Mission: "+ props[modevar+'_'+timevar+'_'+'10'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>11. Hill Districts: "+ props[modevar+'_'+timevar+'_'+'11'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>12. Sunset: "+ props[modevar+'_'+timevar+'_'+'12'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>13. Islands: "+ props[modevar+'_'+timevar+'_'+'13'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>14. South Bay: "+ props[modevar+'_'+timevar+'_'+'14'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>15. East Bay: "+ props[modevar+'_'+timevar+'_'+'15'+'_'+'pct'] + "%";
        this._div.childNodes[0].innerHTML +="<br>16. North Bay: "+ props[modevar+'_'+timevar+'_'+'16'+'_'+'pct'] + "%";
    }
};

//add legend
function keys(myObj) {//extract keys from obj
    var ks = [];
    for (var k in myObj) {if (myObj.hasOwnProperty(k)) {ks.push(k);}}
    return ks;
}

legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var title = 'Percentage of Person Trips';
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<h4>' + title + '</h4>';
    
    //loop from high to low to put legend ranges in descending order
    for (var i=keys(colorramp).length-1; i>=0; i--) { 
        div.innerHTML += '<i style="background:' + colorramp[i].color + '"></i> ' + colorramp[i].label + '<br>';
    }
    return div;
};
legend.addTo(map);//end of legend creation

function updateMap() {
    timevar = document.getElementById("timeSelect").value;
    modevar = document.getElementById("modeSelect").value;
	map.removeLayer(tazs);
	tazs = L.geoJson(dataset, layerOptions); 
	map.addLayer(tazs);
    moreinfo.update();
}

tazs = L.geoJson(dataset, layerOptions); 
map.addLayer(tazs);