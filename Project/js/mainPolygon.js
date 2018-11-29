//global variables
var osm = L.tileLayer(
 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 maxZoom: 18,
 attribution: 'Map data © \
 <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
 });


//Flooding update values
 $.ajax({
  type: "POST",
  url: "php/updateFlood.php"
}).done(function( msg ) {
  alert( "Data Saved: " + msg );
});



// henter bygnings polygoner
var riskByg = new L.geoJson(null, {
	style: function (feature) {
		return {
			color: 'green',
			weight: 2,
			opacity: 1
		};
	},
	onEachFeature: function (feature, layer) {
	  if (feature.properties) {
	    var content = '<table border="1" style="border-collapse:collapse;" cellpadding="2">' +
        '<tr>' + '<th>AtRisk</th>' + '<td>' + feature.properties.inters + '</td>' + '</tr>' +
        '<tr>' + '<th>Name</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<tr>' + '<th>Address</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<tr>' + '<th>Town</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<table>';
	    layer.bindPopup(content);
	  }
	}
});

$.getJSON("php/getBygData.php", function (data) {
  riskByg.addData(data);
});

// henter BluespotsPolygoner
var bs = new L.geoJson(null, {
	style: function (feature) {
		return {
			color: 'blue',
			weight: 2,
			opacity: 1
		};
	},
	onEachFeature: function (feature, layer) {
	  if (feature.properties) {
	    var content = '<table border="1" style="border-collapse:collapse;" cellpadding="2">' +
        '<tr>' + '<th>ID</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<tr>' + '<th>Name</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<tr>' + '<th>Address</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<tr>' + '<th>Town</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
        '<table>';
	    layer.bindPopup(content);
	  }
	}
});

$.getJSON("php/getBluespot.php",function (data) {
  bs.addData(data);

  var bspkt = L.geoJson(data,{
    pointToLayer: function(feature,latlng){
      return L.circleMarker(latlng, geojsonMarkerOptions);
      var bsmarker = L.marker(latlng);
      return bsmarker;
    },

    onEachFeature: function (feature, layer) {
  	  if (feature.properties) {
  	    var content = '<table border="1" style="border-collapse:collapse;" cellpadding="2">' +
          '<tr>' + '<th>AtRisk</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<tr>' + '<th>Name</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<tr>' + '<th>Address</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<tr>' + '<th>Town</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<table>';
  	    layer.bindPopup(content);
  	  }
  	}
  });


  window.onload=function(){

  var markerClusterLayer = L.markerClusterGroup({
      disableClusteringAtZoom: 13
    }).addTo(map);

  // Create a new vector type with getLatLng and setLatLng methods.
  L.PolygonClusterable = L.Polygon.extend({
    _originalInitialize: L.Polygon.prototype.initialize,

    initialize: function (bounds, options) {
      this._originalInitialize(bounds, options);
      this._latlng = this.getBounds().getCenter();
    },

    getLatLng: function () {
      return this._latlng;
    },

    // dummy method.
    setLatLng: function () {}
  });

  // Add vectors of the new type directly to MCG.
  for (var i = 0; i < 10; i += 1) {
    new L.PolygonClusterable([
      randomCoords(),
      randomCoords()
    ]).addTo(markerClusterLayer);
  }

  function randomCoords() {
    return [
      48.86 + 0.1 * Math.random() - 0.05, 2.35 + 0.16 * Math.random() - 0.08
    ];
  }


      }

});

//Lagre bluespots i rectangles



//Defining a circlemarkerstyle
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


//Empty geojson
enheds = new L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
}
});
//Filling Geojson with data regarding addresses

//Point data
$.getJSON("php/getPointData.php", function (data) {
  enheds.addData(data);

  var enhpkt = L.geoJson(data,{
    pointToLayer: function(feature,latlng){
      return L.circleMarker(latlng, geojsonMarkerOptions);
      var enhmarker = L.marker(latlng);
      return enhmarker;
    },

    onEachFeature: function (feature, layer) {
  	  if (feature.properties) {
  	    var content = '<table border="1" style="border-collapse:collapse;" cellpadding="2">' +
          '<tr>' + '<th>AtRisk</th>' + '<td>' + feature.properties.inters + '</td>' + '</tr>' +
          '<tr>' + '<th>Name</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<tr>' + '<th>Address</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<tr>' + '<th>Town</th>' + '<td>' + feature.properties.gid + '</td>' + '</tr>' +
          '<table>';
  	    layer.bindPopup(content);
  	  }
  	}
  });
  var enhclusters = L.markerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true
});
  enhclusters.addLayer(enhpkt);
  map.addLayer(enhclusters);

});

map = new L.Map("map",{
   center: [57.051111, 9.919444],
   zoom: 13,
   layers: [osm, riskByg, bs]
 });
