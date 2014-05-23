angular.module('innaApp.directives')
    .directive('innaDynamicBundle', function(){
        return {
            templateUrl: '/spa/templates/components/bundle.html',
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                getTicketDetails: '=innaDynamicBundleTicketDetails',
                getHotelDetails: '=innaDynamicBundleHotelDetails'
            },
            controller: [
                '$scope', 'aviaHelper',
                function($scope, aviaHelper){
                    console.log('innaDynamicBundle', $scope);

                    $scope.dateHelper = dateHelper;

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                }
            ]
        }
    });