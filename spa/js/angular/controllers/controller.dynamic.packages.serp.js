innaAppControllers.
    controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', '$routeParams',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams) {
            /*EventListener*/
            DynamicFormSubmitListener.listen();

            /*Constants*/
            $scope.HOTELS_TAB = '/spa/templates/pages/dynamic_package_serp.hotels.html';
            $scope.TICKETS_TAB = '/spa/templates/pages/dynamic_package_serp.tickets.html';

            /*Properties*/
            $scope.combinations = [];
            $scope.hotels = [];
            $scope.tickets = [];

            $scope.currentCombination = null;

            $scope.showLanding = true;

            $scope.show = $scope.HOTELS_TAB;

            /*Data fetching*/
            (function loadData(params){
                params.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.StartVoyageDate);
                params.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.EndVoyageDate);

                console.time('loading_packages');
                console.log('loading data by params', angular.toParam(params));

                DynamicPackagesDataProvider.search(params, function(data){
                    console.timeEnd('loading_packages');

                    $scope.$apply(function($scope){
                        console.time('rendering');

                        $scope.combinations = data.Combinations;
                        $scope.hotels = data.Hotels;
                        $scope.tickets = data.Tickets;

                        $scope.showLanding = false;

                        $scope.currentCombination = $scope.combinations[0];

                        console.timeEnd('rendering');
                    });
                });
            })(angular.copy($routeParams));

            /*Methods*/
            $scope.getTicketByCombination = function(combination) {
                if(!combination) return [];

                return _.find($scope.tickets, function(ticket){
                    return (combination.TicketId == ticket.To.TicketId);
                });
            }

            $scope.getHotelByCombination = function(combination) {
                if(!combination) return [];

                return _.find($scope.hotels, function(hotel){
                    return (hotel.HotelId == combination.HotelId);
                });
            }

            $scope.getAllHotelsByCombination = function(combination) {
                if(!combination) return [];

                var similarCombinations = _.where($scope.combinations, {TicketId: combination.TicketId});

                return _.map(similarCombinations, function(combination){
                    return _.findWhere($scope.hotels, {HotelId: combination.HotelId});
                });
            }

            $scope.getAllTicketsByCombination = function(combination) {
                if(!combination) return [];

                var similarCombinations = _.where($scope.combinations, {HotelId: combination.HotelId});

                return _.map(similarCombinations, function(combination){
                    return _.find($scope.tickets, function(ticket){
                        return (ticket.To.TicketId == combination.TicketId);
                    });
                });
            }
        }
    ]);