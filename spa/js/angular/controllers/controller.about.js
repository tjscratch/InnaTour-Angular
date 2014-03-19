
'use strict';

/* Controllers */

innaAppControllers.
    controller('AboutCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function AboutCtrl($log, $scope, $routeParams, $filter, dataService) {
        	var self = this;
        	function log(msg) {
        		$log.log(msg);
        	}

        	$scope.hellomsg = "Привет из AboutCtrl";
        }]);