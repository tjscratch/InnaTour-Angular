innaAppControllers.controller('HotelsIndexController', function ($rootScope, $scope, $routeParams, $location, $timeout,
                                                                 AppRouteUrls, Balloon, HotelService,
                                                                 EventManager, innaAppApiEvents) {

    // toDo хрень какая то, удалить надо бы
    document.body.classList.add('bg_gray-light');
    document.body.classList.remove('light-theme');


    /**
     * Отели у нас работают только для b2b клиентов
     * поэтому если не b2b пользователь попал на страницу отелей
     * редиректим его на главную
     */
    //$timeout(function () {
    //    var isAgency = false;
    //    if ($rootScope.$root.user) {
    //        if (parseInt($rootScope.$root.user.getAgencyId()) == 20005 || parseInt($rootScope.$root.user.getAgencyId()) == 2) {
    //            isAgency = true;
    //        }
    //    }
    //    if (isAgency == false) {
    //        $location.path('/#/');
    //    }
    //}, 500);


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

        if(searchParams.Children){
            searchParams.ChildrenAges = searchParams.Children.split('_');
        }


        $scope.baloonHotelLoad.show();
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
    }

    EventManager.on(innaAppApiEvents.FILTER_PANEL_CHANGE, function (data){
        $scope.$apply(function (){
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
        if(searchParams.Children){
            searchParams.Children = searchParams.Children.split('_').map(function (age) {
                return { value: age };
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
