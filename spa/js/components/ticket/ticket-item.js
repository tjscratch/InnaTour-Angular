'use strict';

angular.module('innaApp.components').
    factory('TicketItem', [
        'EventManager',
        'innaAppApiEvents',
        '$filter',
        '$routeParams',
        'aviaHelper',
        '$templateCache',
        'DynamicBlock',

        'ModelTicket',
        'ModelPrice',
        function (EventManager, Events, $filter, $routeParams, aviaHelper, $templateCache, DynamicBlock, ModelTicket, ModelPrice) {

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

                    TimeFormatted : aviaHelper.getFlightTimeFormatted
                },
                partials: {
                    collOneContent: $templateCache.get('components/ticket/templ/avia-dp.hbs.html'),
                    collTwoContent: $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html')
                },


                onrender: function () {
                    var that = this;

                    var modelTicket = new ModelTicket(this.get('ticket'));
                    var modelPrice = new ModelPrice({data : this.get('ticket')});

                    this.set({
                        modelTicket: modelTicket,
                        modelPrice : modelPrice
                    });


                    this.on({
                        setCurrent: this.setCurrent,
                        getTicketDetails: function (evt) {
                            EventManager.fire(Events.DYNAMIC_SERP_TICKET_DETAILED_REQUESTED, evt.original, {ticket: this.get('modelTicket')});
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

