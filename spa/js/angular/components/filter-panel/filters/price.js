angular.module('innaApp.conponents').
    factory('FilterPrice', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;
            var FilterPrice = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/price.hbs.html'),
                data: {
                    value: {
                        name: 'FullPackagePrice',
                        val: [],
                        fn: function (data) {
                            return (data <= FilterThis.get('value.val')[0]);
                        }
                    },
                    priceValue: null
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    this._timeOut = null;
                    FilterThis = this;

                    this.on({
                        change: function (data) {

                        },
                        resetFilter: function () {
                            this.set({'price.value': 0});
                        },
                        teardown: function (evt) {
                            FilterThis = null;
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
                        'PackagePrice.value': that.get('PackagePrice.value')
                    });

                    this.hasSelected();
                },


                parse: function (end) {

                },

                slide: function (val) {
                    this.set('PackagePrice.value', val);
                    if (val) {
                        clearTimeout(this._timeOut);
                        this._timeOut = setTimeout(function () {
                            if (val > 0) {
                                this.set('value.val', [val])
                            } else {
                                this.set('value.val', [])
                            }
                            this.hasSelected();
                        }.bind(this), 500);
                    }
                },

                complete: function (data) {
                    var that = this;
                    var slider = this.find('.js-range')

                    $(slider).slider({
                        range: "min",
                        animate: true,
                        min: that.get('PackagePrice.min'),
                        max: that.get('PackagePrice.max'),
                        value: that.get('PackagePrice.value'),
                        slide: function (event, ui) {
                            that.slide(ui.value)
                        }
                    });
                }
            });

            return FilterPrice;
        }]);


