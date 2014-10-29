'use strict';

angular.module('innaApp.components').
    factory('TicketItem', [
        'EventManager',
        'innaApp.API.events',
        '$filter',
        '$routeParams',
        'aviaHelper',
        '$templateCache',
        'DynamicBlock',
        'modelRecommendedPair',
        'modelTickets',
        function (EventManager, Events, $filter, $routeParams, aviaHelper, $templateCache, DynamicBlock, modelRecommendedPair, modelTickets) {

            /**
             * Компонент TicketItem
             * @constructor
             * @inherits DynamicBlock
             */
            var TicketItem = DynamicBlock.extend({
                data: {
                    type : 'ticket',
                    hidden : false,
                    settings: {
                        height: 200,
                        countColumn: 2,
                        classBlock: 'b-result_col_two_short b-result_flight-info',
                        classColl2: 'result-choice'
                    },
                    showWarning: function () {
                        return this.showWarning;
                    },
                    airLogo: function (logo) {
                        return this.airLogo(logo);
                    },

                    TimeFormatted : aviaHelper.getFlightTimeFormatted
                },
                partials: {
                    collOneContent: $templateCache.get('components/ticket/templ/avia-dp.hbs.html'),
                    collTwoContent: $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html')
                },


                init: function () {
                    var that = this;

                    var modelTicket = new modelTickets(this.get('ticket'));
                    var virtualBundle = new modelRecommendedPair({
                        ticket : modelTicket,
                        hotel : this.get('combinationModel').hotel
                    });

                    this.set({
                        virtualBundle: virtualBundle,
                        modelTicket: modelTicket
                    });

                    //console.log(this.get('ticket'));

                    this.on({
                        setCurrent: this.setCurrent,
                        getTicketDetails: function (evt) {
                            EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, evt.original, this.get('modelTicket'));
                        },
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            //console.log('teardown ticket item');
                            //EventManager.off(Events.DYNAMIC_SERP_CHOOSE_TICKET, this.CHOOSE_TICKET);
                        }
                    });



                    if(this.get('combinationModel').ticket.data.VariantId1 == this.get('ticket.VariantId1')){
                        that.set('hidden', true);
                    }


                    /**
                     * Когда выбераем отель, то прячем его( убираем из списка и показываем в выбранном варианте)
                     * Тот отель что был выбран ранее, показываем
                     */
                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function(modelTicket, ticketId){
                        if((ticketId != that.get('ticket.VariantId1')) && that.get('hidden')){
                            that.set('hidden', false);
                        }
                    });
                },

                /**
                 * Выбераем ( бител ) перелет
                 * Передаем в событие данные
                 * this.get('modelTicket') - модель билета
                 * this.get('ticket.VariantId1') - id билета
                 */
                setCurrent: function () {
                    this.set('hidden', true);
                    EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_TICKET, this.get('modelTicket'), this.get('ticket.VariantId1'));
                },

                airLogo: function (logo) {
                    var groupLogo = "/spa/img/group.png";
                    var statickLogo = app_main.staticHost + "/Files/logo/" + logo + ".png";
                    return  (logo == 'many') ? groupLogo : statickLogo;
                },

                CHOOSE_TICKET : function(modelTicket, ticketId){
                    if((ticketId != this.get('ticket.VariantId1')) && this.get('hidden')){
                        this.set('hidden', false);
                    }
                },

                showWarning: function () {
                    var n = parseInt(this.get('NumSeats'));
                    var routParam = angular.copy($routeParams);
                    var passengerCount = parseInt(routParam.Adult) + (routParam.ChildrenAges ? routParam.ChildrenAges.length : 0);

                    if (!n) return false;

                    switch (passengerCount) {
                        case 1:
                            return (n < 4);
                        case 2:
                            return (n < 7);
                        default:
                            return (n < 10);
                    }

                    return false;
                },

                parse: function (data) {


                    return data;
                }

            });

            return TicketItem;
        }]);

