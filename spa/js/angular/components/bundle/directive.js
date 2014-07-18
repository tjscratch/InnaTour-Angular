angular.module('innaApp.directives')
    .directive('innaDynamicBundle', ['$templateCache', function ($templateCache) {
        return {
            template: $templateCache.get('components/bundle/templ/bundle-big.html'),
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                __getTicketDetails: '=innaDynamicBundleTicketDetails',
                __getHotelDetails: '=innaDynamicBundleHotelDetails',
                withReservationButton: '@innaDynamicBundleWithReservationButton',
                close: '=innaDynamicBundleClose'
            },
            controller: [
                'EventManager',
                '$scope',
                'aviaHelper',
                '$element',
                'innaApp.API.events',

                // components
                'ShareLink',
                'Tripadvisor',
                function (EventManager, $scope, aviaHelper, $element, Events, ShareLink, Tripadvisor) {

                    function orientation(){
                        var ua = navigator.userAgent.toLowerCase();
                        var isAndroid = ua.indexOf("android") > -1;

                        if (isAndroid) {
                            switch (window.orientation) {
                                case 0:
                                    $scope.$emit(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
                                    break;
                                case -90:
                                    $scope.$emit(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE);
                                    break;
                                case 90:
                                    $scope.$emit(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE);
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            switch (window.orientation) {
                                case 0:
                                    $scope.$emit(Events.DYNAMIC_SERP_SET_OPEN_BUNDLE);
                                    break;
                                case -90:
                                    $scope.$emit(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
                                    break;
                                case 90:
                                    $scope.$emit(Events.DYNAMIC_SERP_SET_CLOSE_BUNDLE);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    setTimeout(orientation, 0);
                    window.addEventListener("orientationchange", orientation, false);


                    var _shareLink = new ShareLink({
                        el: $element.find('.js-share-component')
                    });

                    // Tripadvisor
                    var _tripadvisor = new Tripadvisor({
                        el : $element.find('.js-tripadvisor-container'),
                        data : {
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
                        return $scope.__getTicketDetails(ticket);
                    }

                    $scope.getHotelDetails = function ($event, hotel, isBuyAction) {
                        $event.stopPropagation();
                        return $scope.__getHotelDetails(hotel, isBuyAction);
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