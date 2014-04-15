
'use strict';

/* Controllers */

innaAppControllers.
    controller('AviaSearchMainCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'cache',
        function AviaSearchMainCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, cache) {

            //нужно передать в шапку (AviaFormCtrl) $routeParams
            $rootScope.$broadcast("avia.page.loaded", $routeParams, true);
        }]);
