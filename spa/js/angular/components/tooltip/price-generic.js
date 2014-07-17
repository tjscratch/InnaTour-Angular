angular.module('innaApp.conponents').
    factory('PriceGeneric', [
        '$filter',
        '$templateCache',
        'TooltipBase',
        function ($filter, $templateCache, TooltipBase) {

            /**
             * Наследуется от базового класса TooltipBase
             */

            var priceGeneric = TooltipBase.extend({
                template: '{{>element}}',
                //template: $templateCache.get('components/tooltip/templ/price-generic.hbs.html'),
                isolated: true,
                append: true,
                partials : {
                    ruble : $templateCache.get('components/ruble.html')
                },
                data: {
                    isVisible: false,
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    }
                },

                // dynamic template
                setTemplate: function (options) {
                    var templ = '';

                    if (options.data.template) {
                        templ = $templateCache.get('components/tooltip/templ/' + options.data.template);
                    } else {
                        templ = $templateCache.get('components/tooltip/templ/price-generic.hbs.html');
                    }
                    options.partials.element = templ;
                },

                beforeInit: function (options) {
                    this.setTemplate(options)
                },
                init: function (options) {
                    this._super(options)
                }
            });

            return priceGeneric;
        }]);
