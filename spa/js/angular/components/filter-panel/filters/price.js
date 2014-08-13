angular.module('innaApp.components').
    factory('FilterPrice', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterPrice = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/price.hbs.html'),
                data: {
                    value: {
                        name: 'FullPackagePrice',
                        val: [],
                        fn: function (data, component_val) {
                            return (data <= component_val.val[0]);
                        }
                    },
                    priceValue: null,
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    }
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    this._timeOut = null;
                    this._slider = null;

                    this.on({
                        change: function (data) {
                            if (data['Price.Value']) {

                                var priceValue = parseInt(data['Price.Value'], 10);

                                clearTimeout(this._timeOut);
                                this._timeOut = setTimeout(function () {

                                    if (priceValue > 0)
                                        this.set('value.val', [priceValue])
                                    else
                                        this.set('value.val', [])


                                    // выставляем значение слайдера
                                    this._slider.slider('value', priceValue);
                                    this.hasSelected();
                                }.bind(this), 300);
                            }
                        },

                        resetFilter: function () {
                            this.set({'Price.Value': that.get('Price.Max')});
                        },
                        teardown: function (evt) {
                            this._slider.slider("destroy");
                            this._slider = null;
                        }
                    });
                },

                /**
                 *
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    this._super(data);
                    var that = this;

                    this.set({
                        'value.val': [],
                        'Price.Value': that.get('Price.Value')
                    });

                    this.hasSelected();
                },


                parse: function (end) {

                },

                slide: function (val) {
                    this.set('Price.Value', val);
                },

                complete: function (data) {
                    var that = this;
                    var slider = this.find('.js-range')

                    this._slider = $(slider).slider({
                        range: "min",
                        animate: true,
                        min: that.get('Price.Min'),
                        max: that.get('Price.Max'),
                        value: that.get('Price.Value'),
                        slide: function (event, ui) {
                            that.slide(ui.value)
                        }
                    });
                }
            });

            return FilterPrice;
        }]);


