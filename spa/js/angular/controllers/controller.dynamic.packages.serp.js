innaAppControllers.
    controller('DynamicPackageSERPCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'DynamicPackagesDataProvider', '$routeParams',
        function ($scope, DynamicFormSubmitListener, DynamicPackagesDataProvider, $routeParams) {
            /*EventListener*/
            DynamicFormSubmitListener.listen();

            $scope.combinations = {};
            $scope.hotels = {};
            $scope.tickets = {};

            $scope.showLanding = true;

            (function loadData(params){
                params.StartVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.StartVoyageDate);
                params.EndVoyageDate = dateHelper.ddmmyyyy2yyyymmdd(params.EndVoyageDate);

                console.time('loading_packages');
                console.log('loading data by params', params);

                DynamicPackagesDataProvider.search(params, function(data){
                    console.timeEnd('loading_packages');

                    $scope.$apply(function($scope){
                        console.time('rendering');

                        $scope.combinations = data.Combinations;
                        $scope.hotels = data.Hotels;
                        $scope.tickets = data.Tickets;$scope.showLanding = false;

                        console.timeEnd('rendering');
                    });
                });


            })(angular.copy($routeParams));
        }
    ]);