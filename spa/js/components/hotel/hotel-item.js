angular.module('innaApp.components').
    factory('HotelItem', [
        'EventManager',
        'innaApp.API.events',
        'innaApp.Urls',
        '$filter',
        '$routeParams',
        '$location',
        '$templateCache',
        'DynamicBlock',
        'HotelGallery',
        'modelRecommendedPair',
        'modelHotels',
        function (EventManager, Events, Urls, $filter, $routeParams, $location, $templateCache, DynamicBlock, HotelGallery, modelRecommendedPair, modelHotels) {

            /**
             * Компонент HotelItem
             * @constructor
             * @inherits DynamicBlock
             */
            var HotelItem = DynamicBlock.extend({
                data: {
                    type : 'hotel',
                    hidden : false,
                    settings: {
                        height: 200,
                        countColumn: 3,
                        removeOneSeparator: true,
                        classBlock: 'b-result_col_three_galary b-result_middle',
                        classColl1: 'col-no-padding',
                        classColl3: 'col-xs-3 result-choice'
                    },
                    isFullWL: (window.partners && window.partners.isFullWL()),

                    /**
                     * Строим URL для страницы подробнее об отеле
                     * :DepartureId-:ArrivalId-:StartVoyageDate-:EndVoyageDate-:TicketClass-:Adult-:Children-:HotelId-:TicketId-:ProviderId?
                     *
                     * searchParams -  добавляется в каждую карточку отеля в компоненте list-panel:parse
                     */
                    computedUrlDetails: function () {
                        var searchParams = this.get('searchParams');

                        var DepartureId = searchParams.DepartureId;
                        var ArrivalId = searchParams.ArrivalId;
                        var StartVoyageDate = searchParams.StartVoyageDate;
                        var EndVoyageDate = searchParams.EndVoyageDate;
                        var TicketClass = searchParams.TicketClass;
                        var Adult = searchParams.Adult || 0;
                        var Children = searchParams.Children || '';
                        var hotelID = this.get('hotel.HotelId');
                        var ticketId = this.get('virtualBundle.ticket.data.VariantId1');
                        var ticketBackId = this.get('virtualBundle.ticket.data.VariantId2');
                        var providerId = this.get('hotel.ProviderId');

                        var urlDetails = '/#' + Urls.URL_DYNAMIC_HOTEL_DETAILS + [
                            DepartureId,
                            ArrivalId,
                            StartVoyageDate,
                            EndVoyageDate,
                            TicketClass,
                            Adult,
                            Children,
                            hotelID,
                            ticketId,
                            ticketBackId,
                            providerId
                        ].join('-');

                        if (window.partners && window.partners.isFullWL()) {
                            urlDetails = window.partners.getParentLocationWithUrl(urlDetails);
                        }

                        return urlDetails;
                    }
                },
                partials: {
                    collOneContent: '<HotelGallery PhotoHotel="{{Photos}}"/>',
                    collTwoContent: $templateCache.get('components/hotel/templ/hotel-center.hbs.html'),
                    collThreeContent: $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html')
                },

                components: {
                    HotelGallery: HotelGallery
                },

                onrender: function (options) {
                    var that = this;
                    this._super(options);

                    var modelHotel = new modelHotels(this.get('hotel'));
                    var virtualBundle = new modelRecommendedPair({
                        ticket : this.get('combinationModel').ticket,
                        hotel : modelHotel
                    });


                    this.set({
                        virtualBundle: virtualBundle,
                        modelHotel: modelHotel
                    });

                    this.on({
                        setCurrent: this.setCurrent,
                        goToMap: this.goToMap,
                        getHotelDetails: this.getHotelDetails,
                        change: function (data) {

                        },
                        teardown: function (evt) {
                            //console.log('teardown hotel item');
                        }
                    });


                    // исключаем выбранный вариант
                    if(this.get('combinationModel').hotel.data.HotelId == this.get('hotel.HotelId')){
                        that.set('hidden', true);
                    }


                    /**
                     * Когда выбераем отель, то прячем его( убираем из списка и показываем в выбранном варианте)
                     * Тот отель что был выбран ранее, показываем
                     */
                    EventManager.on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function(modelHotel, hotelId){
                        if((hotelId != that.get('hotel.HotelId')) && that.get('hidden')){
                            that.set('hidden', false);
                        }
                    });
                },

                getHotelDetails: function () {
                    EventManager.fire(Events.DYNAMIC_SERP_MORE_DETAIL_HOTEL, this.get('modelHotel'));
                },

                goToMap: function () {
                    EventManager.fire(Events.DYNAMIC_SERP_GO_TO_MAP, this.get('modelHotel'));
                },

                /**
                 * Выбераем отель
                 * Передаем в событие данные
                 * this.get('modelHotel') - модель отеля
                 * this.get('hotel.HotelId') - id отеля
                 */
                setCurrent: function () {
                    this.set('hidden', true);
                    EventManager.fire(Events.DYNAMIC_SERP_CHOOSE_HOTEL, this.get('modelHotel'), this.get('hotel.HotelId'));
                },


                parse: function (end) {

                }
            });

            return HotelItem;
        }]);

