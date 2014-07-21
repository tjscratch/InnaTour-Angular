/**
 * Панель фильтрации для отелей и билетов
 * Вообще сама панель не чего не фильтрует
 *
 * Просто передает массив данных по которым нужно будет фильтровать
 *
 * При выборе любого свойства на панели, собираем новый набор и диспачим событие с этим набором
 *
 * EventManager.fire('FilterPanel:change', filtersCollection)
 * Логику фильтрации реализуют все компоненты подписчики
 */


angular.module('innaApp.conponents').
    factory('FilterPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'FilterExtra',
        'FilterPrice',
        'FilterName',
        'FilterCategory',
        'FilterSlider',
        'FilterStars',
        'FilterTaFactor',
        'FilterType',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterExtra, FilterPrice, FilterName, FilterCategory, FilterSlider, FilterStars, FilterTaFactor, FilterType) {

            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ/panel.hbs.html'),
                data: {
                    asMap: false,
                    filter_hotel: true,
                    filter_avia: false,

                    // данные для компонентов фильтров
                    filtersData : {

                    }
                },

                // части шаблонов которые содержат компоненты фильтров
                partials : {
                    HotelsFilter : '<div>HotelsFilter</div>',
                    TicketFilter : '<div>TicketFilter</div>',
                    MapFilter : '<div>MapFilter</div>',

                    ruble: $templateCache.get('components/ruble.html')
                },
                components: {
                    'FilterExtra' : FilterExtra,
                    'FilterPrice' : FilterPrice,
                    'FilterName' : FilterName,
                    'FilterCategory' : FilterCategory,
                    'FilterSlider' : FilterSlider,
                    'FilterStars' : FilterStars,
                    'FilterTaFactor' : FilterTaFactor,
                    'FilterType' : FilterType
                },
                init: function () {
                    var that = this;

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })
                },


                parse: function (end) {

                },


                doFilter : function(){

                },

                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return FilterPanel;
        }]);


