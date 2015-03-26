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
                'innaAppApiEvents',
                function (EventManager, $scope, $element, $routeParams, $location, aviaHelper, $timeout, urlHelper, Events) {

                    $('body').append($element);

                    $scope.ticket = null;
                    $scope.link = '';
                    $scope.location = window.location.href;

                    $scope.closePopup = function () {
                        utils.scrollFix(true)
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



                    EventManager.on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetailsWrap);
                    $scope.$on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetails);

                    function showDetailsWrap(evt, data) {
                        $scope.$apply(function () {
                            showDetails(evt, data);
                        })
                    }

                    function showDetails(evt, data) {
                        $scope.closeFooter = data.noChoose;

                        var ticketRaw = data.ticket;
                        if (data.ticket && data.ticket.raw) {
                            ticketRaw = data.ticket.raw;
                        }

                        if (window.partners && window.partners.parentScrollTop > 0) {
                            $scope.popupStyles = {'top': window.partners.parentScrollTop + 100 + 'px'};
                        }
                        else {
                            $scope.popupStyles = null;
                        }


                        aviaHelper.addCustomFields(ticketRaw);
                        $scope.criteria = new aviaCriteria(urlHelper.restoreAnyToNulls(angular.copy($routeParams)));
                        $scope.ticketsCount = aviaHelper.getTicketsCount($scope.criteria.AdultCount, $scope.criteria.ChildCount, $scope.criteria.InfantsCount);
                        $scope.popupItemInfo = new aviaHelper.popupItemInfo($scope.ticketsCount, $scope.criteria.CabinClass);
                        $scope.popupItemInfo.show(evt, ticketRaw, $scope.criteria, $scope.searchId);



                        $scope.ticket = data.ticket;
                        $location.search('displayTicket', [$scope.ticket.data.VariantId1, $scope.ticket.data.VariantId2].join('_'));
                    }

                    $scope.$watch('popupItemInfo.isShow', function (value) {
                        if (value) $scope.location = window.location.href;
                    })


                    $scope.$on('$destroy', function () {
                        EventManager.off(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetailsWrap);
                    })
                }
            ]
        }
    }]);