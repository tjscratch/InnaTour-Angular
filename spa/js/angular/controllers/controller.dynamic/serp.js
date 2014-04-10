innaAppControllers.
    controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', '$routeParams',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams) {
            /*Private*/
            function loadTab() {
                if($scope.show == $scope.HOTELS_TAB) {
                    DynamicPackagesDataProvider.getHotelsByCombination(
                        $scope.combination.Ticket.To.TicketId, $scope.key,
                        function(data){
                            $scope.hotels = _.map(data, function(hotel){ return new DynamicModels.Hotel(data); });
                        }
                    );
                } else if($scope.show == $scope.TICKETS_TAB) {
                    DynamicPackagesDataProvider.getTicketsByCombination(
                        $scope.combination.Hotel.HotelId, $scope.key,
                        function(data){
                            $scope.tickets = _.map(data, function(hotel){ return new DynamicModels.Ticket(data); });
                        }
                    );
                }
            }

            /*EventListener*/
            DynamicFormSubmitListener.listen();

            /*Constants*/
            $scope.HOTELS_TAB = '/spa/templates/pages/dynamic_package_serp.hotels.html';
            $scope.TICKETS_TAB = '/spa/templates/pages/dynamic_package_serp.tickets.html';

            /*Properties*/
            $scope.hotels = [];
            $scope.tickets = [];
            $scope.combination = null;
            $scope.key = '';
            $scope.showLanding = true;
            $scope.show = $scope.HOTELS_TAB;

            $scope.$watch('show', function(newVal, oldVal){
                if($scope.combination) loadTab();
            });

            /*Data fetching*/
            (function loadData(params){
                params.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.StartVoyageDate);
                params.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.EndVoyageDate);

                console.time('loading_packages');
                console.log('loading data by params', angular.toParam(params));

                DynamicPackagesDataProvider.search(params, function(data){
                    console.timeEnd('loading_packages');

                    $scope.$apply(function($scope){
                        $scope.combination = data.RecommendedPair;
                        $scope.key = data.CacheKey;

                        $scope.showLanding = false;

                        loadTab();
                    });
                });
            })(angular.copy($routeParams));

            /*Watchers*/
        }
    ]);