'use strict';

//innaDynamicBundle
angular.module('innaApp.directives')
    .directive('recommendedPairComponentBig', [
        '$templateCache',
        function ($templateCache) {
            return {
                template: $templateCache.get('components/recommended-pair/templ/recommended-big.html'),
                scope: {
                    recommendedPair: '=recommendedPair',
                    toggleTab: '=toggleTab',
                    stateTicket: "=stateTicket",
                    stateHotel: "=stateHotel",
                    tabActive: "=tabActive",
                    asMap: "=asMap",
                    withReservationButton: '@innaDynamicBundleWithReservationButton',
                    close: '=innaDynamicBundleClose'
                },
                controller: [
                    'EventManager',
                    '$scope',
                    'aviaHelper',
                    'innaApp.Urls',
                    '$location',
                    '$element',
                    '$timeout',
                    'innaApp.API.events',
                    '$routeParams',

                    // components
                    'Tripadvisor',
                    'Stars',
                    'PriceGeneric',
                    function (EventManager, $scope, aviaHelper, Urls, $location, $element, $timeout, Events, $routeParams, Tripadvisor, Stars, PriceGeneric) {

                        //console.profile('Draw');

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
                            var Children = searchParams.Children || '';
                            var hotelID = $scope.recommendedPair.hotel.data.HotelId;
                            var ticketId = $scope.recommendedPair.ticket.data.VariantId1;
                            var ticketBackId = $scope.recommendedPair.ticket.data.VariantId2;
                            var providerId = $scope.recommendedPair.hotel.data.ProviderId;

                            var urlDetails = '/#' + Urls.URL_DYNAMIC_HOTEL_DETAILS + [
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

                            if (window.partners && window.partners.isFullWL()) {
                                urlDetails = window.partners.getParentLocationWithUrl(urlDetails);
                            }

                            return (opt_param) ? urlDetails + '?action=buy' : urlDetails;
                        }

                        $scope.location = angular.copy(document.location.href);

                        // Tripadvisor
                        var _tripadvisor = new Tripadvisor({
                            el: $element.find('.js-tripadvisor-container'),
                            data: {
                                TaCommentCount: $scope.recommendedPair.hotel.data.TaCommentCount,
                                TaFactor: $scope.recommendedPair.hotel.data.TaFactor,
                                TaFactorCeiled: $scope.recommendedPair.hotel.data.TaFactorCeiled
                            }
                        })

                        /* Stars */
                        var _stars = new Stars({
                            el: $element.find('.js-stars-container'),
                            data: {
                                stars: $scope.recommendedPair.hotel.data.Stars
                            }
                        });

                        // PriceGeneric
                        var _priceGeneric = new PriceGeneric({
                            el: $element.find('.js-price-generic-container'),
                            data: {
                                template: "index.hbs.html",
                                virtualBundle: $scope.recommendedPair,
                                tooltipKlass: 'bundle',
                                type: $scope.tabActive
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
                            $scope.$emit(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, ticket)
                            //EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, $event, ticket, true);
                        };

                        $scope.bundleHotelDetails = function ($event, hotel, isBuyAction) {
                            $event.stopPropagation();
                            EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, hotel, isBuyAction);
                        };

                        // update components
                        $scope.$watchCollection('recommendedPair', function (value) {

                            //  обновляем transportersList
                            $scope.transportersList = $scope.recommendedPair.ticket.collectAirlines().airlines;

                            _priceGeneric.set({
                                'virtualBundle': value,
                                type: $scope.tabActive
                            });

                            _tripadvisor.set({
                                TaCommentCount: $scope.recommendedPair.hotel.data.TaCommentCount,
                                TaFactor: $scope.recommendedPair.hotel.data.TaFactor,
                                TaFactorCeiled: $scope.recommendedPair.hotel.data.TaFactorCeiled
                            });
                            _stars.set('stars', $scope.recommendedPair.hotel.data.Stars);


                            $timeout(function () {
                                $scope.location = window.location.href
                            }, 0)
                        });

                        $scope.$watchCollection('stateTicket', function (value) {
                            $timeout(function () {
                                $scope.location = window.location.href
                            }, 0)
                        });

                        //destroy
                        $scope.$on('$destroy', function () {
                            if (_tripadvisor) _tripadvisor.teardown();
                            if (_stars) _stars.teardown();
                            if (_priceGeneric) _priceGeneric.teardown();
                            _stars = null;
                            _tripadvisor = null;
                            _priceGeneric = null;
                        })

                        //console.profileEnd('Draw');
                    }
                ]
            }
        }]);