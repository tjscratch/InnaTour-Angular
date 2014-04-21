angular.module('innaApp.controllers')
    .controller('DynamicReserveTicketsCtrl', [
        '$scope', '$controller', '$routeParams', '$location', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider',
        function($scope, $controller, $routeParams, $location, DynamicFormSubmitListener, DynamicPackagesDataProvider){
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
                        $scope.item = data.RecommendedPair.AviaInfo;

                        $scope.initPayModel();

                        $scope.combination.Hotel = data.RecommendedPair.Hotel;
                        $scope.combination.Ticket = data.RecommendedPair.AviaInfo;
                    });
                });
            })();

            DynamicFormSubmitListener.listen();

            $scope.objectToReserveTemplate = '/spa/templates/pages/dynamic/inc/reserve.html';

            console.log('hi from DynamicReserveTicketsCtrl', $routeParams, $scope);
        }
    ]);