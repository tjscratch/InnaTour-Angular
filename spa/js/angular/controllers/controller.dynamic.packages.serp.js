innaAppControllers.
    controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', '$routeParams',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams) {
            /*EventListener*/
            DynamicFormSubmitListener.listen();

            /*Properties*/
            $scope.combinations = [];
            $scope.hotels = {};
            $scope.tickets = {};

            $scope.showLanding = true;

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
                console.log('all tickets = ', $scope.tickets);
                console.log('combination = ', combination);
                return 'ticket';
            }

            $scope.getHotelByCombination = function(combination) {
                console.log('all hotels = ', $scope.hotels);
                console.log('combination = ', combination);
                return 'hotel';
            }
        }
    ]);