
'use strict';

/* Controllers */

innaAppControllers.
    controller('SearchResultCtrl', ['$log', '$scope', '$routeParams', '$filter', '$location', 'dataService',
        function SearchResultCtrl($log, $scope, $routeParams, $filter, $location, dataService) {

            var self = this;
            function log(msg) {
                $log.log(msg);
            }

            //инициализация
            initValues();
            initFuctions();
            initWatch();

            //обрабатываем параметры из queryString'а
            var params = $routeParams;
            $scope.criteria = UrlHelper.restoreAnyToNulls(params);
            //log('$routeParams: ' + angular.toJson($routeParams));
            //log('$scope.criteria: ' + angular.toJson($scope.criteria));
            //$scope.startSearchTours();

            var locationParams = { cityUrl: params.FromCityUrl, countryUrl: params.ToCountryUrl, regionUrl: params.ToRegionUrl }

            //запрашиваем парамерты по их Url'ам
            $scope.isDataLoading = true;
            dataService.getLocationsByUrls(log, locationParams, function (data) {
                //обновляем данные
                if (data.city != null) {
                    $scope.criteria.FromCity = data.city.name;
                    $scope.criteria.FromCityId = data.city.id;
                    $scope.criteria.FromCityUrl = data.city.url;
                }
                if (data.country != null) {
                    $scope.criteria.ToCountry = data.country.name;
                    $scope.criteria.ToCountryId = data.country.id;
                    $scope.criteria.ToCountryUrl = data.country.url;
                }
                if (data.region != null) {
                    $scope.criteria.ToRegion = data.region.name;
                    $scope.criteria.ToRegionId = data.region.id;
                    $scope.criteria.ToRegionUrl = data.region.url;
                }
                //ищем
                $scope.startSearchTours();
            }, function (data, status) {
                //ошибка получения данных
                $scope.isDataLoading = false;
                log('getLocationsByUrls error: ' + status);
            });

            function initValues() {
                //флаг индикатор загрузки
                $scope.isDataLoading = false;

                //фильтр
                $scope.filter = new filter();
                //$scope.filter = new filter({ hotelStarsMin: 3, hotelStarsMax: 5 });
                //log('$scope.filter: ' + angular.toJson($scope.filter));

                //обнуляем список
                //var emptyArray = [];
                $scope.hotels = null;
                $scope.filteredHotels = null;
                $scope.searchId = 0;

                //кол-во туров
                $scope.toursCount = 0;
                
                //флаг, когда нужно придержать обновление фильтра
                $scope.isSuspendFilterWatch = false;
            };

            function initWatch() {
                //при изменении hotels = пересчитываем кол-во туров
                $scope.$watchCollection('hotels', function (newValue, oldValue) {

                    //лишний раз не пересчитываем, только если изменилось
                    if (newValue === oldValue) {
                        return;
                    }

                    //log('$scope.$watch hotels triggers, len: ' + $scope.hotels.length);

                    //мин макс цена
                    var minPrice = 10000000000;
                    var maxPrice = 0;
                    var mealsList = [];
                    var mealsIdsList = [];
                    var starsList = [];
                    var services = {};
                    var tourOperatorsList = [];

                    //считаем кол-во туров
                    var count = 0;
                    angular.forEach(newValue, function (hotel, key) {
                        //кол-во туров
                        count += parseInt(hotel.TourCount);

                        //мин макс цена для фильтра
                        var price = parseFloat(hotel.Price);
                        if (price < minPrice)
                            minPrice = price;
                        if (price > maxPrice)
                            maxPrice = price;

                        //питание
                        if (hotel.Meals != null) {
                            angular.forEach(hotel.Meals, function (meal, mealKey) {
                                //если нет в массиве
                                if ($.inArray(meal.id, mealsIdsList) < 0) {
                                    mealsIdsList.push(meal.id);
                                    mealsList.push(meal);
                                }
                            });
                        }
                        
                        //звезды
                        var iStar = parseInt(hotel.Stars,10);
                        if (!isNaN(iStar) && $.inArray(iStar, starsList) < 0) {
                            starsList.push(iStar);
                        }

                        //услуги
                        if (hotel.Services != null) {
                            if (hotel.Services.Internet == true && services.Internet != true)
                                services.Internet = true;
                            if (hotel.Services.Pool == true && services.Pool != true)
                                services.Pool = true;
                            if (hotel.Services.Aquapark == true && services.Aquapark != true)
                                services.Aquapark = true;
                            if (hotel.Services.Fitness == true && services.Fitness != true)
                                services.Fitness = true;
                            if (hotel.Services.ForChild == true && services.ForChild != true)
                                services.ForChild = true;
                        }

                        //туроператоры
                        if (hotel.Tours != null) {
                            angular.forEach(hotel.Tours, function (tour, tourKey) {
                                //если нет в массиве
                                if ($.inArray(tour.Provider.name, tourOperatorsList) < 0) {
                                    tourOperatorsList.push(tour.Provider.name);
                                }
                            });
                        }
                    });

                    $scope.toursCount = count;

                    if (minPrice != 10000000000 && maxPrice != 0) {
                        //log('setting min max prices');
                        $scope.filter.minPrice = minPrice;
                        $scope.filter.maxPrice = maxPrice;
                    }

                    $scope.filter.mealsList = mealsList;
                    $scope.filter.starsList = starsList;
                    $scope.filter.services = services;
                    $scope.filter.tourOperatorsList = tourOperatorsList;

                    //замораживаем обновление с фильтра
                    $scope.suspendFilterWatch(true);
                    //применяем фильтрацию
                    $scope.applyFilterToHotels();
                    $scope.suspendFilterWatch(false);
                });

                //изменение модели фильтра
                $scope.$watch('filter', function (newValue, oldValue) {
                    if (newValue === oldValue) {
                        return;
                    }
                    //применяем фильтрацию
                    $scope.applyFilterToHotels();
                }, true);
            };

            function initFuctions() {
                //тут меняем урл для поиска
                $scope.searchTours = function () {
                    var url = UrlHelper.UrlToSearch(angular.copy($scope.criteria));

                    //делаем переход и соответственно новый поиск только если url изменился
                    if ($location.path() != url) {
                        $location.path(url);
                    }
                };

                //начинаем поиск
                $scope.startSearchTours = function () {
                    log('startSearchTours in started');
                    //начинаем загрузку данных
                    $scope.isDataLoading = true;
                    //обнуляем модель
                    //$scope.hotels = emptyArray;
                    $scope.hotels = [];

                    log('search: ' + angular.toJson($scope.criteria));
                    //передаем критерии поиска, и класс hotel, чтобы привести результат к нему
                    dataService.startSearchTours(log, $scope.criteria, function (data) {
                        //обновляем данные
                        updateHotels(data);
                    }, function (data, status) {
                        //ошибка получения данных
                        $scope.isDataLoading = false;
                        log('startSearchTours error: ' + status);
                    });
                };

                //поиск - проверка результатов
                var checkSearchTours = function () {
                    log('checkSearchTours in progress...');
                    $scope.isDataLoading = true;

                    dataService.checkSearchTours(log, { SearchId: $scope.searchId }, function (data) {
                        //обновляем данные
                        updateHotels(data);
                    }, function (data, status) {
                        //ошибка получения данных
                        $scope.isDataLoading = false;
                        log('checkSearchTours error: ' + status);
                    });
                };

                //обновляем модель
                var updateHotels = function (data) {
                    if (data != null) {

                        var newHotels = angular.copy($scope.hotels);
                        //id для запроса поиска
                        $scope.searchId = data.Token.SearchId;

                        if (data.Hotels != null && data.Hotels.length > 0) {
                            $.each(data.Hotels, function (index, itemHotel) {
                                //ищем в уже показанных отелях
                                var match = $filter('arrayFirst')(newHotels, function (item) {
                                    return itemHotel.HotelId === item.HotelId;
                                });

                                var hotelObj;
                                if (match) {
                                    hotelObj = match;
                                } else {
                                    hotelObj = new hotel(itemHotel);
                                }

                                if (!match) {
                                    newHotels.push(hotelObj);
                                }
                            });

                            $scope.hotels = newHotels;
                        }

                        if (!data.EndOfData) {
                            setTimeout(checkSearchTours, 1000);
                        } else {
                            $scope.isDataLoading = false;
                            log('startSearchTours finished');
                        }
                    } else {
                        $scope.isDataLoading = false;
                        log('startSearchTours finished');
                    }
                };

                $scope.applyFilterToHotels = function () {

                    var input = $scope.hotels;
                    var filter = $scope.filter;

                    var minPrice = filter.minPrice;
                    var maxPrice = filter.maxPrice;
                    var hotelName = filter.hotelName;

                    function setFilteredPrice(hotel, min) {
                        var prices = hotel.Prices;
                        var fPrice = parseFloat(hotel.Price);
                        
                        //находим фильтрованную мин цену, но не меньше min
                        var defaultMinPrice = 10000000000;
                        var filteredMinPrice = defaultMinPrice;
                        angular.forEach(hotel.Prices, function (value, key) {
                            //проходит нижний порог
                            if (value >= min && (value < filteredMinPrice || value == 0)) {
                                filteredMinPrice = value;
                            }
                        });

                        if (filteredMinPrice != defaultMinPrice)
                            hotel.FilteredMinPrice = filteredMinPrice;
                    };

                    //пропускаем пустые
                    if ($scope.isSuspendFilterWatch == true/* || minPrice == null || maxPrice == null*/) {
                        //console.log('applyFilterToHotels skip: ' + angular.toJson(filter));
                        return input;
                    }

                    console.log('applyFilterToHotels: ' + angular.toJson(filter));

                    var out = [];
                    //если не изменился - возвращаем тот же объект
                    var isChanged = false;
                    if (input != null) {
                        for (var i = 0; i < input.length; i++) {
                            var hotel = input[i];

                            var passFilterByName = true;
                            //если задан фильтр по имени
                            if (hotelName != null && hotelName.length > 0) {
                                //не чувств. к регистру
                                if (hotel.HotelName.toLowerCase().indexOf(hotelName.toLowerCase()) > -1)
                                    passFilterByName = true;
                                else
                                    passFilterByName = false;
                            }

                            //фильтруем и устанавливаем фильтрованую цену
                            setFilteredPrice(hotel, minPrice);
                            var fPrice = hotel.FilteredMinPrice;

                            if (passFilterByName &&
                                fPrice >= minPrice && fPrice <= maxPrice && //мин макс цена
                                (!(hotel.Stars > 0) || (hotel.Stars >= filter.hotelStarsMin && hotel.Stars <= filter.hotelStarsMax)) //если есть звезды, фильтр мин макс
                                ) {
                                out.push(hotel);
                            }
                            else
                                isChanged = true;
                        }
                    }

                    if (isChanged)
                        $scope.filteredHotels = out;
                    else
                        $scope.filteredHotels = input;
                };
                
                //приостановить обновлене модели фильтра
                $scope.suspendFilterWatch = function (isSuspend) {
                    //log('suspendFilterWatch: ' + isSuspend);
                    $scope.isSuspendFilterWatch = isSuspend;
                };

                //переход на страницу отеля
                $scope.goToHotelDetails = function (hotel) {
                    window.open(UrlHelper.UrlToHotelDetails(hotel.HotelId, $scope.searchId));
                };
            };
        }]);
