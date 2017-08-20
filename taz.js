//initiate variables
var tazs;
var layerOptions = null;
var timevar = 'am'; //start map with am
var modevar = 'bike'; //start map bike
var legend;

// Create variable to hold map element, give initial settings to map
var map = L.map('map', { center: [37.763317, -122.443445], zoom: 12, renderer: L.canvas()});

// Add Tile Layer

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmdvZ2dpbiIsImEiOiJjajB1anhqbDAwM2tyMnFscnRtbjQyeTZ0In0.ub1etlqSKPNxMYPTaKLy9w', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(map);
/*
//add tile layer basemap to the map
var basemapUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
var basemapAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';
var basemapProperties = {minZoom: 2, maxZoom: 16, attribution: basemapAttribution};
var basemap = L.tileLayer(basemapUrl, basemapProperties);
map.addLayer(basemap);*/

var colorramp = {0: {'label': '0%&ndash;20%', 'color': '#fee5d9'}, 1: {'label': '20%&ndash;40%', 'color': '#fcae91'}, 2: {'label': '40%&ndash;60%', 'color': '#fb6a4a'}, 3: {'label': '60%&ndash;80%', 'color': 
'#de2d26'}, 4: {'label': '80%&ndash;100%', 'color': '#a50f15'}};


function style(feature) {
    
    var pct = feature.properties[modevar+'_'+timevar];
    var color;
    if (pct >=0 && pct <= 20) {
        color = colorramp[0].color;
    } else if (pct >20 && pct <=40) {
        color = colorramp[1].color;
    } else if (pct >40 && pct <=60) {
        color = colorramp[2].color;
    } else if (pct >60 && pct <=80) {
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

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.7
    });

	// do not perform web highlighting in the given web browsers
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    tazs.resetStyle(e.target);
	//info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
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

info = L.control({position: 'topleft'});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML =  title + menu1 + "</br>" + menu2 + "</br>" + button;
    return this._div;
};

info.addTo(map);

//add legend
function keys(myObj) {//extract keys from obj
    var ks = [];
    for (var k in myObj) {if (myObj.hasOwnProperty(k)) {ks.push(k);}}
    return ks;
}

legend = L.control({position: 'bottomleft'});
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
}

var tazs = L.geoJson(dataset, layerOptions); 
map.addLayer(tazs);