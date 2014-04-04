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

            $scope.fromCurrent = DynamicPackagesCacheWizard.require('fromCurrent', function(){
                DynamicPackagesDataProvider.getUserLocation(function(data){
                    $scope.fromCurrent = data;
                });
            });

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
            $scope.dateBegin = DynamicPackagesCacheWizard.require('dateBegin');

            $scope.$watch('dateBegin', function(newVal) {
                DynamicPackagesCacheWizard.put('dateBegin', newVal);
            });

            /*End date*/
            $scope.dateEnd = DynamicPackagesCacheWizard.require('dateEnd');

            $scope.$watch('dateEnd', function(newVal) {
                DynamicPackagesCacheWizard.put('dateEnd', newVal);
            });

            /*Adult count*/
            $scope.adultCount = 2;

            /*Children count*/
            $scope.childrenCount = 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = [];

            /*Klass*/
            $scope.klass = TripKlass.options[
                DynamicPackagesCacheWizard.require('klass', function(){ return 0; })
            ];

            $scope.$watch('klass', function(newVal){
                newVal = newVal || {value: 0}
                DynamicPackagesCacheWizard.put('klass', newVal.value)
            })


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