'use strict';

/* Controllers */

innaAppControllers.
    controller('BiletixMainCtrl', [
        'EventManager', '$scope', '$rootScope', '$routeParams', 'innaApp.API.events', 'DynamicFormSubmitListener',
        function (EventManager, $scope, $rootScope, $routeParams, Events, DynamicFormSubmitListener) {
            //EventManager.fire(Events.HEAD_HIDDEN);
            //EventManager.fire(Events.FOOTER_HIDDEN);

            DynamicFormSubmitListener.listen();

            //location.href = 'http://biletix.lh.inna.ru/#/packages/search/6733-6623-09.10.2014-19.10.2014-0-2-';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/details/6733-6623-09.10.2014-19.10.2014-0-2--178973-777070807-777070820-4?action=buy&displayHotel=178973';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/reservation/6733-6623-10.10.2014-18.10.2014-0-1-?room=0f5b6412-5dfa-7ab4-da79-f380821e0f7f&hotel=435490&ticket=777072881&debug=1';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/buy/E29HXQ';
        }
    ]);
