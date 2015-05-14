angular.module('innaApp.components').
    factory('FilterStars', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaAppApiEvents',

        'ClassFilter',
        'Stars',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter, Stars) {

            var FilterStars = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/stars.hbs.html'),
                data: {
                    value: {
                        name: 'Stars',
                        val: [],
                        fn : function(data, component_val){
                            var result = component_val.val.filter(function(item){
                                if (data == item) {
                                    return true;
                                } else if(data == 0 && item ==1) {
                                    return true;
                                }
                            })
                            return result.length;
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
                                    this.push('value.val', data.context.Value)
                                } else if (!data.context.isChecked) {
                                    this.spliceValItem(data.context.Value);
                                    this.spliceSaveData(data.context);
                                }

                                this.fire('onCheckedFilter', {
                                    name : this.get('value.name'),
                                    value : this.get('value')
                                });
                                this.hasSelected();
                            }

                        },
                        resetFilter: function () {
                            this.set('FilterData.List.*.isChecked',  false);
                        },
                        teardown: function (evt) {
                            this.set('value.val', []);
                            this.set({value : {}})
                        }
                    });
                },

                components: {
                    Stars: Stars
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
                    })

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

            return FilterStars;
        }]);


