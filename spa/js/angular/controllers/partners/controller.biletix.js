'use strict';

/* Controllers */

innaAppControllers.
    controller('BiletixMainCtrl', [
        'EventManager', '$scope', '$rootScope', '$routeParams', 'innaApp.API.events', 'DynamicFormSubmitListener',
        function (EventManager, $scope, $rootScope, $routeParams, Events, DynamicFormSubmitListener) {
            EventManager.fire(Events.HEAD_HIDDEN);
            EventManager.fire(Events.FOOTER_HIDDEN);

            DynamicFormSubmitListener.listen();

            //location.href = 'http://biletix.lh.inna.ru/#/packages/search/6733-6623-09.10.2014-19.10.2014-0-2-';
        }
    ]);
