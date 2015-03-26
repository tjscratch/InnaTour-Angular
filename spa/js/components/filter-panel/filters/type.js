angular.module('innaApp.components').
    factory('FilterType', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {


            var FilterType = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/type.hbs.html'),
                data: {
                    value : {
                        name : 'HotelType',
                        val : [],
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

                    this.splice('value.val', this.get('value.val').indexOf(data), 1);

                    this.get('FilterData.List').forEach(function(item, i){
                        if(item.Value == data){
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
                            if (data == item)
                                that.splice('value.val', i, 1);
                        })
                    }
                }
            });

            return FilterType;
        }]);


