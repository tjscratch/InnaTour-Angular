angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope', '$controller', '$routeParams', '$location', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', 'aviaHelper',
        function ($scope, $controller, $routeParams, $location, DynamicFormSubmitListener, DynamicPackagesDataProvider, aviaHelper) {

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

                        //дополняем полями 
                        aviaHelper.addCustomFields(data.RecommendedPair.AviaInfo);
                        $scope.item = data.RecommendedPair.AviaInfo;
                                     
                        function addAggInfo(item) {
                            item.starsList = [];
                            for (var i = 0; i < item.Stars; i++) {
                                item.starsList.push(i);
                            }

                            item.CheckInDate = dateHelper.apiDateToJsDate(item.CheckIn);
                            item.CheckOutDate = dateHelper.apiDateToJsDate(item.CheckOut);

                            item.taStarsList = [];
                            for (var i = 0; i < item.TaFactor; i++) {
                                item.taStarsList.push(i);
                            }
                        }

                        addAggInfo(data.RecommendedPair.Hotel);
                        $scope.hotel = data.RecommendedPair.Hotel;
                        
                        $scope.initPayModel();

                        $scope.combination.Hotel = data.RecommendedPair.Hotel;
                        $scope.combination.Ticket = data.RecommendedPair.AviaInfo;

                        console.log($scope.combination);
                    });
                });
            })();

            DynamicFormSubmitListener.listen();

            $scope.objectToReserveTemplate = '/spa/templates/pages/dynamic/inc/reserve.html';

            //console.log('hi from DynamicReserveTicketsCtrl', $routeParams, $scope);
        }
    ]);