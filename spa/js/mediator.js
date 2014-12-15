/**
 * Глобальный EventManager
 * mediator
 */
angular.module('innaApp.services').service('EventManager', function () {
        return new Ractive();
    }
).service('NotificationManager', ['$rootScope',function ($rootScope) {
        return $rootScope;
    }]
);