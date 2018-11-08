var mymap = L.map('map')
  .setView([55.676111, 12.568333], 13)
  .addLayer(L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data © \
                  <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    }));

var myLayer;

function onMapClick(e) {

  if(myLayer){
      mymap.removeLayer(myLayer);
  }


  var url = "http://127.0.0.1:5000/findmachine?lat="+e.latlng.lat+"&lng="+e.latlng.lng
  console.log(url)

  $.getJSON(url, function(data){

    console.log(data)

    // add GeoJSON layer to the map once the file is loaded
    myLayer = L.geoJson(data).bindPopup(function (layer) {
    return layer.feature.properties.vejnavn;
})
    myLayer.addTo(mymap);
  });

}

mymap.on('click', onMapClick);
