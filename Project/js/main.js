//global variables
var osm = L.tileLayer(
 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 maxZoom: 18,
 attribution: 'Map data © \
 <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
 });

 //Defining a circlemarkerstyle
 var geojsonMarkerOptions = {
     radius: 8,
     fillColor: "#ff7800",
     color: "#000",
     weight: 1,
     opacity: 1,
     fillOpacity: 0.8
 };


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

  var bspkt = new L.geoJson(data,{
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
//Lagre bluespots i Polygons
}

});
});

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
