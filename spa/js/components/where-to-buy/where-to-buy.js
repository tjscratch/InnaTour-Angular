innaAppConponents.controller("WhereToBuyCtrl", function ($rootScope, $scope, whereToBuyService, dataService, serviceCache) {


    $rootScope.BodyStyleGlobal = {
        'background-color': '#fff'
    };


    /**
     * автоматически оперделяем текущую локацию и показываем карту с метками для нее
     */
    whereToBuyService.getCurrentLocation()
        .then(function(data){
            $scope.currentCity = data;
            geocodeAddress(geocoder, map);
        });


    /**
     * установка локации вручную
     */
    $scope.setLocation = function(){
        geocodeAddress(geocoder, map);
    }
    

    var mapContainer = document.querySelector('.b-where-to-buy-map');
    var GM = google.maps;
    var map = new GM.Map(mapContainer, {
        center: new GM.LatLng(-34, 151),
        zoom: 12
    });
    var geocoder = new google.maps.Geocoder();
    
    
    function geocodeAddress(geocoder, resultsMap) {
        geocoder.geocode({'address': $scope.currentCity}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
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