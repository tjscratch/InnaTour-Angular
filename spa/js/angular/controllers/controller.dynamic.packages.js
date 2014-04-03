
'use strict';

if(!_.isFunction(String.prototype.trim)) {
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
    controller('DynamicPackageCtrl', ['$scope', 'DynamicPackagesDataProvider',
        function ($scope, DynamicPackagesDataProvider) {
    		$scope.$on('inna.DynamicPackages.Search', function(event, data){
                console.log(data);
            })
        }
    ]);

innaAppControllers.
    controller('DynamicFormCtrl', ['$scope', 'DynamicPackagesDataProvider', '$rootScope',
        function($scope, DynamicPackagesDataProvider, $rootScope){
    		/* From field */
            $scope.fromList = []

            $scope.provideSuggestToFromList = function(preparedText, rawText){
                DynamicPackagesDataProvider.getFromListByTerm(preparedText, function(data){
                    $scope.fromList = data;
                })
            }

            $scope.fromCurrent = null;

            $scope.$watch('fromCurrent', function(newVal){
                //TODO
            })

	        
	        
	        /* To field */
	        $scope.toList = [];

	        $scope.provideSuggestToToField = function(preparedText, rawText) {
                DynamicPackagesDataProvider.getToListByTerm(preparedText, function(data){
                    $scope.toList = data;
                })
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

            /*Methods*/
            $scope.searchStart = function(){
                $rootScope.$broadcast('inna.DynamicPackages.Search', {
                    from: $scope.fromCurrent,
                    to: $scope.toCurrent,
                    begin: $scope.dateBegin,
                    end: $scope.dateEnd,
                    adultsCount: $scope.adultCount,
                    children: _.map($scope.childrensAge, function(n, selector){ return selector.value; })
                });
            }
        }
    ]);