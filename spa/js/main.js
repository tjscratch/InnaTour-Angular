ymaps.ready(function () {
    var map = new ymaps.Map($('.Map-container')[0], {
        center: [55.76, 37.64],
        zoom: 7
    });
    var placemarkCollection = new ymaps.GeoObjectCollection();
    var $cityMenu = $('.City-menu');
    var $current;
    var $contactsItems = $('.Contacts-list').children();

    map.geoObjects.add(placemarkCollection);

    $cityMenu.on ('click', function (evt) {
        evt.preventDefault();

        if ($current) {
            $current.removeClass('active');
        }

        $current = $(evt.target);
        id = $current.data('id');
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
    });

    $cityMenu.find('a').eq(0).trigger('click');
});

$(function () {
    var $comboBoxes = $('.combo-box');

    $comboBoxes.each(function (i, element) {
        var $comboBox = $(element);
    })
});