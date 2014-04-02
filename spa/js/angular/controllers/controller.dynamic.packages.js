
'use strict';

if(!angular.isFunction(String.prototype.trim)) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, ''); 
	}
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
		        	if (data != null && data.length > 0) {
		        		$scope.toList = [];
			            _.each(data, function (item) { $scope.toList.push(new toItemData(item)); });
	                } else {
	                	$scope.toList = [];
	                }
		        }, function (data, status) {});
	        }
        }
    ]);

innaAppDirectives.directive('dropdownInputTo', [function(){
    return {
        templateUrl: '/spa/templates/components/dropdown_input_to.html',
        scope: {
        	provideSuggestCallback: '=', //callback for ngChange
        	suggest: '=' //list of suggested objects
        },
        controller: ['$scope', function($scope){
        	$scope.rawText = '';
        	$scope.onTextChange = function(){
        		var preparedText = $scope.rawText.split(',')[0].trim();
        		$scope.provideSuggestCallback(preparedText, $scope.rawText);
        	}
        	$scope.getToItemDescription = function (item) {
        		var toItemType = { country: 'country', resort: 'resort', hotel: 'hotel' };
                var country = "";
                var resort = "";
                
                if (item.countryName != null) {
                	country = item.countryName;
                }
                
                if (item.resortName != null) {
                	resort = item.resortName;
                }
                
                

                if (item.type == toItemType.country)  {
                	return ", по всей стране";
                } else if (item.type == toItemType.resort) {
                    return ", " + country;
                } else if (item.type == toItemType.hotel) {
                    return ", " + country + ", " + resort;
                }
            };
        }]
    }
}]);

innaAppDirectives.directive('counterPeople', [function(){
    return {
        templateUrl: '/spa/templates/components/counter_people.html'
    }
}]);