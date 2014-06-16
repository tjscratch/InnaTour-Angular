innaAppControllers
    .controller('DynamicFormCtrl', [
        '$scope',
        'DynamicPackagesDataProvider',
        '$rootScope',
        'DynamicPackagesCacheWizard',
        'Validators',
        '$location',
        'innaApp.Urls',
        '$cookieStore',
        function($scope, DynamicPackagesDataProvider, $rootScope, DynamicPackagesCacheWizard, Validators, $location, URLs, $cookieStore){
            var AS_MAP_CACHE_KEY = 'serp-as-map';

            var routeParams = (function(path){
                if(path.indexOf(URLs.URL_DYNAMIC_PACKAGES_SEARCH) === -1) return {};

                path = path.split('/');
                path = path[path.length - 1] || path[path.length - 2];

                var bits = path.split('-');

                return {
                    DepartureId: bits[0],
                    ArrivalId: bits[1],
                    StartVoyageDate: bits[2],
                    EndVoyageDate: bits[3],
                    TicketClass: bits[4],
                    Adult: bits[5],
                    ChildrenAges: (function(ages){
                        return ages ?
                            ages.split('_').map(function(age){ return {value: age}; }) :
                            []
                    })(bits[6])
                }
            })($location.path());

            function validate(){
                Validators.defined($scope.fromCurrent, Error('fromCurrent'));
                Validators.defined($scope.toCurrent, Error('toCurrent'));
                Validators.notEqual($scope.fromCurrent, $scope.toCurrent, Error('toCurrent'));

                var children = _.partition($scope.childrensAge, function(ageSelector){ return ageSelector.value < 2;});
                var infants = children[0].length;
                children = children[1].length;
                var separatedInfants = infants - $scope.adultCount;
                if(separatedInfants < 0) separatedInfants = 0;

                if(+$scope.adultCount + children + separatedInfants > 6) throw Error('adultCount');

                Validators.defined($scope.dateBegin, Error('dateBegin'));
                Validators.defined($scope.dateEnd, Error('dateEnd'));
            }

            $scope.loadObjectById = function(id, callback){
                DynamicPackagesDataProvider.getObjectById(id, callback);
            }

    		/* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function(preparedText, rawText){
                DynamicPackagesDataProvider.getFromListByTerm(preparedText, function(data){
                    $scope.$apply(function($scope) {
                        $scope.fromList = data;
                    });
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
                    $scope.$apply(function($scope) {
                        $scope.toList = data;
                    });
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
            $scope.childrenCount = routeParams.ChildrenAges && routeParams.ChildrenAges.length || 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = routeParams.ChildrenAges || [];

            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function(klass){
                var cached = routeParams.TicketClass ||
                    DynamicPackagesCacheWizard.require('klass', function(){ return TripKlass.ECONOM; });

                return (klass.value == cached);
            });

            $scope.$watchCollection('klass', function(newVal){
                newVal = newVal || TripKlass.options[0];
                DynamicPackagesCacheWizard.put('klass', newVal.value);
            });


            /*Methods*/
            $scope.searchStart = function(){

              // удаляем куки состояния открытой карты
              DynamicPackagesCacheWizard.put(AS_MAP_CACHE_KEY, 0);

              // если есть get параметр map=show, удалаяем его
              if ($location.search().map) {
                delete $location.$$search.map;
                $location.$$compose();
              }


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
                        children: _.map($scope.childrensAge, function(selector, n){ return selector.value; }),
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