angular.module('innaApp.directives')
    .directive('innaDynamicBundle', function(){
        return {
            templateUrl: '/spa/templates/components/bundle.html',
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                getTicketDetails: '=innaDynamicBundleTicketDetails',
                getHotelDetails: '=innaDynamicBundleHotelDetails',
                goReservation: '=innaDynamicBundleGoReservation'
            },
            controller: [
                '$scope', 'aviaHelper', '$element',
                function($scope, aviaHelper, $element){
                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup();
                    $scope.linkPopup = new inna.Models.Aux.AttachedPopup();

                    $scope.$watch('linkPopup.isOpen', function(){
                        $scope.location = document.location;
                    });

                    $scope.location = document.location;

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                }
            ]
        }
    });