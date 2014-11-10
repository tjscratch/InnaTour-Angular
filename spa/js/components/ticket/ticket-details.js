'use strict';

angular.module('innaApp.directives')
    .directive('ticketDetails', ['$templateCache', function ($templateCache) {
        return {
            template: $templateCache.get('components/ticket/templ/ticket-details.html'),
            controller: [
                'EventManager',
                '$scope',
                '$element',
                '$routeParams',
                '$location',
                'aviaHelper',
                '$timeout',
                'urlHelper',
                'innaApp.API.events',

                'ShareLink',
                function (EventManager, $scope, $element, $routeParams, $location, aviaHelper, $timeout, urlHelper, Events, ShareLink) {

                    $('body').append($element);

                    $scope.ticket = null;
                    $scope.link = '';

                    $scope.closePopup = function () {
                        aviaHelper.scrollFix(true)
                        delete $location.$$search.displayTicket;
                        $location.$$compose();
                        $scope.ticket = null;
                        $scope.popupItemInfo.hide();
                    };

                    $scope.setCurrent = function () {
                        EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_TICKET, $scope.ticket);
                        $scope.closePopup();
                    };

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                    $scope.dateHelper = dateHelper;

                    $scope.sharePopup = new inna.Models.Aux.AttachedPopup(function () {
                        $scope.link = document.location;
                    });


                    EventManager.on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetails);

                    $scope.$on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, function (evt, ticket, opt_data) {
                        $scope.$apply(function () {
                            showDetails(evt, ticket, opt_data);
                        })
                    })

                    function showDetails(evt, ticket, opt_data) {

                        if (window.partners && window.partners.parentScrollTop > 0) {
                            $scope.popupStyles = { 'top': window.partners.parentScrollTop + 100 + 'px' };//100px ������
                        }
                        else {
                            $scope.popupStyles = null;
                        }

                        var ticketRaw = ticket;
                        if (ticket && ticket.raw) {
                            ticketRaw = ticket.raw;
                        }

                        if(opt_data){
                            $scope.closeFooter = true;
                        } else {
                            $scope.closeFooter = false;
                        }


                        aviaHelper.addCustomFields(ticketRaw);
                        $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
                        $scope.ticketsCount = aviaHelper.getTicketsCount($scope.criteria.AdultCount, $scope.criteria.ChildCount, $scope.criteria.InfantsCount);
                        $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $scope.criteria.CabinClass);
                        $scope.popupItemInfo.show(evt, ticketRaw, $scope.criteria, $scope.searchId);


                        $scope.ticket = ticket;
                        $location.search('displayTicket', [$scope.ticket.data.VariantId1, $scope.ticket.data.VariantId2].join('_'));


                        //  TODO : магия , но без этого не работает
                        $timeout(function () {

                        }, 100)
                    }

                    $scope.$watch('popupItemInfo.isShow', function (value) {
                        if(value) {
                            new ShareLink({
                                el: $element.find('.js-share-component'),
                                data: {
                                    right: true,
                                    location: angular.copy(document.location.href)

                                }
                            })
                        }
                    })


                    $scope.$on('$destroy', function () {
                        EventManager.off(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetails);
                    })
                }
            ]
        }
    }]);