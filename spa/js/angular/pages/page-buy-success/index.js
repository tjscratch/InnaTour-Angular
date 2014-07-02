innaAppControllers.
    controller('PageBuySuccess', [
        '$scope',
        '$rootScope',
        '$templateCache',
        '$route',
        '$filter',
        '$location',
        'dataService',
        'paymentService',
        'storageService',
        'urlHelper',
        'aviaHelper',
        'innaApp.Urls',

        // components
        'dynamicBlock',
        function ($scope, $rootScope, $templateCache, $route, $filter, $location, dataService, paymentService, storageService, urlHelper, aviaHelper, innaAppUrls, dynamicBlock) {


            var Page = Ractive.extend({
                debug: true,
                template: $templateCache.get('pages/page-buy-success/templ/index.html'),

                init: function () {
                    var that = this;
                    that._dynamicBlock = null;


                    this.on({
                        change: function (data) {
                            console.log(data);
                            that._dynamicBlock = new dynamicBlock({
                                el: this.find('.dynamicBlock'),
                                data: data
                            });


                        }
                    })
                },

                /**
                 * Подготавливаем данные для шаблонов
                 * @param {Object} data
                 * @returns {*}
                 */
                parse: function (data) {
                    var avia = data.AviaInfo;
                    var hotel = data.Hotel;

                    // добавляем новые поля
                    aviaHelper.addCustomFields(avia);

                    avia.transferCount = function (count) {
                        return $filter('decl')(count, ['пересадка', 'пересадки', 'пересадок']);
                    }


                    /* hotel data */
                    hotel.CheckIn = $filter('date')(hotel.CheckIn, 'd MMM');
                    hotel.CheckOut = $filter('date')(hotel.CheckOut, 'd MMM');
                    hotel.NightCount = hotel.NightCount + ' ' + $filter('decl')(hotel.NightCount, ["ночь", "ночи", "ночей"]);

                    /* stars */
                    hotel.StarsArr = [];
                    for (var i = 0; i < hotel.Stars; i++) {
                        hotel.StarsArr.push(i);
                    }

                    /* partials */
                    data.ticket2ways = true;
                    data.buyResult = true;
                    data.partialInfoHotel = true;

                    return data;
                },

                /**
                 * Получаем данные опокупке
                 */
                getDataBuy: function () {
                    var that = this;
                    paymentService.getPaymentData({orderNum: 'PEE962'},
                        function (data) {
                            that.set(that.parse(data));
                        }
                    );
                }
            });


            var pageBuy = new Page({
                el: document.querySelector('.page-root'),
                partials: {
                    buyResult: $templateCache.get('components/buy/buy-result.html')
                }
            });

            pageBuy.getDataBuy();


        }
    ])
