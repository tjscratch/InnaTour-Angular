innaAppConponents.controller("WhereToBuyCtrl", function ($rootScope, $scope) {


    $rootScope.BodyStyleGlobal = {
        'background-color': '#fff'
    }

    var mapContainer = document.querySelector('.b-where-to-buy-map');
    var zoomMapDefault = 12;
    var GM = google.maps;
    var _bounds = new GM.LatLngBounds();
    var dataInfoBox = {
        //visible: false,
        disableAutoPan: false,
        closeBoxURL: "",
        //pixelOffset: new google.maps.Size(-10, 0),
        zIndex: 2000,
        infoBoxClearance: new google.maps.Size(1, 1),
        pane: "floatPane",
        enableEventPropagation: false
    };
    var styleArray = [
        {
            featureType: "all",
            stylers: [
                {saturation: -30}
            ]
        },
        {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
                {hue: "#00ffee"},
                {saturation: 50}
            ]
        },
        {
            featureType: "poi.business",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        }
    ];

    var map = new GM.Map(mapContainer, {
        center: new GM.LatLng(-34, 151),
        zoom: 12
    });

    var geocoder = new google.maps.Geocoder();

    geocodeAddress(geocoder, map);

    function geocodeAddress(geocoder, resultsMap) {
        var address = 'Москва, Киевский вокзал';
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                console.log(results);
                resultsMap.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
    
    


})