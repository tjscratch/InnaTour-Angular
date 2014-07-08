angular.module('innaApp.directives')
    .directive('innaDynamicBundle', ['$templateCache', function($templateCache){        
        return {
            template: $templateCache.get('components/bundle/templ/bundle.html'),
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                __getTicketDetails: '=innaDynamicBundleTicketDetails',
                __getHotelDetails: '=innaDynamicBundleHotelDetails',
                withReservationButton: '@innaDynamicBundleWithReservationButton',
                close: '=innaDynamicBundleClose'
            },
            controller: [
                '$scope',
                'aviaHelper',
                '$element',
                'innaApp.API.events',

                // components
                'ShareLink',
                function($scope, aviaHelper, $element, Events, ShareLink){

                    /*$scope.$on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function (evt, data) {
                        console.log('Events.DYNAMIC_SERP_CHOOSE_HOTEL = bundle');
                    });*/


                    var shareLink = new ShareLink({
                        el : $element.find('.js-share-component')
                    });

                    var infoPopupElems = $('.icon-price-info, .tooltip-price', $element);

                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup(angular.noop, infoPopupElems, $scope);

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                    $scope.getTicketDetails = function($event, ticket){
                        $event.stopPropagation();
                        return $scope.__getTicketDetails(ticket);
                    }

                    $scope.getHotelDetails = function($event, hotel, isBuyAction){
                        $event.stopPropagation();
                        return $scope.__getHotelDetails(hotel, isBuyAction);
                    }


                    //destroy
                    $scope.$on('$destroy', function(){
                        shareLink.teardown();
                        shareLink = null;
                    })
                }
            ]
        }
    }]);