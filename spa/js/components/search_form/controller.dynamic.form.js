innaAppControllers
    .controller('DynamicFormCtrl', [
        '$scope',
        '$rootScope',
        'serviceCache',
        'Validators',
        '$location',
        'innaApp.Urls',
        'EventManager',
        'innaAppApiEvents',
        function ($scope, $rootScope, serviceCache, Validators, $location, URLs, EventManager, Events) {

            $scope.isOpenSearchForm = true;

            if (window.partners) {
                var part = window.partners.getPartner();
                if (part) {
                    $scope.useHorizontalForm = part.horizontalForm;
                }
            }

            $scope.$on('DYNAMIC_OPEN_SEARCH_FORM', function (event, data) {
                if(data.open) {
                    $scope.isOpenSearchForm = true;
                } else {
                    $scope.isOpenSearchForm = false;
                }
            });

            function wlDataControl() {
                var self = this;

                self.WL_TODAY_KEY = 'WL_TODAY_KEY';

                self.getToday = function () {
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth() + 1; //January is 0!
                    var yyyy = today.getFullYear();

                    if (dd < 10) {
                        dd = '0' + dd
                    }

                    if (mm < 10) {
                        mm = '0' + mm
                    }

                    today = dd + '/' + mm + '/' + yyyy;
                    return today;
                };

                self.saveTodayForWl = function () {
                    localStorage.setItem(self.WL_TODAY_KEY, self.getToday());
                };

                self.checkResetCache = function () {
                    if (window.partners && window.partners.isFullWL()) {
                        //дата последнего захода на wl
                        var wlLastDate = localStorage.getItem(self.WL_TODAY_KEY) || null;
                        var today = self.getToday();
                        //console.log('wlLastDate: ' + wlLastDate + ' today: ' + today);
                        //если дата изменилась - то сбрасываем ключи в local.storage
                        if (wlLastDate != today) {
                            serviceCache.clear();
                        }
                    }
                };

                self.checkSaveTodayForWl = function () {
                    //сохраняем дату захода на WL
                    if (window.partners && window.partners.isFullWL()) {
                        self.saveTodayForWl();
                    }
                };
            }

            $scope.wlDataControl = new wlDataControl();
            $scope.wlDataControl.checkResetCache();

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

            $scope.routeParams = parseRoute($location.path());


            /**
             * устанавливаем значение города вылета и города назначения
             */

            $scope.$watchGroup(['fromCity', 'toCity'], function (data) {
                $scope.fromCity = data[0];
                $scope.toCity = data[1];
            });

            function validate() {
                Validators.required($scope.fromCity, Error('fromCity'), "Введите город отправления");
                Validators.required($scope.toCity, Error('toCity'), "Введите город или страну, куда планируете поехать");
                Validators.noEqual($scope.fromCity.Id, $scope.toCity.Id, Error('toCity'), "Города отправления и назначения должны отличаться");

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


            /*Begin date*/
            if (serviceCache.require('dateBegin')) {
                $scope.dateBegin = $scope.routeParams.StartVoyageDate || serviceCache.require('dateBegin');
            }else{
                $scope.$watch('routeParams', function (data) {
                    $scope.dateBegin = $scope.routeParams.StartVoyageDate;
                })
            }

            $scope.$watch('dateBegin', function (newVal) {
                serviceCache.put('dateBegin', newVal);
            });

            /*End date*/
            if (serviceCache.require('dateEnd')) {
                $scope.dateEnd = $scope.routeParams.EndVoyageDate || serviceCache.require('dateEnd');
            } else {
                $scope.$watch('routeParams', function (data) {
                    $scope.dateEnd = $scope.routeParams.EndVoyageDate;
                })
            }

            $scope.$watch('dateEnd', function (newVal) {
                serviceCache.put('dateEnd', newVal);
            });

            $scope.maxDateEnd = new Date();


            $scope.maxDateEnd.setMonth($scope.maxDateEnd.getMonth() + 12);


            //TODO fix English
            if (window.partners && window.partners.isFullWL()) {
                var storageAges = JSON.parse(serviceCache.require('childrensAge'));
                $scope.childrensAge = $scope.routeParams.ChildrenAges || storageAges || [];
                $scope.childrenCount = ($scope.routeParams.ChildrenAges && $scope.routeParams.ChildrenAges.length) || serviceCache.require('childrenCount') || 0;
                $scope.adultCount = $scope.routeParams.Adult || serviceCache.require('adultCount') || 2;
            }
            else {
                /*Children ages*/
                $scope.childrensAge = $scope.routeParams.ChildrenAges || [];
                /*Children count*/
                $scope.childrenCount = ($scope.routeParams.ChildrenAges && $scope.routeParams.ChildrenAges.length) || 0;
                /*Adult count*/
                $scope.adultCount = $scope.routeParams.Adult || 2;
            }

            $scope.$watch('adultCount', function (newVal, oldVal) {
                serviceCache.put('adultCount', newVal);

                // if(newVal && newVal != oldVal) {
                //     var dataLayerObj = {
                //         'event': 'UM.Event',
                //         'Data': {
                //             'Category': 'Packages',
                //             'Action': 'Adults',
                //             'Label': newVal,
                //             'Content': newVal + $scope.childrenCount,
                //             'Context': newVal > oldVal ? 'plus' : 'minus',
                //             'Text': '[no data]'
                //         }
                //     };
                //     console.table(dataLayerObj);
                //     if (window.dataLayer) {
                //         window.dataLayer.push(dataLayerObj);
                //     }
                // }
            });
            $scope.$watch('childrenCount', function (newVal, oldVal) {
                serviceCache.put('childrenCount', newVal);
                // if(newVal || newVal == 0 && newVal != oldVal) {
                //     var dataLayerObj = {
                //         'event': 'UM.Event',
                //         'Data': {
                //             'Category': 'Packages',
                //             'Action': 'Childrens',
                //             'Label': newVal,
                //             'Content': newVal + $scope.adultCount,
                //             'Context': newVal > oldVal ? 'plus' : 'minus',
                //             'Text': '[no data]'
                //         }
                //     };
                //     console.table(dataLayerObj);
                //     if (window.dataLayer) {
                //         window.dataLayer.push(dataLayerObj);
                //     }
                // }
            });
            $scope.$watch('childrensAge', function (newVal) {
                serviceCache.put('childrensAge', JSON.stringify(newVal));
            }, true);


            /*Klass*/
            $scope.klass = _.find(TripKlass.options, function (klass) {
                var cached = $scope.routeParams.TicketClass ||
                    serviceCache.require('klass', function () {
                        return TripKlass.ECONOM;
                    });

                return (klass.value == cached);
            });


            $scope.$watchCollection('klass', function (newVal) {
                newVal = newVal || TripKlass.options[0];
                serviceCache.put('klass', newVal.value);
            });


            /*Methods*/
            $scope.searchStart = function ($event) {
                if ($event && $event.target) {
                    var el = $($event.target);
                    //если клик - пришел из фокуса
                    if (el.data('simulate')) {
                        return;
                    }
                }

                if (window.partners && window.partners.isFullWL()) {
                    window.partners.scrollToTop();
                }

                // если есть get параметр map=show, удалаяем его
                if ($location.search().map) {
                    delete $location.$$search.map;
                    $location.$$compose();
                }
                try {
                    validate();
                    //if ok

                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Packages',
                            'Action': 'PackagesSearch',
                            'Label': '[no data]',
                            'Content': '[no data]',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }

                    var today = +(new Date());
                    var begin = Date.fromDDMMYY($scope.dateBegin);
                    var end = Date.fromDDMMYY($scope.dateEnd);

                    var duration = parseInt((end - begin) / 86400000); //days
                    var startLessThanAYear = moment(begin).isBefore(moment(today).add(1, 'y'));

                    //half of a year
                    //or
                    //longer then 28 days
                    if (!startLessThanAYear || duration > 28) {
                        $scope.baloon.showErr('Продолжительность путешествия должна быть не более 28 дней.');

                        throw 1;
                    }

                    var o = {
                        ArrivalId: $scope.toCity.Id,
                        DepartureId: $scope.fromCity.Id,
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
                var oldRouteParams = $scope.routeParams;

                $scope.routeParams = parseRoute(url);

                if (!angular.equals(oldRouteParams, $scope.routeParams)) {
                    $scope.$broadcast('DYNAMIC.locationChange', $scope.routeParams);
                }
            });

            //сохраняем дату захода на WL
            $scope.wlDataControl.checkSaveTodayForWl();

            $(window).on('unload beforeunload', function () {
                if (window.partners && window.partners.isFullWL()) {
                    //ничего не делаем
                }
                else {
                    serviceCache.clear();
                }
            });
        }
    ]);