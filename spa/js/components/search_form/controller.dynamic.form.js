innaAppControllers
    .controller('DynamicFormCtrl', [
        '$scope',
        'DynamicPackagesDataProvider',
        '$rootScope',
        'DynamicPackagesCacheWizard',
        'Validators',
        '$location',
        'innaApp.Urls',
        function ($scope, DynamicPackagesDataProvider, $rootScope, DynamicPackagesCacheWizard, Validators, $location, URLs) {

            var parseRoute = function (path) {
                //console.log('here');
                if (path.indexOf(URLs.URL_DYNAMIC_PACKAGES_SEARCH) > -1 || path.indexOf(URLs.URL_DYNAMIC_HOTEL_DETAILS) > -1) {
                    var bits = QueryString.getBits(path);
                    return {
                        DepartureId: bits[0],
                        ArrivalId: bits[1],
                        StartVoyageDate: bits[2],
                        EndVoyageDate: bits[3],
                        TicketClass: bits[4],
                        Adult: bits[5],
                        ChildrenAges: (function (ages) {
                            return ages ?
                                ages.split('_').map(function (age) {
                                    return { value: age };
                                }) :
                                []
                        })(bits[6])
                    };
                }
                else if (path.indexOf(URLs.URL_PACKAGES_LANDING) > -1) { //ЛП
                    var bits = QueryString.getBits(path);
                    if (bits.length == 1) {
                        return {
                            sectionId: bits[0]
                        };
                    }
                    else if (bits.length == 2) {
                        return {
                            sectionId: bits[0],
                            Adult: bits[1]
                        };
                    }
                    else if (bits.length == 3) {
                        return {
                            sectionId: bits[0],
                            Adult: bits[1],
                            DepartureId: bits[2]
                        };
                    }
                    else if (bits.length == 4) {
                        return {
                            sectionId: bits[0],
                            Adult: bits[1],
                            DepartureId: bits[2],
                            ArrivalId: bits[3]
                        };
                    }
                    else {
                        return {};
                    }
                }
                else if (path.indexOf(URLs.URL_DYNAMIC_PACKAGES) > -1) { //IN-2466 URL для контекста по ДП
                    var bits = QueryString.getBits(path);
                    if (bits.length == 2) {
                        return {
                            DepartureId: bits[0],
                            ArrivalId: bits[1]
                        };
                    }
                    else {
                        return {};
                    }
                }
                else {
                    return {};
                }
            };

            var routeParams = parseRoute($location.path());

            function validate() {
                Validators.defined($scope.fromCurrent, Error('fromCurrent'));
                Validators.defined($scope.toCurrent, Error('toCurrent'));
                Validators.notEqual($scope.fromCurrent, $scope.toCurrent, Error('toCurrent'));

                //если запомнили город - то проверяем и его
                if ($scope.lastCityFromCode != null && $scope.lastCityToCode != null) {
                    Validators.notEqual($scope.lastCityFromCode, $scope.lastCityToCode, Error('toCurrent'));
                }
                else if ($scope.lastCityFromCode != null && $scope.lastCityToCode == null) {
                    Validators.notEqual($scope.lastCityFromCode, $scope.lastToCode, Error('toCurrent'));
                }
                else if ($scope.lastCityFromCode == null && $scope.lastCityToCode != null) {
                    Validators.notEqual($scope.lastFromCode, $scope.lastCityToCode, Error('toCurrent'));
                }

                var children = _.partition($scope.childrensAge, function (ageSelector) {
                    return ageSelector.value < 2;
                });
                var infants = children[0].length;
                children = children[1].length;
                var separatedInfants = infants - $scope.adultCount;
                if (separatedInfants < 0) separatedInfants = 0;

                if (+$scope.adultCount + children + separatedInfants > 6) throw Error('adultCount');

                Validators.defined($scope.dateBegin, Error('dateBegin'));
                Validators.defined($scope.dateEnd, Error('dateEnd'));
                Validators.dateEndEmpty($scope.dateBegin, $scope.dateEnd, Error('dateEnd'));
            }

            $scope.loadObjectById = function (id, callback) {
                DynamicPackagesDataProvider.getObjectById(id, callback);
            }

            /* From field */
            $scope.fromList = [];

            $scope.provideSuggestToFromList = function (preparedText, rawText) {
                DynamicPackagesDataProvider.getFromListByTerm(preparedText, function (data) {
                    $scope.$apply(function ($scope) {
                        $scope.fromList = data;
                    });
                })
            }

            $scope.fromCurrent = routeParams.DepartureId || DynamicPackagesCacheWizard.require('fromCurrent', function () {
                DynamicPackagesDataProvider.getUserLocation(function (data) {
                    if (data != null) {
                        $scope.safeApply(function () {
                            $scope.fromCurrent = data.Id;
                            $rootScope.$broadcast("dp_form_from_update", data.Id);
                        });
                    }
                });
            });

            //обновляем значения в саджесте
            setTimeout(function () {
                $rootScope.$broadcast("dp_form_from_update", $scope.fromCurrent);
            }, 0);

            $scope.$watch('fromCurrent', function (newVal) {
                DynamicPackagesCacheWizard.put('fromCurrent', newVal);
            });

            /* To field */
            $scope.toList = [];

            $scope.provideSuggestToToField = function (preparedText, rawText) {
                DynamicPackagesDataProvider.getToListByTerm(preparedText, function (data) {
                    $scope.$apply(function ($scope) {
                        $scope.toList = data;
                    });
                })
            };

            $scope.toCurrent = routeParams.ArrivalId || DynamicPackagesCacheWizard.require('toCurrent');
            //обновляем значения в саджесте
            setTimeout(function () {
                $rootScope.$broadcast("dp_form_to_update", $scope.toCurrent);
            }, 0);

            $scope.$watch('toCurrent', function (newVal) {
                DynamicPackagesCacheWizard.put('toCurrent', newVal);
            });

            /*Begin date*/
            $scope.dateBegin = routeParams.StartVoyageDate || DynamicPackagesCacheWizard.require('dateBegin');

            $scope.$watch('dateBegin', function (newVal) {
                DynamicPackagesCacheWizard.put('dateBegin', newVal);
            });

            /*End date*/
            $scope.dateEnd = routeParams.EndVoyageDate || DynamicPackagesCacheWizard.require('dateEnd');

            $scope.$watch('dateEnd', function (newVal) {
                DynamicPackagesCacheWizard.put('dateEnd', newVal);
            });

            $scope.maxDateEnd = new Date();
            $scope.maxDateEnd.setMonth($scope.maxDateEnd.getMonth() + 6);

            /*Adult count*/
            $scope.adultCount = routeParams.Adult || 2;

            /*Children count*/
            $scope.childrenCount = (routeParams.ChildrenAges && routeParams.ChildrenAges.length) || 0;

            /*Children ages*/
            //TODO fix English
            $scope.childrensAge = routeParams.ChildrenAges || [];

            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function (klass) {
                var cached = routeParams.TicketClass ||
                    DynamicPackagesCacheWizard.require('klass', function () {
                        return TripKlass.ECONOM;
                    });

                return (klass.value == cached);
            });

            $scope.$watchCollection('klass', function (newVal) {
                newVal = newVal || TripKlass.options[0];
                DynamicPackagesCacheWizard.put('klass', newVal.value);
            });

            //запоминаем последние CodeIata для итема и для его города (CityCodeIata)
            //потом в методе validate они участвуют в проверке, что аэропорты не в одном городе
            $scope.lastFromCode = null;
            $scope.lastToCode = null;
            $scope.lastCityFromCode = null;
            $scope.lastCityToCode = null;

            $scope.setResultCallbackFrom = function (item) {
                if (item != null) {
                    $scope.lastFromCode = item.CodeIata;
                }
                else {
                    $scope.lastFromCode = null;
                }
                if (item != null && item.CityCodeIata != null) {
                    $scope.lastCityFromCode = item.CityCodeIata;
                }
                else {
                    $scope.lastCityFromCode = null;
                }
            }

            $scope.setResultCallbackTo = function (item) {
                if (item != null) {
                    $scope.lastToCode = item.CodeIata;
                }
                else {
                    $scope.lastToCode = null;
                }
                if (item != null && item.CityCodeIata != null) {
                    $scope.lastCityToCode = item.CityCodeIata;
                }
                else {
                    $scope.lastCityToCode = null;
                }
            }


            /*Methods*/
            $scope.searchStart = function () {
                // если есть get параметр map=show, удалаяем его
                if ($location.search().map) {
                    delete $location.$$search.map;
                    $location.$$compose();
                }

                try {
                    validate();
                    //if ok

                    var today = +(new Date());
                    var begin = Date.fromDDMMYY($scope.dateBegin);
                    var end = Date.fromDDMMYY($scope.dateEnd);

                    var beforeStart = parseInt((begin - today) / 86400000); //days
                    var duration = parseInt((end - begin) / 86400000); //days

                    //half of a year
                    //or
                    //longer then 28 days
                    if (beforeStart >= 30 * 6 || duration > 28) {
                        $scope.baloon.showErr('Ограничения бронирования', 'Бронирование возможно не ранее, чем за 6 месяцев до планируемого путешествия и продолжительность путешествия не более 30 дней.');

                        throw 1;
                    }

                    var o = {
                        ArrivalId: $scope.toCurrent,
                        DepartureId: $scope.fromCurrent,
                        StartVoyageDate: $scope.dateBegin,
                        EndVoyageDate: $scope.dateEnd,
                        TicketClass: $scope.klass.value,
                        Adult: $scope.adultCount,
                        children: _.map($scope.childrensAge, function (selector, n) {
                            return selector.value;
                        })
                    }

                    //аналитика
                    track.dpSearch();

                    //сброс запрета слежения аналитики
                    track.resetTrackSuccessResult(track.dpKey);

                    $rootScope.$emit('inna.DynamicPackages.Search', o);

                } catch (e) {
                    if ($scope.hasOwnProperty(e.message)) {
                        $scope[e.message] = e;
                    }
                }
            }

            $scope.$on('$locationChangeSuccess', function (data, url, datatest) {
                var oldRouteParams = routeParams;

                routeParams = parseRoute(url);

                if (!angular.equals(oldRouteParams, routeParams)) {
                    $scope.$broadcast('DYNAMIC.locationChange', routeParams);
                }
            });

            $(window).on('unload beforeunload', function () {
                DynamicPackagesCacheWizard.clear();
            });
        }
    ]);