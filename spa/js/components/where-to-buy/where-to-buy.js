innaAppConponents.controller("WhereToBuyCtrl", function ($rootScope, $scope, innaAppApiEvents, EventManager, whereToBuyService) {

    EventManager.fire(innaAppApiEvents.FOOTER_HIDDEN);

    $rootScope.BodyStyleGlobal = {
        'background-color': '#fff'
    };

    var topMap = document.querySelector('.js-b-where-to-buy-map__container');
    $scope.offsetTop = {top: topMap.offsetTop, bottom: 0};


    /**
     * json заглушка
     */
    var locations = [
        {Id: 0, Name: 'Левел Тревел', Address: '105082, г. Москва, ул. Фридриха Энгельса, д.75, стр.21, этаж 2, офис 203', Phone: '74951344411 ', Site: 'level.travel'},
        {Id: 1, Name: 'Травелата', Address: '125009, г. Москва, ул. Тверская, д.22/2 корп.1', Phone: '7(495)7865500', Site: 'travelata.ru'},
        {Id: 2, Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
        {Id: 3, Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    ]


    /**
     * автоматически оперделяем текущую локацию и показываем карту с метками для нее
     */
    whereToBuyService.getCurrentLocation()
        .then(function (data) {
            $scope.currentCity = data;
            //geocodeAddress(geocoder, map);
        });

    /**
     * установка локации вручную
     */
    $scope.setLocation = function () {
        //geocodeAddress(geocoder, map);
    }


    var mapContainer = document.querySelector('.b-where-to-buy-map');
    var iconDefault = 'spa/img/map/pin-grey.png?' + Math.random().toString(16);
    var iconHover = 'spa/img/map/pin-black.png?' + Math.random().toString(16);
    var GM = google.maps;
    var geocoder = new google.maps.Geocoder();
    var map = new GM.Map(mapContainer, {
        center: new GM.LatLng(0, 0),
        zoom: 11
    });

    geocoder.geocode({'address': 'Москва'}, function (results, status) {
        if (status === GM.GeocoderStatus.OK) {
            console.log(results);
        } else {
            console.warn('Geocode was not successful for the following reason: ' + status);
        }
    });
    
    
    var setCenterMap = function (currentMap, geocoder, address) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === GM.GeocoderStatus.OK) {
                currentMap.setCenter(results[0].geometry.location);
            } else {
                result = null;
                console.warn('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    var setMarker = function (resultsMap, geocoder, locations) {
        locations.forEach(function (data) {
            geocoder.geocode({'address': data.Address}, function (results, status) {
                if (status === GM.GeocoderStatus.OK) {
                    var marker = new GM.Marker({
                        map: resultsMap,
                        icon: iconDefault,
                        position: results[0].geometry.location
                    });
                } else {
                    console.warn('Geocode was not successful for the following reason: ' + status);
                }
            });
        });
    };

    setCenterMap(map, geocoder, 'Москва');
    setMarker(map, geocoder, locations);


    /**
     * События маркера на карте
     * @param data
     */
    var markerEvents = function (data) {

        var marker = data.marker;
        var pos = data.pos;

        GM.event.addListener(marker, 'mouseover', function () {
            var marker = this;
            clearSelection();

            if (!marker.infoBoxVisible) {
                scope.$apply(function ($scope) {
                    $scope.currentHotelPreview = angular.copy(marker.$inna__hotel);
                });

                marker.setIcon(iconHover);

                addInfoBox({
                    elem: boxPreview,
                    pos: pos,
                    marker: {
                        activeMarker: marker,
                        infoBoxPreview: true,
                        hover: true
                    }
                });
            }
        });

        GM.event.addListener(marker, 'mouseout', function () {
            var marker = this;
            if (!marker.infoBoxVisible) {
                boxInfoHover.setVisible(false);
                if (scope.chosenHotelActive) {
                    if (marker._idHotel != scope.chosenHotelActive._idHotel) {
                        marker.setIcon(iconDefault);
                    } else {
                        marker.setIcon(iconClick);
                    }
                } else {
                    marker.setIcon(iconDefault);
                }

            }
        });
    }


})