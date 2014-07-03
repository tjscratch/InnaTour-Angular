/**
 * use dateHelper
 */
innaAppControllers.
    controller('PageBuySuccess', [
        '$scope',
        '$rootScope',
        '$templateCache',
        '$route',
        '$routeParams',
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
        function ($scope, $rootScope, $templateCache, $route, $routeParams, $filter, $location, dataService, paymentService, storageService, urlHelper, aviaHelper, innaAppUrls, dynamicBlock) {


            var Page = Ractive.extend({
                debug: true,
                el: document.querySelector('.page-root'),
                template: $templateCache.get('pages/page-buy-success/templ/index.html'),
                partials: {
                    buyResult: $templateCache.get('pages/page-buy-success/templ/buy-result.html')
                },
                data: {

                },
                init: function () {
                    var that = this;
                    that._dynamicBlock = null;


                    this.on({
                        change: function (data) {
                            console.log(data);

                            that._dynamicBlock = new dynamicBlock({
                                el: this.find('.js-dynamic-block'),
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
                    var passengers = data.Passengers;
                    data.PassengersData = {
                        adultCount : 0,
                        childCount : 0,
                        adult : '',
                        child : ''
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

                    passengers.forEach(function(pass){

                        var date = dateHelper.dateToJsDate(pass.Birthday);
                        pass.age = dateHelper.calculateAge(date);

                        if(pass.age >= 18){
                            data.PassengersData.adultCount++;

                            data.PassengersData.adult = data.PassengersData.adultCount + ' '
                                + $filter('decl')(data.PassengersData.adultCount, ["взрослый", "взрослых", "взрослых"]);
                        }
                        if(pass.age < 18){
                            data.PassengersData.childCount++;
                            data.PassengersData.child = data.PassengersData.childCount + ' '
                                + $filter('decl')(data.PassengersData.childCount, ["ребенок", "детей", "детей"]);
                        }
                    });

                    data.Price = data.Price + ' '
                        + $filter('decl')(data.Price, ["рубль", "рубля", "рублей"]);

                    /* partials */
                    data.ticket2ways = true;
                    data.partialInfoHotel = true;

                    return data;
                },

                /**
                 * Получаем данные опокупке
                 */
                getDataBuy: function () {
                    var that = this;
                    paymentService.getPaymentData({orderNum: $routeParams.OrderNum},
                        function (data) {
                            that.set(that.parse(data));
                        }
                    );
                }
            });

            var pageBuy = new Page();

            pageBuy.getDataBuy();


        }
    ])
