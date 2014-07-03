/**
 * use dateHelper
 */
innaAppControllers.
    controller('PageBuySuccess', [
        '$scope',
        '$rootScope',
        '$templateCache',
        '$routeParams',
        '$filter',
        'paymentService',
        'urlHelper',
        'aviaHelper',
        'innaApp.Urls',

        // components
        'DynamicBlockAviaHotel',
        'Balloon',
        function ($scope, $rootScope, $templateCache, $routeParams, $filter, paymentService, urlHelper, aviaHelper, innaAppUrls, DynamicBlockAviaHotel, Balloon) {


            var Page = Ractive.extend({
                debug: true,
                el: document.querySelector('.page-root'),
                template: $templateCache.get('pages/page-buy-success/templ/index.html'),
                partials: {
                    buyResult: $templateCache.get('pages/page-buy-success/templ/buy-result.html')
                },
                data: {
                    loadData : false
                },
                init: function () {
                    var that = this;
                    this._DynamicBlockAviaHotel = null;
                    this._balloon = null;
                    this._partialBaloonTicket = $templateCache.get('components/balloon/templ/ticket-rules.html');
                    this._partialBaloonHotel = $templateCache.get('components/balloon/templ/hotel-rules.html');
                    this._partialBaloonLoading = $templateCache.get('components/balloon/templ/loading.html');


                    this.on({
                        change: this.change,
                        showBalloonTicket: this.showBalloonTicket,
                        showBalloonHotel: this.showBalloonHotel
                    })
                },


                /**
                 * Событие изменения модели ractive
                 * @param data
                 */
                change: function (data) {
                    console.log(data);

                    this._DynamicBlockAviaHotel = new DynamicBlockAviaHotel({
                        el: this.find('.js-dynamic-block'),
                        data: data
                    });
                },


                showBalloonLoading: function (evt) {
                    this._balloonLoading = new Balloon({
                        data: {
                            //title: 'Loading....',
                            balloonClose: false
                        },
                        partials: {
                            balloonContent: this._partialBaloonLoading
                        }
                    });
                    this._balloonLoading.show();
                },

                hideBalloonLoading: function () {
                    this._balloonLoading.hide();
                },

                showBalloonTicket: function (evt) {

                    // вызываем aviaHelper.tarifs
                    var tarifs = new aviaHelper.tarifs()
                    tarifs.fillInfo(this.get('AviaInfo'));
                    tarifs.setected = tarifs.list[0];
                    tarifs.setected.current = true;

                    this._balloonTicket = new Balloon({
                        data: {
                            balloon_class: 'balloon_medium',
                            AviaInfo: this.get('AviaInfo'),
                            tarifs: tarifs,
                            from: tarifs.setected.from,
                            to: tarifs.setected.to,
                            _RULE_: tarifs.setected.rule
                        },
                        partials: {
                            balloonContent: this._partialBaloonTicket
                        }
                    });
                    this._balloonTicket.show();
                },

                showBalloonHotel: function (evt) {
                    var hotelRules = new aviaHelper.hotelRules();
                    hotelRules.fillData(this.get('Hotel'));


                    this._balloonHotel = new Balloon({
                        data: {
                            balloon_class: 'balloon_ticket',
                            hotelRules: hotelRules
                        },
                        partials: {
                            balloonContent: this._partialBaloonHotel
                        }
                    })
                    this._balloonHotel.show();
                },

                /**
                 * Получаем данные о покупке
                 */
                getDataBuy: function () {
                    var that = this;
                    this.showBalloonLoading();
                    paymentService.getPaymentData({orderNum: $routeParams.OrderNum},
                        function (data) {
                            if (data) {
                                that.set(that.parse(data));
                            }

                            setTimeout(function () {
                                that.hideBalloonLoading();
                            }, 1000);
                        },
                        function () {
                            that.hideBalloonLoading();
                        }
                    );
                },

                /**
                 * Подготавливаем данные для шаблонов
                 * @param {Object} data
                 * @returns {*}
                 */
                parse: function (data) {
                    var avia = data.AviaInfo;
                    var hotel = data.Hotel;
                    var passengers = data.Passengers;
                    data.PassengersData = {
                        adultCount: 0,
                        childCount: 0,
                        adult: '',
                        child: ''
                    };

                    // добавляем новые поля
                    aviaHelper.addCustomFields(avia);

                    avia.transferCount = function (count) {
                        return $filter('decl')(count, ['пересадка', 'пересадки', 'пересадок']);
                    }


                    /* hotel data */
                    hotel.CheckInFull = $filter('date')(hotel.CheckIn, 'd MMMM yyyy');
                    hotel.CheckOutFull = $filter('date')(hotel.CheckOut, 'd MMMM yyyy');

                    hotel.CheckInHotel = $filter('date')(hotel.CheckIn, 'd MMM');
                    hotel.CheckOutHotel = $filter('date')(hotel.CheckOut, 'd MMM');
                    hotel.NightCountHotel = hotel.NightCount + ' ' + $filter('decl')(hotel.NightCount, ["ночь", "ночи", "ночей"]);

                    /* stars */
                    hotel.StarsArr = [];
                    for (var i = 0; i < hotel.Stars; i++) {
                        hotel.StarsArr.push(i);
                    }

                    passengers.forEach(function (pass) {

                        var date = dateHelper.dateToJsDate(pass.Birthday);
                        pass.age = dateHelper.calculateAge(date);

                        if (pass.age >= 18) {
                            data.PassengersData.adultCount++;

                            data.PassengersData.adult = data.PassengersData.adultCount + ' '
                                + $filter('decl')(data.PassengersData.adultCount, ["взрослый", "взрослых", "взрослых"]);
                        }
                        if (pass.age < 18) {
                            data.PassengersData.childCount++;
                            data.PassengersData.child = data.PassengersData.childCount + ' '
                                + $filter('decl')(data.PassengersData.childCount, ["ребенок", "детей", "детей"]);
                        }
                    });

                    data.Price = data.Price + ' '
                        + $filter('decl')(data.Price, ["рубль", "рубля", "рублей"]);

                    data.loadData = true;
                    data.ticket2ways = true;
                    data.partialInfoHotel = true;

                    return data;
                }
            });

            var pageBuy = new Page();

            pageBuy.getDataBuy();


        }
    ]);
