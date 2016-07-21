innaAppDirectives.directive('locationSelector', [
    '$templateCache',
    '$location',
    '$timeout',
    '$routeParams',
    'eventsHelper',
    'serviceCache',
    'dataService',
    'EventManager',
    function ($templateCache) {
        return{
            replace: true,
            template: $templateCache.get("components/location-selector/templ/index.html"),
            /**
             * typeSearch может принимать следующие значения
             * c другими сломается нафик
             * typeSearch === DP_from
             * typeSearch === DP_to
             * typeSearch === AVIA_from
             * typeSearch === AVIA_to
             */
            scope: {
                theme: '@',
                placeholder: '@',
                selectedValue: '=selectedValue',
                typeSearch: '@',
                useHorizontalForm: '=',
                tabIndex: '='
            },
            controller: function ($rootScope, $scope, $timeout, $routeParams, eventsHelper, serviceCache, dataService, EventManager) {
                
                $scope.isEnableClearIcon = false;

                
                /**
                 * функция установки локации
                 * $scope.currentCity - название выбранного города
                 * $scope.selectedValue - id выбранного города
                 * @param value - объект с локацией
                 */
                $scope.setCurrentCity = function (data, doNotUpdateText) {
                    serviceCache.createObj($scope.typeSearch, data);
                    var name = [data.Name];

                    name.push(data.CountryName);

                    if (!doNotUpdateText) {
                        $scope.currentCity = name.join(', ');
                        EventManager.fire("locationSelectorChange", data);
                    }

                    $scope.selectedValue = data;
                };

                $scope.clearCityField = function () {
                    $scope.currentCity = null;
                    $scope.selectedValue = null;
                    $scope.selectionControl.selectedIndex = null;
                    $scope.isEnableClearIcon = false;
                };


                /**
                 * если локация сохранена в кеше то берем её оттуда
                 */
                var cacheLocation = serviceCache.getObject($scope.typeSearch);
                var cacheLocationId = cacheLocation ? cacheLocation.Id : undefined;

                /**
                 * установка локации для ДП
                 * проверятся id локации из url и localstorage
                 * @param route_id
                 */
                var setLocationDP = function (id) {
                    if (!cacheLocationId && !id && $scope.typeSearch == 'DP_from') {
                        dataService.getCurrentLocation().then(function (data) {
                            $scope.$apply(function ($scope) {
                                $scope.setCurrentCity(data)
                            })
                        })
                    }
                    if (id && cacheLocationId) {
                        if (id == cacheLocationId) {
                            $scope.setCurrentCity(cacheLocation);
                        } else {
                            dataService.getDPLocationById(id).then(function (data) {
                                $scope.setCurrentCity(data);
                            })
                        }
                    }
                    if (!id && cacheLocationId) {
                        $scope.setCurrentCity(cacheLocation);
                    }
                    if (id && !cacheLocationId) {
                        dataService.getDPLocationById(id).then(function (data) {
                            $scope.setCurrentCity(data);
                        })
                    }
                };

                $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
                    if ($scope.typeSearch == 'DP_from') {
                        setLocationDP($routeParams.DepartureId);
                    }
                    if ($scope.typeSearch == 'DP_to') {
                        setLocationDP($routeParams.ArrivalId);
                    }
                });


                if ($scope.typeSearch == 'DP_from') {
                    setLocationDP($routeParams.DepartureId);
                }
                if ($scope.typeSearch == 'DP_to') {
                    setLocationDP($routeParams.ArrivalId);
                }


                /**
                 * получение списка локация для автокомплита
                 * @param txt
                 * @returns {*}
                 * $scope.typeSearch === DP_from
                 * $scope.typeSearch === DP_to
                 * $scope.typeSearch === AVIA_from
                 * $scope.typeSearch === AVIA_to
                 */
                //                console.log($scope.typeSearch)
                var getLocation = function (txt) {
                    switch ($scope.typeSearch) {
                        case 'DP_from':
                            return dataService.getDPFromListByTerm(txt);
                        case 'DP_to':
                            return dataService.getDPToListByTerm(txt);
                    }
                };


                /**
                 * Валидация
                 * отслеживаем изменения занчения $scope.selectedValue
                 * если тип значения Error, показываем ошибку
                 */
                $scope.$watch('selectedValue', function (value) {
                    if (value instanceof Error) {
                        $scope.fieldError = value.error;
                        $scope.selectedValue = undefined;
                    }
                });

                $scope.$watch('currentCity', function (value) {
                    if(value) {
                        $scope.isEnableClearIcon = true;
                    } else {
                        $scope.isEnableClearIcon = false;
                    }
                });


                /**
                 * BEGIN:: Автокомплит
                 */
                function selectionControl() {
                    var self = this;
                    self.selectedIndex = 0;
                    self.list = [];
                    self.init = function () {
                        self.list = [];
                        self.selectedIndex = 0;

                        if ($scope.fromList != null) {
                            //items
                            for (var i = 0; i < $scope.fromList.length; i++) {
                                var item = $scope.fromList[i];
                                self.list.push(item);
                                if (item.Airport != null) {
                                    //airports
                                    for (var j = 0; j < item.Airport.length; j++) {
                                        var airPort = item.Airport[j];
                                        self.list.push(airPort);
                                    }
                                }
                            }
                        }
                        //проставляем первый выбранный
                        if (self.list.length > 0) {
                            self.list[0].isSelected = true;
                            self.scrollToFirstItem();
                            self.updateInputText();
                        }
                    };
                    self.isItemSelected = function (item) {
                        return (item.isSelected == true);
                    };
                    self.selectNext = function () {
                        if (self.list.length > 0) {
                            if ((self.selectedIndex + 1) < self.list.length) {
                                self.list[self.selectedIndex].isSelected = false;
                                self.selectedIndex++;
                                self.list[self.selectedIndex].isSelected = true;
                                self.scrollToItem();
                                self.updateInputText();
                            }
                        }
                    };
                    self.selectPrev = function () {
                        if (self.list.length > 0) {
                            if ((self.selectedIndex - 1) >= 0) {
                                self.list[self.selectedIndex].isSelected = false;
                                self.selectedIndex--;
                                self.list[self.selectedIndex].isSelected = true;
                                self.scrollToItem();
                                self.updateInputText();
                            }
                        }
                    };
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
                    };
                    self.setSelected = function (doNotUpdateText, item) {
                        if (item) {
                            self.selectedIndex = _.indexOf(self.list, item)
                        }
                        var i = self.list[self.selectedIndex];
                        if (i) {
                            $scope.setCurrentCity(i, doNotUpdateText);
                        }
                    }
                }

                $scope.selectionControl = new selectionControl();


                /**
                 * получение от сервера объекта для автокомплита
                 * получаем промис объект из функции getLocation
                 */
                var getAutocompleteList = _.debounce(function () {
                    if ($scope.currentCity) {
                        var preparedText = $scope.currentCity.split(', ')[0].trim();
                        getLocation(preparedText).then(function (data) {
                            if (data.length > 0) {
                                $scope.$apply(function ($scope) {
                                    $scope.fromList = data;
                                    $scope.selectionControl.init();
                                    $scope.isOpened = true;
                                });
                            }
                        })
                    }
                }, 300);


                $scope.setCurrentCityClick = function ($event, item) {
                    $event && eventsHelper.preventBubbling($event);
                    $scope.selectionControl.setSelected(false, item);
                    $scope.isOpened = false;
                    $scope.$broadcast("currentCityChangeClick");
                };


                //ToDO починить при вводе !Москва, ! выводит пустоту
                $scope.currentCityChange = function ($event) {
                    $event && eventsHelper.preventBubbling($event);
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
                            $scope.blurBlocked = false;
                            $scope.$on("currentCityChangeClick", function ($event) {
                                $scope.blurBlocked = true;
                            })
                            if ($scope.blurBlocked = false) {
                                $scope.timeoutId = $timeout(function () {
                                    $scope.$apply(function ($scope) {
                                        $scope.selectionControl.setSelected();
                                        $scope.isOpened = false;
                                    });
                                }, 300);
                            }
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
                };

                /**
                 * END:: Автокомплит
                 */

                function clickHanlder(event) {
                    $scope.$apply(function ($scope) {
                        $scope.selectionControl.setSelected();
                        $scope.isOpened = false;
                    });
                    $(document).off('click', clickHanlder);
                }

                $(document).click(clickHanlder);


                $scope.$on('$destroy', function () {
                    $(document).off('focus');
                    $(document).off('click', clickHanlder);
                });

            },
            link: function ($scope) {

            }
        }
    }]);