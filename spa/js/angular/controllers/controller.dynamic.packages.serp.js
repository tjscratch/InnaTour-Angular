innaAppControllers.
    controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', '$routeParams',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams) {
            /*Private*/

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

                        $scope.combinations = _.map(data.Combinations, function(combiantion){
                            return new DynamicModels.Combination(combiantion, data.Reductions);
                        });
                        $scope.hotels = _.map(data.Hotels, function(hotel){
                            return new DynamicModels.Hotel(hotel, data.Reductions);
                        });
                        $scope.tickets = _.map(data.Tickets, function(ticket){
                            return new DynamicModels.Ticket(ticket, data.Reductions);
                        });

                        $scope.showLanding = false;

                        $scope.currentCombination = $scope.combinations[0];

                        console.timeEnd('rendering');

                        console.log($scope.hotels, $scope.tickets, $scope.combinations);
                    });
                });
            })(angular.copy($routeParams));

            /*Methods*/
            //TODO make it methods of models
            $scope.getTicketForCurrentCombination = function() {
                if(!$scope.currentCombination) return [];

                return _.find($scope.tickets, function(ticket){
                    return ($scope.currentCombination.TicketId == ticket.To.TicketId);
                });
            }

            $scope.getHotelForCurrentCombination = function() {
                if(!$scope.currentCombination) return [];

                return _.find($scope.hotels, function(hotel){
                    return (hotel.HotelId == $scope.currentCombination.HotelId);
                });
            }

            $scope.getAllHotelsForCurrentCombination = function() {
                if(!$scope.currentCombination) return [];

                var similarCombinations = _.where($scope.combinations, {TicketId: $scope.currentCombination.TicketId});

                return _.map(similarCombinations, function(combination){
                    return _.findWhere($scope.hotels, {HotelId: combination.HotelId});
                });
            }

            $scope.getAllTicketsForCurrentCombination = function() {
                if(!$scope.currentCombination) return [];

                var similarCombinations = _.where($scope.combinations, {HotelId: $scope.currentCombination.HotelId});

                return _.map(similarCombinations, function(combination){
                    return _.find($scope.tickets, function(ticket){
                        return (ticket.To.TicketId == combination.TicketId);
                    });
                });
            }

            $scope.updateHotel = function(hotel){
                var ticketId = $scope.currentCombination.TicketId;
                var hotelId = hotel.HotelId;
                var newCombination = _.findWhere($scope.combinations, {TicketId: ticketId, HotelId: hotelId});

                $scope.currentCombination = newCombination;
            }

            $scope.updateTicket = function(ticket){
                var ticketId = ticket.To.TicketId;
                var hotelId = $scope.currentCombination.HotelId;
                var newCombination = _.findWere($scope.combinations, {TicketId: ticketId, HotelId: hotelId});

                $scope.currentCombination = newCombination;
            }

            $scope.requireHotelDetails = function(hotel){
                hotel.details = {}

                DynamicPackagesDataProvider.hotelDetails(hotel.HotelId, hotel.ProviderId, function(data){
                    $scope.$apply(function(){
                        hotel.details = data;
                    });
                });
            }
        }
    ]);