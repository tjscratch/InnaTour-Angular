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
        function ($scope, $rootScope, $templateCache, $route, $filter, $location, dataService, paymentService, storageService, urlHelper, aviaHelper, innaAppUrls) {


            var Page = Ractive.extend({
                template: $templateCache.get('pages/page-buy-success/templ/index.html'),

                init: function () {
                    console.log('init ractive page');
                    
                    this.on({
                        change : function (evt, data) {
                            console.log('change', evt, data);
                        }

                    })
                },

                parse : function(data){
                    var avia = data.AviaInfo;
                    var hotel = data.Hotel;

                    //aviaHelper.addFormattedDatesFields(avia);
                    aviaHelper.addCustomFields(avia);

                    data.AviaInfo.transferCount = function(count){
                        return $filter('decl')(count, ['пересадка', 'пересадки', 'пересадок']);
                    }
                    data.ticket2ways = true;

                    return data;
                },

                getDataBuy: function () {
                    var that = this;
                    paymentService.getPaymentData({
                            orderNum: 'PEE962'
                        },
                        function (data) {
                            console.log(that.parse(data), 'data');
                            that.set(that.parse(data));
                        },
                        function (data) {

                        }
                    )
                }
            });


            var pageBuy = new Page({
                el: document.querySelector('.page-root'),
                data: {
                    greeting: 'Hello',
                    recipient: 'world'
                },
                partials : {
                    ticket2ways : $templateCache.get('components/ticket/templ/ticket2ways.html')
                }
            });


            pageBuy.getDataBuy();


        }
    ])
