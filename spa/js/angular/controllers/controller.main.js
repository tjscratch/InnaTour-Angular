
'use strict';

/* Controllers */

innaAppControllers.
    controller('MainCtrl', ['$log', '$scope', '$routeParams', '$filter', 'dataService',
        function MainCtrl($log, $scope, $routeParams, $filter, dataService) {
        	var self = this;
        	function log(msg) {
        		$log.log(msg);
        	}

        	$scope.hellomsg = "Привет из MainCtrl";
        }]);