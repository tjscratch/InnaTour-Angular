angular.module('innaApp.components').
    factory('FilterTaFactor', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        'Tripadvisor',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter, Tripadvisor) {

            /**
             * Свойство SaveData для сохранения состояния фильтра
             * Не забывать следить за ним и очищать
             */

            var FilterTaFactor = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/tafactor.hbs.html'),
                data: {
                    value: {
                        name: 'TaFactor',
                        val: [],
                        fn: function (data, component_val) {

                            var result = component_val.val.filter(function (item) {
                                if (Math.floor(data) == item) return true;
                            });

                            return (result.length) ? true : false;
                        }
                    },
                    tafactorValue: []
                },
                init: function (options) {
                    var that = this;
                    this._super(options);
                    this.SaveData = [];

                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {

                                if (data.context.isChecked) {
                                    // отдельно сохраняем весь контекст
                                    this.SaveData.push(data.context);
                                    this.push('value.val', data.context.Value)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.Value), 1);
                                    this.spliceSaveData(data.context);
                                }

                                this.fire('onCheckedFilter', this.get('value.val'));

                                this.hasSelected();
                            }
                        },
                        resetFilter: function (opt) {
                            this.set('FilterData.List.*.isChecked' , false);
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                components: {
                    Tripadvisor: Tripadvisor
                },


                /**
                 *
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove: function (data) {
                    this._super(data);
                    var that = this;
                    this.splice('value.val', this.get('value.val').indexOf(data), 1);

                    this.get('FilterData.List').forEach(function (item, i) {
                        if (item.Value == data) {
                            that.set('FilterData.List.' + i + '.isChecked', false);
                            that.SaveData.splice(i, 1);
                        }
                    });

                    this.fire('onCheckedFilter', this.get('value.val'));
                    this.hasSelected();
                }
            });

            return FilterTaFactor;
        }]);


