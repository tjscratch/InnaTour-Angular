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

                onconstruct: function (options) {
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

                onrender: function (options) {
                    this._super(options);

                    this.observe('PriceObject', function (value) {
                        if (value) {
                            this.set('PriceObjectCalculate', value);
                        }
                    })
                }
            });

            return priceGeneric;
        }]);


/**
 * Директива PriceGenericDirective
 */
innaAppDirectives.directive('priceGenericDirective', [
    'PriceGeneric',
    function (PriceGeneric) {
        return {
            replace: true,
            template: '',
            scope: {
                PriceObject: "=priceObject",
                tooltipKlass: "@",
                iconWhite: "@",
                type: "@",
                el: '@'
            },
            link: function ($scope, $element, $attr) {

                var _PriceGeneric = new PriceGeneric({
                    el: $element[0],
                    data: {
                        template: "index.hbs.html",
                        PriceObject: $scope.PriceObject,
                        iconWhite : $scope.iconWhite,
                        tooltipKlass: $scope.tooltipKlass
                    }
                });

                $scope.$watch('PriceObject', function(value){
                    _PriceGeneric.set('PriceObject', value);
                })


                $scope.$on('$destroy', function () {
                    _PriceGeneric.teardown();
                    _PriceGeneric = null;
                })
            }
        }
    }])