innaAppControllers.controller('HotelsIndexController', function ($rootScope, $scope, $routeParams, $location, $timeout,
                                                                 AppRouteUrls, Balloon, HotelService, dataService,
                                                                 EventManager, innaAppApiEvents) {

    // toDo хрень какая то, удалить надо бы
    document.body.classList.add('bg_gray-light');
    document.body.classList.remove('light-theme');


    /**
     * при переходе на данную страницу
     * показываем прелоадер на время
     * получения ответа с результатами поиска
     */
    $scope.baloonHotelLoad = new Balloon();
    $scope.baloonHotelLoad.updateView({
        template: 'search.html',
        callbackClose: function () {
            $scope.redirectHotels();
        },
        callback: function () {
            $scope.redirectHotels();
        }
    });


    /**
     * клик на балуне, по кнопке закрыть или "прервать поиск"
     * редиректим на /hotels/
     */
    $scope.redirectHotels = function () {
        $scope.baloonHotelLoad.teardown();
        $scope.baloonHotelNotFound.teardown();
        $location.path(AppRouteUrls.URL_HOTELS);
    };

    $scope.filtersSettingsHotels = null;
    $scope.asMap = false;
    $scope.activePanel = 'hotels';


    if ($routeParams) {
        var searchParams = angular.copy($routeParams);
        //self.passengerCount = Math.ceil($routeParams.Adult) + Math.ceil($routeParams.ChildrenCount);
        //searchParams.Adult = self.passengerCount;
        searchParams.Adult = $routeParams.Adult;
        //searchParams.ChildrenCount = null;

        if (searchParams.Children) {
            searchParams.ChildrenAges = searchParams.Children.split('_');
        }

        var help = dateHelper;
        var today = help.getTodayDate();
        var startDate = dateHelper.apiDateToJsDate(searchParams.StartVoyageDate);
        if (+today <= +startDate) {
            $scope.baloonHotelLoad.show();
            /**
             * Трекаем события для GTM
             * https://innatec.atlassian.net/browse/IN-7071
             */
            if (searchParams.Children) {
                var Travelers = searchParams.Adult + "-" + searchParams.Children.length;
                var TotalTravelers = Math.ceil(searchParams.Adult) + Math.ceil(searchParams.Children.length);
            } else {
                var Travelers = searchParams.Adult + "-" + 0;
                var TotalTravelers = Math.ceil(searchParams.Adult);
            }
            dataService.getLocationById($routeParams.ArrivalId)
                .then(function (res) {
                    var CityCode = res.data.CountryName + "/" + res.data.Name;
                    var dataLayerObj = {
                        'event': 'UI.PageView',
                        'Data': {
                            'PageType': 'HotelsSearchLoading',
                            'CityCode': CityCode,
                            'DateFrom': searchParams.StartVoyageDate,
                            'NightCount': searchParams.NightCount,
                            'Travelers': Travelers,
                            'TotalTravelers': TotalTravelers
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                });

            HotelService.getHotelsList(searchParams)
                .then(function (response) {
                    if (response.status == 200 && response.data.Hotels.length > 0) {
                        $scope.hotels = response.data.Hotels;
                        $scope.baloonHotelLoad.teardown();

                        /* данный для настроек панели фильтров */
                        $scope.filtersSettingsHotels = {
                            filtersData: response.data.Filter,
                            Collection: $scope.hotels,
                            filter_hotel: true,
                            filter_avia: false
                        };

                        /**
                         * Трекаем события для GTM
                         * https://innatec.atlassian.net/browse/IN-7071
                         */
                        dataService.getLocationById($routeParams.ArrivalId)
                            .then(function (res) {
                                var CityCode = res.data.CountryName + "/" + res.data.Name;
                                var dataLayerObj = {
                                    'event': 'UI.PageView',
                                    'Data': {
                                        'PageType': 'HotelsSearchLoad',
                                        'CityCode': CityCode,
                                        'DateFrom': searchParams.StartVoyageDate,
                                        'NightCount': searchParams.NightCount,
                                        'Travelers': Travelers,
                                        'TotalTravelers': TotalTravelers,
                                        'HotelResultsQuantity': $scope.hotels.length,
                                        'MinPrice': $scope.hotels[0].Price
                                    }
                                };
                                console.table(dataLayerObj);
                                if (window.dataLayer) {
                                    window.dataLayer.push(dataLayerObj);
                                }
                            });



                    } else {
                        $scope.baloonHotelNotFound = new Balloon();
                        $scope.baloonHotelNotFound.updateView({
                            template: 'not-found.html',
                            title: 'Мы ничего не нашли',
                            content: "Попробуйте изменить условия поиска",
                            callbackClose: function () {
                                $scope.redirectHotels();
                            },
                            callback: function () {
                                $scope.redirectHotels();
                            },
                        });
                    }
                }, function (response) {
                    console.log(response)
                    $scope.baloonHotelLoad.updateView({
                        template: 'err.html',
                        title: 'Что-то пошло не так',
                        content: 'Попробуйте начать поиск заново',
                        callbackClose: function () {
                            $scope.redirectHotels();
                        },
                        callback: function () {
                            $scope.redirectHotels();
                        }
                    });
                });
        } else {
            $scope.baloonHotelLoad.updateView({
                template: 'err.html',
                title: 'Дата заезда должна быть больше текущей даты!',
                content: 'Попробуйте начать поиск заново',
                callbackClose: function () {
                    $scope.redirectHotels();
                },
                callback: function () {
                    $scope.redirectHotels();
                }
            });
        }
    }

    EventManager.on(innaAppApiEvents.FILTER_PANEL_CHANGE, function (data) {
        $scope.$apply(function () {
            $scope.hotels = data;
        })
    });

    $scope.filters = HotelService.getHotelFilters();


    //var datasource = {};
    //
    //datasource.get = function (index, count, success) {
    //    $timeout(function () {
    //        success($scope.hotels.slice(index, index + count));
    //    }, 0);
    //};
    //
    //$scope.datasource = datasource;


    if ($routeParams) {
        var searchParams = angular.copy($routeParams);
        if (searchParams.Children) {
            searchParams.Children = searchParams.Children.split('_').map(function (age) {
                return {value: age};
            });
        }
        $scope.getHotelUrl = function (hotelId, providerId) {
            var url = '/#' + HotelService.getHotelsShowUrl(hotelId, providerId, searchParams);
            return url
        };
    }


    $scope.$on('$destroy', function () {
        if ($scope.baloonHotelLoad) {
            $scope.baloonHotelLoad.teardown();
            $scope.baloonHotelLoad = null;
        }
        if ($scope.baloonHotelNotFound) {
            $scope.baloonHotelNotFound.teardown();
            $scope.baloonHotelNotFound = null;
        }
    });
});
