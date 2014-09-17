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
                    SaveData : [],
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

                    this.mergeData();

                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {

                                console.info(data.context);

                                if (data.context.isChecked) {
                                    // отдельно сохраняем весь контекст
                                    this.push('SaveData', data.context);
                                    this.push('value.val', data.context.Value)
                                } else if (!data.context.isChecked) {

                                    this.splice('value.val', this.get('value.val').indexOf(data.context.Value), 1);

                                    if(this.get('SaveData').length) {
                                        this.get('SaveData').forEach(function (item, i) {
                                            if (data.context.Value == item.Value) {
                                                that.splice('SaveData', i, 1);
                                            }
                                        });
                                    }
                                }

                                console.info(this.get('SaveData'));

                                this._parent.fire('changeChildFilter', this.get('value.val'));

                                this.hasSelected();
                            }
                        },
                        resetFilter: function (opt) {
                            this.set('TaFactor.List.*.isChecked' , false);
                            this.set('SaveData' , []);
                        },
                        teardown: function (evt) {

                        }
                    });


                    this.observe('TaFactor', function(value){
                        console.info('TaFactor observe');
                    })
                },

                components: {
                    Tripadvisor: Tripadvisor
                },

                mergeData : function(){
                    if(this.get('SaveData').length) {
                       //this.get('TaFactor')
                    }
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

                    this.get('TaFactor.List').forEach(function (item, i) {
                        if (item.Value == data) {
                            that.set('TaFactor.List.' + i + '.isChecked', false);
                            that.splice('SaveData', i, 1);
                        }
                    });

                    this._parent.fire('changeChildFilter', this.get('value.val'));
                    this.hasSelected();
                }
            });

            return FilterTaFactor;
        }]);


