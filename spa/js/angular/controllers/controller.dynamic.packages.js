
'use strict';

/* Controllers */

innaAppControllers.
    controller('DynamicPackageCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$location', 'dataService', 'sharedProperties',
        function DynamicPackageCtrl($log, $scope, $rootScope, $routeParams, $filter, $location, dataService, sharedProperties) {
            //do nothing
        }
    ]);

innaAppControllers.
    controller('DynamicFormCtrl', ['$scope', 
        function($scope){
            console.log('I am form');
        }
    ]);

innaAppDirectives.directive('select', [function(){
	return {
		templateUrl: '/spa/templates/components/select.html'
	}
}]);

innaAppDirectives.directive('dropdownInputTo', [function(){
	return {
		templateUrl: '/spa/templates/components/dropdown_input_to.html'
	}
}]);

innaAppDirectives.directive('counterPeople', [function(){
	return {
		templateUrl: '/spa/templates/components/counter_people.html'
	}
}])