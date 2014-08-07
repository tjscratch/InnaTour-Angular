angular.module('innaApp.conponents').
    factory('FilterStars', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        'Stars',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter, Stars) {

            var FilterThis = null;
            var FilterStars = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/stars.hbs.html'),
                data: {
                    value: {
                        name: 'Stars',
                        val: [],
                        fn : function(data){
                            var result = FilterThis.get('value.val').filter(function(item){
                                if (data == item) return true;
                            })
                            return result.length;
                        }
                    }
                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this.on({
                        onChecked: function (data) {
                            if (data && data.context) {

                                if (data.context.isChecked) {
                                    this.push('value.val', data.context.value)
                                } else if (!data.context.isChecked) {
                                    this.splice('value.val', this.get('value.val').indexOf(data.context.value), 1);
                                }
                            }
                            this.hasSelected();
                        },
                        resetFilter: function () {
                            this.set('Stars.list.*.isChecked',  false);
                        },
                        teardown: function (evt) {
                            FilterThis = null;
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
                    this.get('Stars.list').forEach(function(item, i){
                        if(item.value == data){
                            that.set('Stars.list.'+ i +'.isChecked',  false);
                        }
                    })

                    this.hasSelected();
                }
            });

            return FilterStars;
        }]);


