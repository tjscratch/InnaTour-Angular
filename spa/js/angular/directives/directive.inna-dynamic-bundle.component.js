angular.module('innaApp.directives')
    .directive('innaDynamicBundle', ['$templateCache', function($templateCache){        
        return {
            template: $templateCache.get('components/bundle.html'),
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                getTicketDetails: '=innaDynamicBundleTicketDetails',
                getHotelDetails: '=innaDynamicBundleHotelDetails',
                goReservation: '=innaDynamicBundleGoReservation'
            },
            controller: [
                '$scope',
                'aviaHelper',
                '$element',
                function($scope, aviaHelper, $element){
                    var infoPopupElems = $('.icon-price-info, .tooltip-price', $element);
                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup(angular.noop, infoPopupElems, $scope);

                    var linkPopupsElems = $('.share-button, .tooltip-share-link', $element);
                    $scope.linkPopup = new inna.Models.Aux.AttachedPopup(angular.noop, linkPopupsElems, $scope);


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
    }]);