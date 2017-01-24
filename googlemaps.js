/**
 * Created by Victor on 1/23/2017.
 */
var GoogleMapsAPI = require('googlemaps');
var polyline = require('polyline');
var publicConfig = {
    key: 'AIzaSyBeWLtoD-PTsiqaI1QuPR5y1Vas2P3QStA',
    stagger_time:       1000, // for elevationPath
    encode_polylines:   false,
    secure:             true, // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);

// or in case you are using Google Maps for Work

// geocode API
/*
var geocodeParams = {
    "address":    "47520 Avalon Heights Terrace",
};

gmAPI.geocode(geocodeParams, function(err, result){
    console.log(result.results[0].geometry.location);
});

*/
var request = {
    origin: '47520 Avalon Heights Terrace',
    destination: 'San Francisco',
    travelMode: 'DRIVING'
};

gmAPI.directions(request, function(err, result){
    console.log(polyline.decode(result.routes[0].overview_polyline));
    console.log(result.routes[0].overview_polyline);
});

google.maps.geometry.encoding.decodePath()


