innaAppControllers
    .controller('DynamicFormCtrl', [
        '$scope', 'DynamicPackagesDataProvider', '$rootScope', 'DynamicPackagesCacheWizard', 'Validators', '$location',
        function($scope, DynamicPackagesDataProvider, $rootScope, DynamicPackagesCacheWizard, Validators, $location){
            var routeParams = (function(path){
                path = path.split('/');
                path = path[path.length - 1] || path[path.length - 2];

                var bits = path.split('-');

                return {
                    DepartureId: bits[0],
                    ArrivalId: bits[1],
                    StartVoyageDate: bits[2],
                    EndVoyageDate: bits[3],
                    TicketClass: bits[4],
                    Adult: bits[5]
                }
            })($location.path());

            function validate(){
                Validators.defined($scope.fromCurrent, Error('fromCurrent'));
                Validators.defined($scope.toCurrent, Error('toCurrent'));
                Validators.notEqual($scope.fromCurrent, $scope.toCurrent, Error('toCurrent'));
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

            $scope.fromCurrent = routeParams.DepartureId || DynamicPackagesCacheWizard.require('fromCurrent', function(){
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

            $scope.toCurrent = routeParams.ArrivalId || DynamicPackagesCacheWizard.require('toCurrent');

            $scope.$watch('toCurrent', function(newVal){
                DynamicPackagesCacheWizard.put('toCurrent', newVal);
            });

            /*Begin date*/
            $scope.dateBegin = routeParams.StartVoyageDate || DynamicPackagesCacheWizard.require('dateBegin');

            $scope.$watch('dateBegin', function(newVal) {
                DynamicPackagesCacheWizard.put('dateBegin', newVal);
            });

            /*End date*/
            $scope.dateEnd = routeParams.EndVoyageDate || DynamicPackagesCacheWizard.require('dateEnd');

            $scope.$watch('dateEnd', function(newVal) {
                DynamicPackagesCacheWizard.put('dateEnd', newVal);
            });

            /*Adult count*/
            $scope.adultCount = routeParams.Adult || 2;

            /*Children count*/
            $scope.childrenCount = 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = [];

            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function(klass){
                var cached = routeParams.TicketClass ||
                    DynamicPackagesCacheWizard.require('klass', function(){ return TripKlass.ECONOM; });

                return (klass.value == cached);
            });

            $scope.$watch('klass', function(newVal){
                newVal = newVal || TripKlass.options[0];
                DynamicPackagesCacheWizard.put('klass', newVal.value)
            });


            /*Methods*/
            $scope.searchStart = function(){
                try {
                    validate();
                    //if ok
                    var o = {
                        ArrivalId: $scope.toCurrent,
                        DepartureId: $scope.fromCurrent,
                        StartVoyageDate: $scope.dateBegin,
                        EndVoyageDate: $scope.dateEnd,
                        TicketClass: $scope.klass.value,
                        Adult: $scope.adultCount,
                        // children: _.map($scope.childrensAge, function(selector, n){ return selector.value; }),
                    }
                    $rootScope.$emit('inna.DynamicPackages.Search', o);
                } catch(e) {
                    console.warn(e);
                    if($scope.hasOwnProperty(e.message)) {
                        $scope[e.message] = e;
                    }
                }
            }
        }
    ]);