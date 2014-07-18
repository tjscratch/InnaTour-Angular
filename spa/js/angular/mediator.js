/**
 * Глобальный EventManager
 * mediator
 */
angular.module('innaApp.conponents').
    factory('mediator', function () {
        return  new Ractive();
    }
);