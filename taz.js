//initiate variables
var tazs;
var layerOptions = null;

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


var colorramp = ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'];

/*
var pct = 33;
if (pct >=0 && pct <= 20) {
    color = colorramp[0];
} else if (pct >20 && pct <=40) {
    color = colorramp[1];
} else if (pct >40 && pct <=60) {
    color = colorramp[2];
} else if (pct >60 && pct <=80) {
    color = colorramp[3];
} else {
    color = colorramp[4];
}

console.log(color);
*/

function style(feature) {
    
    var pct = feature.properties['drive_alone_am'];
    var color;
    if (pct >=0 && pct <= 20) {
        color = colorramp[0];
    } else if (pct >20 && pct <=40) {
        color = colorramp[1];
    } else if (pct >40 && pct <=60) {
        color = colorramp[2];
    } else if (pct >60 && pct <=80) {
        color = colorramp[3];
    } else {
        color = colorramp[4];
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

var tazs = L.geoJson(dataset, layerOptions); 
map.addLayer(tazs);