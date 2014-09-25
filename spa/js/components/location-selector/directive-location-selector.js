innaAppDirectives.directive('locationSelector', [
    '$templateCache',
    '$location',
    '$timeout',
    '$routeParams',
    'eventsHelper',
    'serviceCache',
    'dataService',
    'DynamicPackagesDataProvider',
    function ($templateCache) {
        return{
            replace   : true,
            template  : $templateCache.get("components/location-selector/templ/index.html"),
            scope     : {
                theme        : '@',
                placeholder  : '@',
                currentCityId: '=currentCityId',
                typeSearch   : '=',
                isFrom       : '='
            },
            controller: function ($rootScope, $scope, $timeout, $routeParams, eventsHelper, serviceCache, dataService, DynamicPackagesDataProvider) {


                /**
                 * функция установки локации
                 * $scope.currentCity - название выбранного города
                 * $scope.currentCityId - id выбранного города
                 * @param value - объект с локацией
                 */
                $scope.setCurrentCity = function (data, airport, doNotUpdateText) {

                    // если приходит объект аэропорт, то выставляем его
                    var currentData;
                    if (airport) {
                        currentData = airport;
                    } else if (data) {
                        currentData = data;
                    }

                    // сохраняем текущую локацию в кеше
                    serviceCache.createObj('currentLocation', currentData);

                    var name = [currentData.Name];
                    name.push(currentData.CountryName);

                    if (!doNotUpdateText) {
                        $scope.currentCity = name.join(', ');
                    }
                    $scope.currentCityId = currentData.Id;
                }


                /**
                 * получаем текущую локацию с сервера
                 * ворвращается promise объект
                 */
                var getCurrentLocationInServer = function () {
                    return dataService.getCurrentLocation()
                        .then(function (res) {
                            return res
                        })
                }


                /**
                 * если локация сохранена в кеше то берем её оттуда
                 */
                if ($scope.isFrom) {
                    var getCurrentLocationInCache = serviceCache.getObject('currentLocation')
                    if (getCurrentLocationInCache) {
                        $scope.setCurrentCity(getCurrentLocationInCache)
                    } else {
                        getCurrentLocationInServer().then(function (data) {
                            $scope.$apply(function ($scope) {
                                $scope.setCurrentCity(data)
                            })
                        })
                    }
                }


                /**
                 * Валидация
                 * отслеживаем изменения занчения $scope.currentCityId
                 * если тип значения Error, показываем ошибку
                 */
                $scope.$watch('currentCityId', function (value) {
                    if (value instanceof Error) {
                        $scope.fieldError = value.error;
                    }
                })


                /**
                 * BEGIN:: Автокомплит
                 */
                function selectionControl() {
                    var self = this;
                    self.selectedIndex = 0;
                    self.list = [];
                    self.item = function (item, option, airport) {
                        var res = {
                            item   : item,
                            option : option,
                            airport: airport
                        }
                        return res;
                    }
                    self.init = function () {
                        self.list = [];
                        self.selectedIndex = 0;

                        if ($scope.fromList != null) {
                            //items
                            for (var i = 0; i < $scope.fromList.length; i++) {
                                var item = $scope.fromList[i];
                                //self.list.push(item);
                                self.list.push(new self.item(item, item, null));
                                if (item.Airport != null) {
                                    //airports
                                    for (var j = 0; j < item.Airport.length; j++) {
                                        var airPort = item.Airport[j];
                                        //self.list.push(airPort);
                                        self.list.push(new self.item(airPort, item, airPort));
                                    }
                                }
                            }
                        }

                        //проставляем первый выбранный
                        if (self.list.length > 0) {
                            self.list[0].item.isSelected = true;
                            self.scrollToFirstItem();
                            self.updateInputText();
                        }
                    }
                    self.isItemSelected = function (item) {
                        return (item.isSelected == true);
                    }
                    self.selectNext = function () {
                        if (self.list.length > 0) {
                            if ((self.selectedIndex + 1) < self.list.length) {
                                self.list[self.selectedIndex].item.isSelected = false;
                                self.selectedIndex++;
                                self.list[self.selectedIndex].item.isSelected = true;
                                self.scrollToItem();
                                self.updateInputText();
                            }
                        }
                    }
                    self.selectPrev = function () {
                        if (self.list.length > 0) {
                            if ((self.selectedIndex - 1) >= 0) {
                                self.list[self.selectedIndex].item.isSelected = false;
                                self.selectedIndex--;
                                self.list[self.selectedIndex].item.isSelected = true;
                                self.scrollToItem();
                                self.updateInputText();
                            }
                        }
                    }
                    self.scrollToItem = function () {
                        var ind = self.selectedIndex;
                        //скролим где-то в середину (во всю высоту влезает где-то 10 итемов)
                        ind = ind - 5;
                        if (ind >= 0) {
                            var container = $(".search-autocomplete:eq('0')", angular.element('.b-location_selector'));
                            var scrollTo = $(".search-autocomplete-block:eq(" + ind + ")", container);
                            if (scrollTo.length > 0) {
                                var scrollToVal = scrollTo.offset().top - container.offset().top + container.scrollTop();

                                container.animate({
                                    scrollTop: scrollToVal
                                }, 50);
                            }
                            //log('scrollToItem: ' + ind);
                        }
                    };
                    self.scrollToFirstItem = function () {
                        var container = $(".search-autocomplete:eq('0')", angular.element('.b-location_selector'));
                        container.animate({
                            scrollTop: 0
                        }, 50);
                    };
                    self.updateInputText = function () {
                        self.setSelected(true);
                    }
                    self.setSelected = function (doNotUpdateText) {
                        var i = self.list[self.selectedIndex];
                        if (i) {
                            $scope.setCurrentCity(i.option, i.airport, doNotUpdateText);
                        }
                    }
                }

                $scope.selectionControl = new selectionControl();


                /**
                 * получение от сервера объекта для автокомплита
                 */
                var getAutocompleteList = _.debounce(function () {
                    if ($scope.currentCity) {
                        var preparedText = $scope.currentCity.split(',')[0].trim();
                        DynamicPackagesDataProvider.getFromListByTerm(preparedText, function (data) {
                            $scope.$apply(function ($scope) {
                                $scope.fromList = data;
                                $scope.selectionControl.init();
                                $scope.isOpened = true;
                            });
                        })
                    }
                }, 300);


                //ToDO починить при вводе !Москва, ! выводит пустоту
                $scope.currentCityChange = function ($event) {
                    var eventType = $event ? $event.type : null;
                    switch (eventType) {
                        case 'focus':
                            try {
                                $scope.fieldError = null;
                            } catch (e) {
                            }
                            getAutocompleteList();
                            break;
                        case 'blur':
                            $scope.timeoutId = $timeout(function () {
                                $scope.$apply(function ($scope) {
                                    $scope.selectionControl.setSelected();
                                    $scope.isOpened = false;
                                });
                            }, 300);
                            break;
                        case 'keyup':
                            var key = $event.keyCode || $event.which
                            switch (key) {
                                case 13:
                                    $scope.selectionControl.setSelected();
                                    $scope.isOpened = false;
                                    break;
                                case 38:
                                    if ($scope.isOpened) {
                                        $scope.selectionControl.selectPrev();
                                    }
                                    else {
                                        $scope.isOpened = true;
                                    }
                                    break;
                                case 40:
                                    if ($scope.isOpened) {
                                        $scope.selectionControl.selectNext();
                                    }
                                    else {
                                        $scope.isOpened = true;
                                    }
                                    break;
                                default:
                                    getAutocompleteList();
                                    break;
                            }
                            break;
                        default:
                            getAutocompleteList();
                            break;
                    }
                }
                /**
                 * END:: Автокомплит
                 */

            },
            link      : function () {
            }
        }
    }])