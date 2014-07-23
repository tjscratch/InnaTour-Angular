angular.module('innaApp.conponents').
    factory('HotelItem', [
        'EventManager',
        'innaApp.API.events',
        '$filter',
        '$templateCache',
        'DynamicBlock',
        'HotelGallery',
        function (EventManager, Events, $filter, $templateCache, DynamicBlock, HotelGallery) {

            var HotelItem = DynamicBlock.extend({
                template: $templateCache.get('components/dynamic-block/templ/base.galary.hbs.html'),
                append: true,
                data: {
                    settings : {
                        height : 200,
                        countColumn: 3,
                        classBlock : 'b-result_col_three_galary b-result_middle'
                    }
                },
                partials : {
                    collOneContent : '<HotelGallery photoList="{{Photos}}"/>',
                    collTwoContent : $templateCache.get('components/hotel/templ/hotel-center.hbs.html'),
                    collThreeContent : $templateCache.get('components/hotel/templ/hotel-right.hbs.html')
                },
                components : {
                    HotelGallery: HotelGallery
                },


                init: function () {
                    var that = this;

                    var modelHotel = new inna.Models.Hotels.Hotel(this.get('hotel'))
                    var virtualBundle = new inna.Models.Dynamic.Combination();
                    virtualBundle.hotel = modelHotel;
                    virtualBundle.ticket = this.get('combinationModel').ticket;

                    this.set({
                        virtualBundle : virtualBundle,
                        modelHotel : modelHotel
                    })

                    this.on({
                        setCurrent : this.setCurrent,
                        goToMap : this.goToMap,
                        getHotelDetails : this.getHotelDetails,
                        change : function(data){

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

                getHotelDetails : function(){
                    EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, this.get('modelHotel'));
                },

                goToMap : function(){
                    EventManager.fire(Events.DYNAMIC_SERP_GO_TO_MAP, this.get('modelHotel'));
                },

                setCurrent : function(){
                    EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_HOTEL, this.get('modelHotel'));
                },


                parse: function (end) {

                }

            });

            return HotelItem;
        }]);

