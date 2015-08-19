innaAppConponents.controller("WhereToBuyCtrl", function ($rootScope, $scope, innaAppApiEvents, EventManager, whereToBuyService) {

    EventManager.fire(innaAppApiEvents.FOOTER_HIDDEN);
    $rootScope.BodyStyleGlobal = {'background-color': '#fff'};


    /**
     * позиционируем контейнер для карты
     */
    var topMap = document.querySelector('.js-b-where-to-buy-map__container');
    $scope.offsetTop = {top: topMap.offsetTop, bottom: 0};


    ymaps.ready(initMap);

    function initMap() {

        var mapContainer = document.querySelector('.b-where-to-buy-map');
        var iconDefault = {
            iconLayout: 'default#image',
            iconImageHref: 'spa/img/map/pin-grey.png',
            iconImageSize: [21, 32],
            iconImageOffset: [0, 0]
        };
        var iconHover = {
            iconLayout: 'default#image',
            iconImageHref: 'spa/img/map/pin-black.png',
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
        whereToBuyService.getAgencyList().then(function (data) {
            console.log(data);
        });


        var myPlacemark = new ymaps.Placemark([55.779266, 37.69313], {}, iconDefault);

        myPlacemark.events
            .add('mouseenter', function (e) {
                // Ссылку на объект, вызвавший событие,
                // можно получить из поля 'target'.
                e.get('target').options.set(iconHover);
            })
            .add('mouseleave', function (e) {
                e.get('target').options.set(iconDefault);
            });


        myMap.geoObjects.add(myPlacemark);
    }


    //function getCoordinatesLocation(){
    //
    //}


})