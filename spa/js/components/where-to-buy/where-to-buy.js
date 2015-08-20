innaAppConponents.controller("WhereToBuyCtrl", function ($rootScope, $scope, innaAppApiEvents, EventManager, whereToBuyService) {

    EventManager.fire(innaAppApiEvents.FOOTER_HIDDEN);
    $rootScope.BodyStyleGlobal = {'background-color': '#fff'};


    /**
     * позиционируем контейнер для карты
     */
    var topMap = document.querySelector('.js-b-where-to-buy-map__container');
    $scope.offsetTop = {top: topMap.offsetTop, bottom: 0};
    var body = document.querySelector('body');
    $scope.listHeight = {height: body.clientHeight - topMap.offsetTop - 150};

    /**
     * json заглушка
     */
    var locations = [];
    for (var i = 0; i < 2000; i++) {
        var long = Math.random() * (56 - 55.5) + 55.5;
        var lang = Math.random() * (37.9 - 37.3) + 37.3;
        locations.push(
            {
                Coordinate: long + ',' + lang,
                Name: 'АЛЬФА',
                Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1',
                Phone: '7(495)7247210',
                Site: 'mail.com'
            }
        )
    }
    
    //var locations = [
    //    {Name: 'Левел Тревел', Address: '105082, г. Москва, ул. Фридриха Энгельса, д.75, стр.21, этаж 2, офис 203', Coordinate: '55.779266, 37.69313', Phone: '74951344411 ', Site: 'level.travel'},
    //    {Name: 'Травелата', Address: '125009, г. Москва, ул. Тверская, д.22/2 корп.1', Coordinate: '55.767939, 37.602229', Phone: '7(495)7865500', Site: 'travelata.ru'},
    //    {Coordinate: '55.855532, 37.495797', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.65, 37.495797', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.55, 37.495797', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.495797', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.35', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.45', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.54', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.68', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.10', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.90, 37.5', Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Phone: '7(495)7247210', Site: 'mail.com'},
    //    {Coordinate: '55.769099, 37.633958', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.76, 37.6', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.76, 37.4', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.76, 37.3', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.7, 37.3', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.6, 37.4', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.6, 37.5', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //    {Coordinate: '55.4, 37.6', Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Phone: '7(495)6071287', Site: 'rambler.ru'},
    //]


    ymaps.ready(initMap);

    function initMap() {

        var mapContainer = document.querySelector('.b-where-to-buy-map');
        var iconDefault = {
            iconLayout: 'default#image',
            iconImageHref: 'spa/img/map/pin-grey.png?' + Math.random().toString(16),
            iconImageSize: [21, 32],
            iconImageOffset: [0, 0]
        };
        var iconHover = {
            iconLayout: 'default#image',
            iconImageHref: 'spa/img/map/pin-green.png?' + Math.random().toString(16),
            iconImageSize: [21, 32],
            iconImageOffset: [0, 0]
        };

        var myMap = new ymaps.Map(mapContainer, {
            center: [55.75396, 37.620393],
            zoom: 10,
            controls: []
        });


        var setMapCentered = function (city) {
            ymaps.geocode(city).then(
                function (res) {
                    var coord = res.geoObjects.get(0).geometry.getCoordinates();
                    myMap.setCenter(coord, 10);
                }
            );
        }


        /**
         * автоматически оперделяем текущую локацию и показываем карту с метками для нее
         */
        whereToBuyService.getCurrentLocation().then(function (data) {
            $scope.currentCity = data;
            setMapCentered(data);
        });


        /**
         * загрузка списка агенств
         */
        whereToBuyService.getAgencyList().success(function (data) {
            $scope.agencies = data.concat(locations);
            setMarkers($scope.agencies, $scope.currentAgencyId);
        });


        $scope.currentAgencyId = 1;
        $scope.arrayMarkers = [];
        
        $scope.setAgency = function (index) {
            $scope.currentAgencyId = index;
            //setMarkers($scope.agencies, index);
            $scope.arrayMarkers.forEach(function (marker, i) {
                marker.options.set(iconDefault);
            });
            $scope.arrayMarkers[index].options.set(iconHover);
        };

        function setMarkers(markers, currentMarker) {
            markers.forEach(function (marker, i) {
            
                var coordinate = marker.Coordinate.split(",");
            
                if (currentMarker != i) {
                    var myPlacemark = new ymaps.Placemark(coordinate, {id: i}, iconDefault);
                } else {
                    var myPlacemark = new ymaps.Placemark(coordinate, {id: i}, iconHover);
                }
            
                myPlacemark.events
                    .add('mouseenter', function (e) {
                        $scope.$apply(function ($scope) {
                            $scope.setAgency(e.get('target').properties.get('id'));
                        });
                    });
                    //.add('mouseleave', function (e) {
                    //    e.get('target').options.set(iconDefault);
                    //});

                $scope.arrayMarkers.push(myPlacemark);
                
                myMap.geoObjects.add(myPlacemark);
                
            });
        };

    };
});