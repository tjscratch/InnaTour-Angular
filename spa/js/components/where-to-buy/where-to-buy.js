innaAppConponents.controller("WhereToBuyCtrl", function ($rootScope, $scope, innaAppApiEvents, EventManager, whereToBuyService) {

    EventManager.fire(innaAppApiEvents.FOOTER_HIDDEN);
    $rootScope.BodyStyleGlobal = {'background-color': '#fff'};


    /**
     * позиционируем контейнер для карты
     */
    var topMap = document.querySelector('.js-b-where-to-buy-map__container');
    $scope.offsetTop = {top: topMap.offsetTop, bottom: 0};


    /**
     * json заглушка
     */
    var locations = [
        {Id: 0, Name: 'Левел Тревел', Address: '105082, г. Москва, ул. Фридриха Энгельса, д.75, стр.21, этаж 2, офис 203', Point: [37.69313, 55.779266], Phone: '74951344411 ', Site: 'level.travel'},
        {Id: 1, Name: 'Травелата', Address: '125009, г. Москва, ул. Тверская, д.22/2 корп.1', Point: [37.602229, 55.767939], Phone: '7(495)7865500', Site: 'travelata.ru'},
        {Id: 2, Name: 'РусьИнтурБюро', Address: '107045, г. Москва,  Малый Головин пер., д. 8, стр.1, офис 43', Point: [37.633958, 55.769099], Phone: '7(495)6071287', Site: 'rambler.ru'},
        {Id: 3, Name: 'АЛЬФА', Address: '125581, г. Москва, ул. Лавочкина, д.32, ДС «Динамо», офис 213-1', Point: [37.495797, 55.855532], Phone: '7(495)7247210', Site: 'mail.com'},
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



// Дождёмся загрузки API и готовности DOM.
    ymaps.ready(init);

    function init() {
        // Создание экземпляра карты и его привязка к контейнеру с
        // заданным id ("map").
        var myMap = new ymaps.Map(mapContainer, {
            // При инициализации карты обязательно нужно указать
            // её центр и коэффициент масштабирования.
            center: [55.779266, 37.69313], // Москва
            zoom: 10,
            controls: []
        });
        // получение координат области видимости
        //console.log(myMap.getBounds());

        var myPlacemark = new ymaps.Placemark(myMap.getCenter(), {}, iconDefault);

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
    
    
    
})