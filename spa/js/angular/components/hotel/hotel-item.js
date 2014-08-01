angular.module('innaApp.conponents').
    factory('HotelItem', [
        'EventManager',
        'innaApp.API.events',
        '$filter',
        '$templateCache',
        'DynamicBlock',
        'HotelGallery',
        function (EventManager, Events, $filter, $templateCache, DynamicBlock, HotelGallery) {


            /**
             * Компонент HotelItem
             * @constructor
             * @inherits DynamicBlock
             */
            var HotelItem = DynamicBlock.extend({
                data: {
                    settings: {
                        height: 200,
                        countColumn: 3,
                        removeOneSeparator: true,
                        classBlock: 'b-result_col_three_galary b-result_middle',
                        classColl1: 'col-no-padding',
                        classColl3: 'col-xs-3 result-choice'
                    },
                    shortName: function (name) {
                        if (name.length > 27) {
                            return name.substr(0, 27) + '...';
                        } else {
                            return name
                        }
                    }
                },
                partials: {
                    collOneContent: '<HotelGallery photoList="{{Photos}}"/>',
                    collTwoContent: $templateCache.get('components/hotel/templ/hotel-center.hbs.html'),
                    collThreeContent: $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html')
                },

                components: {
                    HotelGallery: HotelGallery
                },

                init: function (options) {
                    var that = this;
                    this._super(options);

                    var modelHotel = new inna.Models.Hotels.Hotel(this.get('hotel'))
                    var virtualBundle = new inna.Models.Dynamic.Combination();
                    virtualBundle.hotel = modelHotel;
                    virtualBundle.ticket = this.get('combinationModel').ticket;


                    //this.set('hotel.getProfit', virtualBundle.getProfit());
                    this.set({
                        virtualBundle: virtualBundle,
                        modelHotel: modelHotel
                    })


                    this.on({
                        setCurrent: this.setCurrent,
                        goToMap: this.goToMap,
                        getHotelDetails: this.getHotelDetails,
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            //console.log('teardown hotel item');
                        }
                    })

                    /*this.observe('hotel', function(newValue, oldValue, keypath) {
                     if (newValue) {
                     }
                     });*/
                },

                getHotelDetails: function () {
                    EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, this.get('modelHotel'));
                },

                goToMap: function () {
                    EventManager.fire(Events.DYNAMIC_SERP_GO_TO_MAP, this.get('modelHotel'));
                },

                setCurrent: function () {
                    EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_HOTEL, this.get('modelHotel'));
                },


                parse: function (end) {

                },

                beforeInit: function (options) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }

            });

            return HotelItem;
        }]);

