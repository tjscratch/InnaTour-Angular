angular.module('innaApp.components').
    factory('FilterName', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {


            var FilterName = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/name.hbs.html'),
                data: {
                    value: {
                        name: 'HotelName',
                        val: [],
                        fn: function (data, component_val) {
                            var reg = new RegExp(component_val.val[0], 'i');
                            if (reg.test(data)) return true;
                        }
                    }
                },

                init: function (options) {
                    this._super(options);
                    var that = this;


                    this._timeOut = null;
                    this._next = 0;

                    this.on({
                        change: function (data) {
                            // ставим условие чтоб тело функции change
                            // выполнялось на изменение name.value
                            if (data && (data['name'] != undefined)) {

                                clearTimeout(this._timeOut);
                                this._timeOut = setTimeout(function () {
                                    this.set('value.val', [data['name']]);
                                    this.hasSelected();
                                }.bind(this), 100);
                            }
                        },
                        resetFilter: function () {
                            this.set('name' , '');
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                /**
                 *
                 * @param data
                 * @override
                 */
                IndicatorFiltersItemRemove : function(data){
                    this._super(data);
                    this.fire('resetFilter');
                    this.hasSelected();
                }
            });

            return FilterName;
        }]);


