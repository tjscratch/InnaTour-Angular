
'use strict';

if(!angular.isFunction(String.prototype.trim)) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	}
}

_.generateRange = function(start, end){
    var list = [start];
    while(start !== end) {
        start++;
        list.push(start);
    }
    return list;
}

/* Controllers */

innaAppControllers.
    controller('DynamicPackageCtrl', ['$scope', 'dataService',
        function DynamicPackageCtrl($scope, dataService) {
    		
        }
    ]);

innaAppControllers.
    controller('DynamicFormCtrl', ['$scope', 'dataService',
        function($scope, dataService){
    		/* From field */
	    	$scope.fromList = [];
	    	
	        dataService.getSletatCity(function (data) {
	            _.each(data, function (item) {
	            	$scope.fromList.push(new fromItem(item.id, item.name, item.name));
	            });
	        }, function (data, status) {});
	        
	        $scope.fromCurrent = null;
	        
	        $scope.$watch('fromCurrent', function(newValue){
	        	//TODO save new value for future autocomplete
	        });
	        
	        
	        /* To field */
	        $scope.toList = [];

	        $scope.provideSuggestToToField = function(preparedText, rawText) {
	        	dataService.getSletatDirectoryByTerm(preparedText, function (data) {
		        	if (data) {
		        		$scope.toList = [];

			            _.each(data, function (item) { $scope.toList.push(new toItemData(item)); });
	                } else {
	                	$scope.toList = [];
	                }
		        }, function (data, status) {});
	        }

            $scope.toCurrent = null;

            $scope.$watch('toCurrent', function(newValue){
                //TODO save new value to future autocomplete
            });

            /*Begin date*/
            $scope.dateBegin = null;

            $scope.$watch('dateBegin', function(newVal) {
                //TODO save new value to future autocomplete
            });

            /*End date*/
            $scope.dateEnd = null;

            $scope.$watch('dateEnd', function(newVal) {
                //TODO save new value to future autocomplete
            });

            /*Adult count*/
            $scope.adultCount = 1;

            /*Children count*/
            $scope.childrenCount = 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = [];

            //TODO set watchers
        }
    ]);