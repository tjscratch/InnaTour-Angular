angular.module('innaApp.components').
    factory('FilterStars', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

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
                                if (data == item) return true;
                            })
                            return result.length;
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
                                    this.push('value.val', data.context.Value)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.Value), 1);
                                }
                            }
                            this.hasSelected();


                        },
                        resetFilter: function () {
                            this.set('Stars.List.*.isChecked',  false);
                        },
                        teardown: function (evt) {
                            console.log('teardown FilterStars');
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
                    this.get('Stars.List').forEach(function(item, i){
                        if(item.Value == data){
                            that.set('Stars.List.'+ i +'.isChecked',  false);
                        }
                    })

                    this.hasSelected();
                }
            });

            return FilterStars;
        }]);


