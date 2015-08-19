innaAppDirectives.directive('ymap', ['$templateCache', function ($templateCache) {
    return {
        link: function (scope, element, attrs) {
            //console.log('ymap');
            ymaps.ready(function () {
                var map = new ymaps.Map($('.Map-container')[0], {
                    center: [55.76, 37.64],
                    zoom: 7,
                    controls: []
                });
                var placemarkCollection = new ymaps.GeoObjectCollection();
                var $cityMenu = $('.City-menu');
                var $current;
                var $contactsItems = $('.Contacts-list').children();

                map.controls.add('zoomControl');

                map.geoObjects.add(placemarkCollection);

                $cityMenu.on('click', 'a', function (evt) {
                    evt.preventDefault();

                    if ($current) {
                        $current.removeClass('active');
                    }

                    $current = $(evt.target);
                    var id = $current.data('id');
                    $current.addClass('active');

                    $contactsItems.hide();

                    var $items = $contactsItems.filter('[data-city="' + id + '"]')

                    $items.show();

                    placemarkCollection.removeAll();

                    $items.each(function (i, item) {
                        var $item = $(item);
                        var coords = [$item.data('lat'), $item.data('lng')];
                        var placemark = new ymaps.Placemark(coords);

                        map.setCenter(coords, 15);
                        placemarkCollection.add(placemark);
                    });

                    if ($items.length > 1) {
                        map.setBounds(placemarkCollection.getBounds());
                    }
                });

                setTimeout(function () {
                    $cityMenu.find('a').eq(0).trigger('click');
                }, 0);

                scope.$on('$destroy', function () {
                    $cityMenu.off();
                });
            });
        }
    };
}]);
