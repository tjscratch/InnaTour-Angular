angular.module('innaApp.conponents').
    factory('PriceGenericRact', [
        '$filter',
        '$templateCache',
        'TooltipBase',
        function ($filter, $templateCache, TooltipBase) {

            /**
             * Наследуется от базового класса TooltipBase
             */

            var priceGenericRact = TooltipBase.extend({
                template: $templateCache.get('components/tooltip/templ/price-generic-ract.html'),
                isolated: true,
                append: true,
                partials: {
                    partials_ruble: $templateCache.get('components/ruble.html')
                },
                data: {
                    isVisible: false,
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    }
                },
                init: function (options) {
                    this._super(options)
                }
            });

            return priceGenericRact;
        }]);
