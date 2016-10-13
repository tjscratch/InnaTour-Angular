'use strict';

//innaDynamicBundle
angular.module('innaApp.directives')
        .directive('recommendedPairComponentBig', [
            '$templateCache',
            function ($templateCache) {
                return {
                    template  : function (el, attr) {
                        if (attr.templ) {
                            return $templateCache.get('components/recommended-pair/templ/' + attr.templ);
                        }
                        return $templateCache.get('components/recommended-pair/templ/recommended-big.html');
                    },
                    scope     : {
                        recommendedPair      : '=recommendedPair',
                        recommendedPairStatus: '=',
                        isVisible            : '=',
                        isClosed             : '=',
                        toggleTab            : '=toggleTab',
                        stateTicket          : "=stateTicket",
                        stateHotel           : "=stateHotel",
                        tabActive            : "=tabActive",
                        asMap                : "=asMap",
                        withReservationButton: '@innaDynamicBundleWithReservationButton',
                        close                : '=innaDynamicBundleClose'
                    },
                    controller: [
                        'EventManager',
                        '$scope',
                        '$rootScope',
                        'aviaHelper',
                        'innaApp.Urls',
                        '$location',
                        '$element',
                        '$timeout',
                        'innaAppApiEvents',
                        '$routeParams',
                        '$filter',
                        function (EventManager, $scope, $rootScope, aviaHelper, Urls, $location, $element, $timeout, Events, $routeParams, $filter) {
                            
                            var searchParams = angular.copy($routeParams);

                            /**
                             * Строим URL для страницы подробнее об отеле
                             * :DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children-:HotelId-:TicketId-:ProviderId?
                             *
                             */

                            $scope.computedUrlDetails = function (opt_param) {

                                var DepartureId = searchParams.DepartureId;
                                var ArrivalId = searchParams.ArrivalId;
                                // https://innatec.atlassian.net/browse/IN-7097
                                // заменил даты заезда/выезда
                                // даты на детализацию отеля берутся не $routeParams а из данных по отелю
                                // var StartVoyageDate = searchParams.StartVoyageDate;
                                // var EndVoyageDate = searchParams.EndVoyageDate;
                                var StartVoyageDate = $filter('date')($scope.recommendedPair.hotel.data.CheckIn, 'dd.MM.yyyy');
                                var EndVoyageDate = $filter('date')($scope.recommendedPair.hotel.data.CheckOut, 'dd.MM.yyyy');
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
                            };

                            $scope.location = angular.copy(document.location.href);


                            if ($location.search().displayHotel) {
                                $scope.displayHotel = true;
                            }


                            var infoPopupElems = $('.icon-price-info, .tooltip-price', $element);

                            $scope.infoPopup = new inna.Models.Aux.AttachedPopup(angular.noop, infoPopupElems, $scope);

                            /*Proxy*/
                            $scope.dateHelper = dateHelper;
                            $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;

                            $scope.bundleTicketDetails = function ($event, ticket) {
                                var dataLayerObj = {
                                    'event': 'UM.Event',
                                    'Data': {
                                        'Category': 'Packages',
                                        'Action': 'DetailsAviaInSearch',
                                        'Label': '[no data]',
                                        'Content': '[no data]',
                                        'Context': '[no data]',
                                        'Text': '[no data]'
                                    }
                                };
                                console.table(dataLayerObj);
                                if (window.dataLayer) {
                                    window.dataLayer.push(dataLayerObj);
                                }
                                $event.stopPropagation();
                                $scope.$emit(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, {ticket: ticket, noChoose: $location.search().displayHotel})
                            };

                            $scope.bundleHotelDetails = function () {
                                var dataLayerObj = {
                                    'event': 'UM.Event',
                                    'Data': {
                                        'Category': 'Packages',
                                        'Action': 'DetailsHotelsInSearch',
                                        'Label': '[no data]',
                                        'Content': '[no data]',
                                        'Context': '[no data]',
                                        'Text': '[no data]'
                                    }
                                };
                                console.table(dataLayerObj);
                                if (window.dataLayer) {
                                    window.dataLayer.push(dataLayerObj);
                                }
                                // $event.stopPropagation();
                                // EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, hotel, isBuyAction);
                            };


                            $scope.recommendedHotelToMap = function () {
                                EventManager.fire(Events.DYNAMIC_SERP_LOAD_TAB, 'hotel');
                                EventManager.fire(Events.DYNAMIC_SERP_GO_TO_MAP, $scope.recommendedPair.hotel);
                            };

                            $scope.packagesBuySearch = function () {
                                var dataLayerObj = {
                                    'event': 'UM.Event',
                                    'Data': {
                                        'Category': 'Packages',
                                        'Action': 'PackagesBuySearch',
                                        'Label': '[no data]',
                                        'Content': '[no data]',
                                        'Context': '[no data]',
                                        'Text': '[no data]'
                                    }
                                };
                                console.table(dataLayerObj);
                                if (window.dataLayer) {
                                    window.dataLayer.push(dataLayerObj);
                                }
                            }


                            // update components
                            $scope.$watchCollection('recommendedPair', function (value) {

                                //  обновляем transportersList
                                $scope.transportersList = $scope.recommendedPair.ticket.collectAirlines().airlines;

                                $timeout(function () {
                                    $scope.location = window.location.href
                                }, 0)
                            });

                            $scope.$watchCollection('stateTicket', function (value) {
                                $timeout(function () {
                                    $scope.location = window.location.href
                                }, 0)
                            });

                            $scope.$on('loadDPHotels', function (event, data) {
                                $scope.hotelCount = data.HotelCount;
                                $scope.ticketCount = data.TicketCount;
                            });


                            /**
                             * IN-5387
                             * показ блока с ценой за человека
                             */
                            $scope.CostPerPersonShow = false;


                            //destroy
                            $scope.$on('$destroy', function () {

                            })

                            //console.profileEnd('Draw');
                        }
                    ]
                }
            }
        ]);