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
                '$scope', 'aviaHelper', '$element', '$controller',
                function($scope, aviaHelper, $element, $controller){
                    /*Mixins*/
                    $controller('PopupCtrlMixin', {$scope: $scope, $element: $element});

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                }
            ]
        }
    });