'use strict';

angular.module('innaApp.directives')
    .directive('ticketDetails', ['$templateCache', function ($templateCache) {
        return {
            template: $templateCache.get('components/ticket/templ/ticket-details.html'),
            controller: [
                'EventManager',
                '$scope',
                '$element',
                '$location',
                'aviaHelper',
                'innaApp.API.events',

                'ShareLink',
                function (EventManager, $scope, $element, $location, aviaHelper, Events, ShareLink) {

                    $('body').append($element);

                    $scope.ticket = null;
                    $scope.link = '';


                    $scope.closePopup = function () {
                        delete $location.$$search.displayTicket;
                        $location.$$compose();
                        $scope.ticket = null;
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

                    function showDetails(evt, ticket, opt_data) {

                        if (opt_data) {
                            $scope.noChoose = opt_data.noChoose;
                            $scope.noClose = opt_data.noClose;
                        }

                        //debugger;
                         /*console.log(ticket);
                         var popupItemInfo = new aviaHelper.popupItemInfo();
                         popupItemInfo.addAggFields(ticket.data);*/

                        $scope.ticket = ticket;

                        $scope.etapsZipped = (function () {
                            var zipped = [];

                            var to = ticket.getEtaps('To');
                            var back = ticket.getEtaps('Back');

                            var maxLength = Math.max(to.length, back.length);

                            for (var i = 0; i < maxLength; i++) {
                                var eTo = to[i];
                                var eBack = back[i];

                                zipped.push([eTo, eBack]);
                            }

                            return zipped;
                        })();

                        $location.search('displayTicket', [$scope.ticket.data.VariantId1, $scope.ticket.data.VariantId2].join('_'));


                        setTimeout(function () {
                            new ShareLink({
                                el: $element.find('.js-share-component'),
                                data: {
                                    right: true,
                                    location : window.location
                                }
                            })
                        }, 0)
                    }

                    /*Listeners*/
                    EventManager.on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetails);

                    $scope.$on(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, function(evt, ticket, opt_data){
                        $scope.$apply(function(){
                            showDetails(evt, ticket, opt_data);
                        })
                    })

                    $scope.$on('$destroy', function(){
                        EventManager.off(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, showDetails);
                    })
                }
            ]
        }
    }]);