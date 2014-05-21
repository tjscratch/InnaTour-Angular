angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope', '$controller', '$routeParams', '$location', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', 'aviaHelper',
        'paymentService', 'innaApp.Urls',
        function ($scope, $controller, $routeParams, $location, DynamicFormSubmitListener, DynamicPackagesDataProvider, aviaHelper,
            paymentService, Urls) {

            //$scope.baloon.show('Проверка доступности билетов', 'Подождите пожалуйста, это может занять несколько минут');
            //initial
            (function(){
                var children = $routeParams.Children ?
                    _.partition($routeParams.Children.split('_'), function(age){ return age > 2; }) :
                    [[], []];

                var searchParams = angular.copy($routeParams);
                var cacheKey = '';

                searchParams.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.StartVoyageDate);
                searchParams.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(searchParams.EndVoyageDate);
                searchParams.Children && (searchParams.ChildrenAges = searchParams.Children.split('_'));

                if($location.search().hotel) searchParams['HotelId'] = $location.search().hotel;
                if($location.search().ticket) searchParams['TicketId'] = $location.search().ticket;

                $scope.combination = {};

                DynamicPackagesDataProvider.search(searchParams, function(data){
                    cacheKey = data.SearchId;

                    $scope.$apply(function($scope){
                        $controller('ReserveTicketsCtrl', { $scope: $scope });
                        $scope.fromDate = $routeParams.StartVoyageDate;
                        $scope.AdultCount = parseInt($routeParams.Adult);
                        $scope.ChildCount = children[0].length;
                        $scope.InfantsCount = children[1].length;
                        $scope.peopleCount = $scope.AdultCount + $scope.ChildCount + $scope.InfantsCount;

                        $scope.ticketsCount = aviaHelper.getTicketsCount($scope.AdultCount, $scope.ChildCount, $scope.InfantsCount);
                        $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $routeParams.TicketClass);

                        //дополняем полями 
                        aviaHelper.addCustomFields(data.RecommendedPair.AviaInfo);
                        $scope.item = data.RecommendedPair.AviaInfo;
                                     
                        function addAggInfo(item) {
                            //для звезд (особенности верстки)
                            item.starsList = _.generateRange(1, item.Stars);
                            item.taStarsList = _.generateRange(1, item.TaFactor);

                            item.CheckInDate = dateHelper.apiDateToJsDate(item.CheckIn);
                            item.CheckOutDate = dateHelper.apiDateToJsDate(item.CheckOut);
                        }

                        addAggInfo(data.RecommendedPair.Hotel);
                        $scope.hotel = data.RecommendedPair.Hotel;

                        function getCheckParams() {
                            var qData = {
                                HotelId: $scope.hotel.HotelId,
                                HoteProviderId: $scope.hotel.ProviderId,
                                Rooms: $scope.hotel.SelectedRoomId,//???
                                TicketToId: $scope.item.VariantId1,
                                TicketBackId: $scope.item.VariantId2,
                                TicketClass: $routeParams.TicketClass,
                                'Filter[DepartureId]': $routeParams.DepartureId,
                                'Filter[ArrivalId]': $routeParams.ArrivalId,
                                'Filter[StartVoyageDate]': searchParams.StartVoyageDate,
                                'Filter[EndVoyageDate]': searchParams.EndVoyageDate,
                                'Filter[TicketClass]': $routeParams.TicketClass,
                                'Filter[Adult]': $routeParams.Adult
                            };
                            if ($routeParams.Children) {
                                var childs = $routeParams.Children.split('_');
                                qData['Filter[ChildrenAges]'] = [];
                                _.each(childs, function (age) {
                                    qData['Filter[ChildrenAges]'].push(age);
                                });
                            }
                            return qData;
                        }
                        //проверяем, что остались билеты для покупки
                        //paymentService.packageCheckAvailability(getCheckParams(),
                        //    function (data) {
                        //        //data = false;
                        //        if (data == "true") {
                        //            //если проверка из кэша - то отменяем попап
                        //            //$timeout.cancel(availableChecktimeout);

                        //            //загружаем все
                        //            loadDataAndInit();

                        //            //ToDo: debug
                        //            //$timeout(function () {
                        //            //    loadDataAndInit();
                        //            //}, 1000);
                        //        }
                        //        else {
                        //            //log('checkAvailability, false');
                        //            //$timeout.cancel(availableChecktimeout);

                        //            function goToSearch() {
                        //                //var url = urlHelper.UrlToAviaSearch(angular.copy($scope.criteria));
                        //                ////log('redirect to url: ' + url);
                        //                //$location.path(url);
                        //            }

                        //            $scope.baloon.showWithClose("Вариант больше недоступен", "Вы будете направлены на результаты поиска туров",
                        //                function () {
                        //                    goToSearch();
                        //                });

                        //            //$timeout(function () {
                        //            //    //очищаем хранилище для нового поиска
                        //            //    storageService.clearAviaSearchResults();
                        //            //    //билеты не доступны - отправляем на поиск
                        //            //    goToSearch();
                        //            //}, 3000);

                        //        }
                        //    },
                        //    function (data, status) {
                        //        //error
                        //        //$timeout.cancel(availableChecktimeout);
                        //        //showReserveError();
                        //    });
                        
                        function loadDataAndInit() {
                            $scope.initPayModel();
                        }

                        $scope.combination.Hotel = data.RecommendedPair.Hotel;
                        $scope.combination.Ticket = data.RecommendedPair.AviaInfo;

                        $scope.initPayModel();

                        console.log($scope.combination);
                    });
                });
            })();

            DynamicFormSubmitListener.listen();

            $scope.objectToReserveTemplate = '/spa/templates/pages/dynamic/inc/reserve.html';

            //console.log('hi from DynamicReserveTicketsCtrl', $routeParams, $scope);

            function showReserveError() {
                $scope.baloon.showErr("Что-то пошло не так", "Ожидайте, служба поддержки свяжется с вами, \nили свяжитесь с оператором по телефону <b>+7 495 742-1212</b>",
                    function () {
                        $location.path(Urls.URL_DYNAMIC_PACKAGES);
                    });
            }
        }
    ]);