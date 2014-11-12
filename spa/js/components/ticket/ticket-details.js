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

                    var shareLink = null;

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


                    // TODO: deprecated^ use instead $emit or $broadcast
                    EventManager.on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetailsWrap);
                    $scope.$on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, function (evt, ticket, opt_data) {
                        showDetails(evt, ticket, opt_data);
                    })

                    function showDetailsWrap(evt, ticket, opt_data){
                        $scope.$apply(function(){
                            showDetails(evt, ticket, opt_data);
                        })
                    }

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
                    }

                    $scope.$watch('popupItemInfo.isShow', function (value) {
                        if(value) {
                            setTimeout(function(){
                                shareLink = new ShareLink({
                                    el: $element.find('.js-share-component'),
                                    data: {
                                        right: true,
                                        location: document.location.href
                                    }
                                })
                            }, 300)
                        }
                    })


                    $scope.$on('$destroy', function () {
                        EventManager.off(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetailsWrap);
                    })
                }
            ]
        }
    }]);