angular.module('innaApp.components').
    factory('FilterType', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

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
                            })

                            return (result.length) ? true : false;
                        }
                    }
                },

                init: function (options) {
                    this._super(options);
                    var that = this;


                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {
                                if (data.context.isChecked) {
                                    this.push('value.val', data.context.name) // data.context.value
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.name), 1);
                                }
                            }
                            this.hasSelected();
                        },
                        resetFilter: function () {
                            this.set('HotelType.list.*.isChecked', false);
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

                    this.get('HotelType.list').forEach(function(item, i){
                        if(item.name == data){
                            that.set('HotelType.list.'+ i +'.isChecked',  false);
                        }
                    })

                    this.hasSelected();
                }
            });

            return FilterType;
        }]);


