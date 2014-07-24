angular.module('innaApp.conponents').
    factory('TicketItem', [
        'EventManager',
        'innaApp.API.events',
        '$filter',
        '$templateCache',
        'DynamicBlock',
        function (EventManager, Events, $filter, $templateCache, DynamicBlock) {

            /**
             * Компонент TicketItem
             * @constructor
             * @inherits DynamicBlock
             */
            var TicketItem = DynamicBlock.extend({
                template: $templateCache.get('components/dynamic-block/templ/base.hbs.html'),
                append: true,
                data: {
                    settings : {
                        height : 200,
                        countColumn: 2,
                        classBlock : 'b-result_col_two_short b-result_flight-info'
                    }
                },
                partials : {
                    //collOneContent : see DynamicBlock
                    collTwoContent : $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html')
                },


                init: function () {
                    var that = this;

                    var modelTicket = new inna.Models.Hotels.Hotel(this.get('ticket'))
                    var virtualBundle = new inna.Models.Dynamic.Combination();
                    virtualBundle.ticket = modelTicket;
                    virtualBundle.hotel = this.get('combinationModel').hotel;

                    this.set({
                        virtualBundle : virtualBundle,
                        modelTicket : modelTicket
                    })



                    this.on({
                        setCurrent : this.setCurrent,
                        getTicketDetails : this.getHotelDetails,
                        change : function(data){

                        },
                        teardown: function (evt) {
                            //console.log('teardown ticket item');
                        }
                    });
                },

                getTicketDetails : function(){
                    //EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, this.get('modelHotel'));
                },

                setCurrent : function(){
                    EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_TICKET, this.get('modelTicket'));
                },


                parse: function (end) {

                }

            });

            return TicketItem;
        }]);

