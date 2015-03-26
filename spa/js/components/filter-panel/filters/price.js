angular.module('innaApp.components').
    factory('FilterPrice', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterPrice = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/price.hbs.html'),
                data: {
                    setValue: 0,
                    value: {
                        name: 'PackagePrice',
                        val: [],
                        fn: function (data, component_val) {
                            return (data <= component_val.val[0]);
                        }
                    }
                },
                components: {

                },
                onrender: function (options) {
                    this._super(options);
                    var that = this;
                    this.SaveData = [];
                    this._timeOut = null;
                    this._slider = null;

                    this.on({
                        change: function (data) {
                            if (data['FilterData.Value'] && data['setValue']) {

                                var priceValue = parseInt(data['FilterData.Value'], 10);

                                clearTimeout(this._timeOut);
                                this._timeOut = setTimeout(function () {

                                    if (priceValue > 0) {
                                        this.set('value.val', [priceValue])
                                        this.SaveData = [priceValue];
                                    }
                                    else {
                                        this.set('value.val', []);
                                        this.spliceSaveData();
                                    }


                                    // выставляем значение слайдера
                                    this._slider.slider('value', priceValue);
                                    this.fire('onCheckedFilter', {
                                        name : this.get('value.name'),
                                        value : this.get('value')
                                    });
                                    this.hasSelected();
                                }.bind(this), 300);
                            }
                        },

                        resetFilter: function () {
                            this.set({'FilterData.Value': this.get('FilterData.Max')});

                            if (this._slider) {
                                this._slider.slider('value', this.get('FilterData.Max'));
                            }
                        },
                        teardown: function (evt) {
                            if (this._slider)
                                this._slider.slider("destroy");

                            this._slider = null;
                        }
                    });
                },


                mergeData: function () {
                    var that = this;

                    if (this.SaveData.length) {
                        this.slide(that.SaveData[0]);
                        this.set('FilterData.Value', that.SaveData[0]);
                    }
                },

                spliceSaveData: function () {
                    if (this.SaveData.length) this.SaveData = [];
                },


                /**
                 *
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    //this._super(data);
                    var that = this;

                    this.set({
                        'value.val': [],
                        'FilterData.Value': that.get('FilterData.Max')
                    });
                    this.spliceSaveData();
                    this._slider.slider('value', this.get('FilterData.Max'));

                    this.fire('onCheckedFilter', {
                        name : this.get('value.name'),
                        value : this.get('value')
                    });
                    this.hasSelected();
                },


                /**
                 * Срабатывает на изменение положени слайдера
                 * свойство setValue выставляется для проверки что это настоящее изменение цены,
                 * а не сброс фильтра
                 * @param val
                 */
                slide: function (val) {
                    this.set({
                        'setValue': Math.random() * 1000,
                        'FilterData.Value': val
                    });
                },

                oncomplete: function (data) {
                    var that = this;
                    var slider = this.find('.js-range');

                    this._slider = $(slider).slider({
                        range: "min",
                        animate: true,
                        min: that.get('FilterData.Min'),
                        max: that.get('FilterData.Max'),
                        value: that.get('FilterData.Value'),
                        slide: function (event, ui) {
                            that.slide(ui.value)
                        }
                    });
                }
            });

            return FilterPrice;
        }]);


