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

                    this.on({
                        change : function(data){

                        },
                        setCurrent : this.setCurrent,
                        goToMap : this.goToMap,
                        teardown: function (evt) {

                        }
                    })

                    this.observe('hotel', function(newValue, oldValue, keypath) {
                        if (newValue) {
                            var modelHotel = new inna.Models.Hotels.Hotel(this.get('hotel'))
                            var virtualBundle = new inna.Models.Dynamic.Combination();
                            virtualBundle.hotel = modelHotel;
                            virtualBundle.ticket = this.get('combinationModel').ticket;

                            this.set({
                                virtualBundle : virtualBundle,
                                modelHotel : modelHotel
                            })
                        }
                    });


                    /*$element.on('click', '.js-hotel-info-place', function (evt) {
                        $scope.$emit('hotel:go-to-map', $scope.hotel);
                    });*/
                },

                getHotelDetails : function(){
                    EventManager.fire('more:detail:hotel', this.get('modelHotel'));
                },

                goToMap : function(){
                    EventManager.fire('hotel:go-to-map', this.get('modelHotel'));
                },

                setCurrent : function(){
                    EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_HOTEL, this.get('modelHotel'));
                },


                parse: function (end) {

                }

            });

            return HotelItem;
        }]);

