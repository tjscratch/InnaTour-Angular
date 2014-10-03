'use strict';

/* Controllers */

innaAppControllers.
    controller('BiletixMainCtrl', [
        'EventManager', '$scope', '$rootScope', '$routeParams', 'innaApp.API.events', 'DynamicFormSubmitListener',
        function (EventManager, $scope, $rootScope, $routeParams, Events, DynamicFormSubmitListener) {
            //EventManager.fire(Events.HEAD_HIDDEN);
            //EventManager.fire(Events.FOOTER_HIDDEN);

            $('body').addClass('partner-body-class');

            DynamicFormSubmitListener.listen();

            //location.href = 'http://192.168.105.54/#/packages/search/6733-6623-09.10.2014-19.10.2014-0-2-';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/search/6733-6623-09.10.2014-19.10.2014-0-2-';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/details/6733-6623-09.10.2014-19.10.2014-0-2--138050-777142817-777142827-4?displayHotel=138050';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/reservation/6733-6623-10.10.2014-18.10.2014-0-1-?room=0f5b6412-5dfa-7ab4-da79-f380821e0f7f&hotel=435490&ticket=777081287&debug=1';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/buy/PT9K6N';
        }
    ]);
