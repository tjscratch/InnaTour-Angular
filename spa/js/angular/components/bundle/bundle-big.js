'use strict';

angular.module('innaApp.directives')
    .directive('innaDynamicBundle', ['$templateCache', function ($templateCache) {
        return {
            template: $templateCache.get('components/bundle/templ/bundle-big.html'),
            scope: {
                bundle: '=innaDynamicBundleBundle',
                toggleTab: '=toggleTab',
                stateTicket: "=stateTicket",
                stateHotel: "=stateHotel",
                tabActive: "=tabActive",
                getTicketDetails: '=getTicketDetails',
                getHotelDetails: '=getHotelDetails',
                withReservationButton: '@innaDynamicBundleWithReservationButton',
                close: '=innaDynamicBundleClose'
            },
            controller: [
                'EventManager',
                '$scope',
                'aviaHelper',
                '$location',
                '$element',
                'innaApp.API.events',

                // components
                'ShareLink',
                'Tripadvisor',
                function (EventManager, $scope, aviaHelper, $location, $element, Events, ShareLink, Tripadvisor) {

                    var _shareLink = new ShareLink({
                        el: $element.find('.js-share-component')
                    });

                    // Tripadvisor
                    var _tripadvisor = new Tripadvisor({
                        el: $element.find('.js-tripadvisor-container'),
                        data: {
                            TaCommentCount: $scope.bundle.hotel.data.TaCommentCount,
                            TaFactor: $scope.bundle.hotel.data.TaFactor,
                            TaFactorCeiled: $scope.bundle.hotel.data.TaFactorCeiled
                        }
                    })


                    var infoPopupElems = $('.icon-price-info, .tooltip-price', $element);

                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup(angular.noop, infoPopupElems, $scope);

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                    $scope.getTicketDetails = function ($event, ticket) {
                        $event.stopPropagation();
                        return $scope.getTicketDetails(ticket);
                    }

                    $scope.getHotelDetails = function ($event, hotel, isBuyAction) {
                        $event.stopPropagation();
                        return $scope.getHotelDetails(hotel, isBuyAction);
                    }

                    //destroy
                    $scope.$on('$destroy', function () {
                        _shareLink.teardown();
                        _tripadvisor.teardown();
                        _shareLink = null;
                        _tripadvisor = null;
                    })
                }
            ]
        }
    }]);