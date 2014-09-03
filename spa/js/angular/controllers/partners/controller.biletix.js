'use strict';

/* Controllers */

innaAppControllers.
    controller('BiletixMainCtrl', [
        'EventManager', '$scope', '$rootScope', '$routeParams', 'innaApp.API.events', 'DynamicFormSubmitListener',
        function (EventManager, $scope, $rootScope, $routeParams, Events, DynamicFormSubmitListener) {
            $("body").css("background-color", "#fff");
            EventManager.fire(Events.HEAD_HIDDEN);
            EventManager.fire(Events.FOOTER_HIDDEN);

            DynamicFormSubmitListener.listen();
        }
    ]);
