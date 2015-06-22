angular.module('innaApp.components').
    factory('FilterMeal', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {


            var FilterMeal = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/meal.hbs.html'),
                data: {
                    value : {
                        name : 'MealCode',
                        val : [],
                        label: [],
                        fn : function(data, component_val){
                            var result = component_val.val.filter(function(item){
                                if (data == item) return true;
                            });

                            return (result.length) ? true : false;
                        }
                    }
                },

                onrender: function (options) {
                    this._super(options);
                    var that = this;
                    this.SaveData = [];


                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.SaveData.push(data.context);
                                    this.push('value.val', data.context.Value) // data.context.value
                                    this.push('value.label', data.context.Name) // data.context.name
                                } else if (!data.context.isChecked) {
                                    this.spliceValItem(data.context.Value, 'Value');
                                    this.spliceSaveData(data.context);
                                }

                                this.fire('onCheckedFilter', {
                                    name : this.get('value.name'),
                                    value : this.get('value')
                                });
                                this.hasSelected();
                            }
                        },
                        resetFilter: function (data) {
                            this.set('FilterData.List.*.isChecked', false);
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                /**
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove : function(data){
                    this._super(data);
                    var that = this;

                    this.splice('value.val', this.get('value.label').indexOf(data), 1);
                    this.splice('value.label', this.get('value.label').indexOf(data), 1);

                    this.get('FilterData.List').forEach(function(item, i){
                        if(item.Name == data){
                            that.set('FilterData.List.'+ i +'.isChecked',  false);
                            that.SaveData.splice(i, 1);
                        }
                    });
                    this.fire('onCheckedFilter', {
                        name : this.get('value.name'),
                        value : this.get('value')
                    });
                    this.hasSelected();
                },

                spliceValItem : function(data){
                    var that = this;
                    var val = this.get('value.val');

                    if(val.length) {
                        val.forEach(function (item, i) {
                            if (data == item){
                                that.splice('value.val', i, 1);
                                that.splice('value.label', i, 1);   
                            }
                        })
                    }
                }
            });

            return FilterMeal;
        }]);


