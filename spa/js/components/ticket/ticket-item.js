'use strict';

angular.module('innaApp.components').
    factory('TicketItem', [
        '$rootScope',
        'EventManager',
        'innaAppApiEvents',
        '$filter',
        '$routeParams',
        'aviaHelper',
        '$templateCache',
        'DynamicBlock',

        'ModelTicket',
        'ModelPrice',
        function ($rootScope, EventManager, Events, $filter, $routeParams, aviaHelper, $templateCache, DynamicBlock, ModelTicket, ModelPrice) {

            /**
             * Компонент TicketItem
             * @constructor
             * @inherits DynamicBlock
             */
            var TicketItem = DynamicBlock.extend({
                data: {
                    type: 'ticket',
                    hidden: false,
                    settings: {
                        height: 200,
                        countColumn: 2,
                        classBlock: 'b-result_col_two_short b-result_flight-info',
                        classColl2: 'result-choice'
                    },
                    showWarning: function () {
                        return this.showWarning();
                    },
                    TimeFormatted: aviaHelper.getFlightTimeFormatted,
                    AgencyType: null
                },
                partials: {
                    collOneContent: $templateCache.get('components/ticket/templ/avia-dp.hbs.html'),
                    collTwoContent: $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html')
                },


                onrender: function () {
                    var that = this;

                    var modelTicket = new ModelTicket(this.get('ticket'));
                    var modelPrice = new ModelPrice({data: this.get('ticket')});

                    if($rootScope.$root.user){
                        this.set('AgencyType', $rootScope.$root.user.getAgencyType());
                    }

                    this.set({
                        modelTicket: modelTicket,
                        modelPrice: modelPrice,
                        passengerCount: parseInt($routeParams.Adult) + ($routeParams.Children ? $routeParams.Children.split('_').length : 0),
                        baggageAlert: _.include(modelTicket.data.LuggageLimits, "Платный багаж")
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


                    if (this.get('combinationModel').ticket.data.VariantId1 == this.get('ticket.VariantId1')) {
                        that.set('hidden', true);
                    }


                    /**
                     * Когда выбераем отель, то прячем его( убираем из списка и показываем в выбранном варианте)
                     * Тот отель что был выбран ранее, показываем
                     */
                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_TICKET, function (modelTicket, ticketId) {
                        if ((ticketId != that.get('ticket.VariantId1')) && that.get('hidden')) {
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
                    var ticket = this.get('modelTicket');
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Packages',
                            'Action': 'PackagesAviaSelect',
                            'Label': ticket.data.EtapsTo[0].data.TransporterName ? ticket.data.EtapsTo[0].data.TransporterName : '[no data]',
                            'Content': 'Page',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    };
                    // console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                },

                CHOOSE_TICKET: function (modelTicket, ticketId) {
                    if ((ticketId != this.get('ticket.VariantId1')) && this.get('hidden')) {
                        this.set('hidden', false);
                    }
                },

                showWarning: function () {
                    var n = parseInt(this.get('NumSeats'));
                    var routParam = angular.copy($routeParams);
                    var passengerCount = parseInt(routParam.Adult) + (routParam.Children ? routParam.Children.split('_').length : 0);

                    if (!n) return false;

                    switch (passengerCount) {
                        case 1:
                            return (n <= 3);
                        case 2:
                            return (n <= 6);
                        case 3:
                            return (n <= 9);
                        case 4:
                            return (n <= 9);
                        default:
                            return (n <= 9);
                    }

                    return false;
                },

                parse: function (data) {


                    return data;
                }

            });

            return TicketItem;
        }]);

