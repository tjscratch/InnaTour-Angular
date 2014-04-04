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

Date.fromDDMMYY = function(ddmmyy, asTS){
    var bits = ddmmyy.split('.');
    var mmddyy = [bits[1], bits[0], bits[2]].join('.');
    var date = new Date(mmddyy);

    if(asTS) return +date;

    return date;
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
    controller('DynamicFormCtrl', ['$scope', 'DynamicPackagesDataProvider', '$rootScope', 'DynamicPackagesCacheWizard',
        function($scope, DynamicPackagesDataProvider, $rootScope, DynamicPackagesCacheWizard){
            function validate(){
                if(!$scope.fromCurrent) throw Error('fromCurrent');

                if(!$scope.toCurrent) throw Error('toCurrent');

                if($scope.fromCurrent == $scope.toCurrent) throw Error('toCurrent');
            }

            $scope.loadObjectById = function(id, callback){
                DynamicPackagesDataProvider.getObjectById(id, callback);
            }

    		/* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function(preparedText, rawText){
                DynamicPackagesDataProvider.getFromListByTerm(preparedText, function(data){
                    $scope.fromList = data;
                })
            }

            $scope.fromCurrent = DynamicPackagesCacheWizard.require('fromCurrent');

            $scope.$watch('fromCurrent', function(newVal){
                DynamicPackagesCacheWizard.put('fromCurrent', newVal);
            });

	        
	        
	        /* To field */
	        $scope.toList = [];

	        $scope.provideSuggestToToField = function(preparedText, rawText) {
                DynamicPackagesDataProvider.getToListByTerm(preparedText, function(data){
                    $scope.toList = data;
                })
	        }

            $scope.toCurrent = DynamicPackagesCacheWizard.require('toCurrent');

            $scope.$watch('toCurrent', function(newVal){
                DynamicPackagesCacheWizard.put('toCurrent', newVal);
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
            $scope.adultCount = 2;

            /*Children count*/
            $scope.childrenCount = 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = [];

            //TODO set watchers

            /*Klass*/
            $scope.klass = TripKlass.options[0];

            //TODO set watchers


            /*Methods*/
            $scope.searchStart = function(){
                try {
                    validate();
                    //if ok
                    $rootScope.$broadcast('inna.DynamicPackages.Search', {
                        from: $scope.fromCurrent,
                        to: $scope.toCurrent,
                        begin: $scope.dateBegin,
                        end: $scope.dateEnd,
                        adultsCount: $scope.adultCount,
                        children: _.map($scope.childrensAge, function(selector, n){ return selector.value; }),
                        klass: $scope.klass
                    });
                } catch(e) {
                    console.warn(e);
                    if($scope.hasOwnProperty(e.message)) {
                        $scope[e.message] = e;
                    }
                }
            }
        }
    ]);