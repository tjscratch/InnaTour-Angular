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
        '$locale',

        // components
        'DynamicBlockAviaHotel',
        'Balloon',
        function ($scope, $rootScope, $templateCache, $routeParams, $filter, paymentService, urlHelper, aviaHelper, innaAppUrls, $locale, DynamicBlockAviaHotel, Balloon) {


            $scope.hotelToShowDetails = null;


            var Page = Ractive.extend({
                debug: true,
                el: document.querySelector('.page-root'),
                template: $templateCache.get('pages/page-buy-success/templ/index.html'),

                partials: {
                    buyResult: $templateCache.get('pages/page-buy-success/templ/buy-result.html')
                },
                components: {
                    DynamicBlockAviaHotel: DynamicBlockAviaHotel
                },
                data: {
                    loadData: false,
                    pluralize: utils.pluralize,
                    moment : moment
                },
                beforeInit: function (options) {

                },
                init: function () {
                    var that = this;
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

                },

                showBalloonLoading: function (evt) {
                    this._balloonLoading = new Balloon({
                        data: {
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
                        return utils.pluralize(count, ['пересадка', 'пересадки', 'пересадок']);
                    }

                    /* stars */
                    hotel.StarsArr = [];
                    for (var i = 0; i < hotel.Stars; i++) {
                        hotel.StarsArr.push(i);
                    }

                    // сколько взрослых и детей
                    passengers.forEach(function (pass) {
                        var date = dateHelper.dateToJsDate(pass.Birthday);
                        pass.age = dateHelper.calculateAge(date);
                        if (pass.age >= 18) data.PassengersData.adultCount++;
                        if (pass.age < 18) data.PassengersData.childCount++;
                    });

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
