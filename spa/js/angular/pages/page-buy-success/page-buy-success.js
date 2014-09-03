/**
 * Страница успешной покупки пакета
 *
 * use dateHelper
 *
 */
innaAppControllers.
    controller('PageBuySuccess', [
        '$scope',
        '$rootScope',
        '$templateCache',
        '$routeParams',
        '$filter',
        '$timeout',
        'paymentService',
        'urlHelper',
        'aviaHelper',
        'innaApp.Urls',
        '$locale',

        // components
        'DynamicBlock',
        'Balloon',
        'NeedVisa',
        function ($scope, $rootScope, $templateCache, $routeParams, $filter, $timeout, paymentService, urlHelper, aviaHelper, innaAppUrls, $locale, DynamicBlock, Balloon, NeedVisa) {
            //document.body.classList.add('lighten-theme');

            $scope.hotelToShowDetails = null;


            var DynamicBlockAviaHotel = DynamicBlock.extend({
                data: {
                    settings: {
                        height: 220,
                        countColumn: 2,
                        classBlock: 'buy__fly b-result_col_two b-result_middle'
                    }
                },
                partials: {
                    collOneContent: $templateCache.get('components/dynamic-block/templ/ticket2ways.hbs.html'),
                    collTwoContent: $templateCache.get('components/dynamic-block/templ/hotel-info-bed-type.hbs.html')
                },
                init: function (options) {
                    this._super(options);

                    this.on({
                        getHotelDetails: this.getHotelDetails
                    })
                }
            });


            /**
             * Контроллер page-buy-success
             * @constructor
             */
            var Page = Ractive.extend({
                debug: true,
                el: document.querySelector('.page-root'),
                template: $templateCache.get('pages/page-buy-success/templ/index.html'),

                partials: {
                    buyResult: $templateCache.get('pages/page-buy-success/templ/buy-result.html')
                },
                components: {
                    DynamicBlockAviaHotel: DynamicBlockAviaHotel,
                    NeedVisa: NeedVisa
                },
                data: {
                    loadData: false
                },
                init: function () {
                    var that = this;
                    this._balloon = new Balloon();

                    this.on({
                        showBalloonTicket: this.showBalloonTicket,
                        showBalloonHotel: this.showBalloonHotel,
                        teardown: function () {
                            this._balloon.teardown();
                            this._balloon = null;
                        }
                    });
                },

                showBalloonLoading: function (evt) {
                    this._balloon.updateView({
                        balloonClose: false,
                        template: 'loading.html'
                    });
                },


                showBalloonTicket: function (evt) {
                    if (evt && evt.original) {
                        evt.original.preventDefault();
                    }
                    // вызываем aviaHelper.tarifs
                    var tarifs = new aviaHelper.tarifs()
                    tarifs.fillInfo(this.get('AviaInfo'));
                    tarifs.setected = tarifs.list[0];
                    tarifs.setected.current = true;

                    (new Balloon({
                        data: {
                            balloonPart: 'ticket-rules.html',
                            balloon_class: 'balloon_medium',
                            AviaInfo: this.get('AviaInfo'),
                            tarifs: tarifs,
                            from: tarifs.setected.from,
                            to: tarifs.setected.to,
                            _RULE_: tarifs.setected.rule
                        }
                    }).show());

                },

                showBalloonHotel: function (evt) {
                    if (evt && evt.original) {
                        evt.original.preventDefault();
                    }

                    var hotelRules = new aviaHelper.hotelRules();
                    hotelRules.fillData(this.get('Hotel'));

                    (new Balloon({
                        data: {
                            balloonPart: 'hotel-rules.html',
                            balloon_class: 'balloon_ticket',
                            hotelRules: hotelRules
                        }
                    }).show());
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

                            $timeout(function () {
                                that._balloon.hide();
                            }, 1000);
                        },
                        function () {
                            that._balloon.updateView({
                                balloonClose: true,
                                content : '<span></span>',
                                title : 'Пакет не найден',
                                template: 'err.html'
                            });
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
                    var passengers = data.Passengers;

                    data.PassengersData = {
                        adultCount: 0,
                        childCount: 0,
                        adult: '',
                        child: ''
                    };

                    // добавляем новые поля
                    aviaHelper.addCustomFields(avia);

                    data.price = $filter('price')(data.Price);

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

            $scope.$on('$destroy', function () {
                console.log('$destroy buy success');

                document.body.classList.remove('lighten-theme');
                pageBuy.teardown();
                pageBuy = null;
                DynamicBlockAviaHotel = null;
            })
        }
    ]);
