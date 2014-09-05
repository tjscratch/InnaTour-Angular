angular.module('innaApp.components').
    factory('PriceGeneric', [
        '$filter',
        '$templateCache',
        'TooltipBase',
        function ($filter, $templateCache, TooltipBase) {

            /**
             * Компонент priceGeneric
             * @constructor
             * @inherits TooltipBase
             */
            var priceGeneric = TooltipBase.extend({
                template: '{{>element}}',
                //template: $templateCache.get('components/tooltip/templ/price-generic.hbs.html'),
                isolated: true,
                append: true,
                data: {
                    isVisible: false,
                    //virtualBundle : null,
                    PriceObject: null,
                    tooltipKlass : '',
                    FullTotalPrice: null,
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
                    if (options.partials) {
                        this.setTemplate(options)
                    }
                },

                partials: {
                    element: function () {
                        var templ = '<span></span>';

                        if (this.get('template')) {
                            templ = $templateCache.get('components/tooltip/templ/' + this.get('template'));
                        } else {
                            templ = $templateCache.get('components/tooltip/templ/price-generic.hbs.html');
                        }
                        return templ;
                    },
                    ruble: $templateCache.get('components/ruble.html')
                },

                init: function (options) {
                    this._super(options);

                    this.isPriceObject = false;

                    if (this.get('virtualBundle') && !angular.isUndefined(this.get('virtualBundle').hotel.data.PriceObject)) {
                        this.isPriceObject = true;
                    }


                    this.observeVirtualBundle = this.observe('virtualBundle', function (value) {
                        //console.log('value update', value);
                        if (value && this.isPriceObject) {
                            //this.set('PriceObjectCalculate', this.get('virtualBundle').getFullTotalPriceNew(this.get('type')));
                            this.set('PriceObjectCalculate', this.get('virtualBundle').getFullTotalPrice());
                        }
                    })
                }
            });

            return priceGeneric;
        }]);
