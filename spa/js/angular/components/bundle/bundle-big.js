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
                '$routeParams',

                // components
                'ShareLink',
                'Tripadvisor',
                function (EventManager, $scope, aviaHelper, $location, $element, Events, $routeParams, ShareLink, Tripadvisor) {

                    var searchParams = angular.copy($routeParams);

                    /**
                     * Строим URL для страницы подробнее об отеле
                     * :DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children-:HotelId-:TicketId-:ProviderId?
                     *
                     */
                    $scope.computedUrlDetails = function (opt_param) {

                        var DepartureId = searchParams.DepartureId;
                        var ArrivalId = searchParams.ArrivalId;
                        var StartVoyageDate = searchParams.StartVoyageDate;
                        var EndVoyageDate = searchParams.EndVoyageDate;
                        var TicketClass = searchParams.TicketClass;
                        var Adult = searchParams.Adult || 0;
                        var Children = searchParams.Children || 0;
                        var hotelID = $scope.bundle.hotel.data.HotelId;
                        var ticketId = $scope.bundle.ticket.data.VariantId1;
                        var ticketBackId = $scope.bundle.ticket.data.VariantId2;
                        var providerId = $scope.bundle.hotel.data.ProviderId;

                        var urlDetails = '/#/packages/details/' + [
                            DepartureId,
                            ArrivalId,
                            StartVoyageDate,
                            EndVoyageDate,
                            TicketClass,
                            Adult,
                            Children,
                            hotelID,
                            ticketId,
                            ticketBackId,
                            providerId
                        ].join('-');

                        return (opt_param) ? urlDetails + '?action=buy' : urlDetails;
                    }

                    var _shareLink = new ShareLink({
                        el: $element.find('.js-share-component')
                    });

                    /*console.log('bundle');
                    console.log($scope.bundle);
                    console.log('bundle');*/

                    // Tripadvisor
                    var _tripadvisor = new Tripadvisor({
                        el: $element.find('.js-tripadvisor-container'),
                        data: {
                            TaCommentCount: $scope.bundle.hotel.data.TaCommentCount,
                            TaFactor: $scope.bundle.hotel.data.TaFactor,
                            TaFactorCeiled: $scope.bundle.hotel.data.TaFactorCeiled
                        }
                    })

                    if ($location.search().displayHotel) {
                        $scope.displayHotel = true;
                    }


                    var infoPopupElems = $('.icon-price-info, .tooltip-price', $element);

                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup(angular.noop, infoPopupElems, $scope);

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                    $scope.bundleTicketDetails = function ($event, ticket) {
                        $event.stopPropagation();

                        console.log($event, ticket, '$event, ticket');
                        EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket);
                    };

                    $scope.bundleHotelDetails = function ($event, hotel, isBuyAction) {
                        $event.stopPropagation();
                        EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, hotel, isBuyAction);
                    };

                    //destroy
                    $scope.$on('$destroy', function () {
                        console.log('$destroy bundle big');
                        _shareLink.teardown();
                        _tripadvisor.teardown();
                        _shareLink = null;
                        _tripadvisor = null;
                    })
                }
            ]
        }
    }]);