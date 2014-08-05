angular.module('innaApp.conponents').
    factory('FilterName', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'ClassFilter',
        function (EventManager, $filter, $templateCache, $routeParams, Events, ClassFilter) {

            var FilterThis = null;

            var FilterName = ClassFilter.extend({
                template: $templateCache.get('components/filter-panel/templ-filters/name.hbs.html'),
                data: {
                    value: {
                        name: 'HotelName',
                        val: '',
                        fn: function (data) {
                            var reg = new RegExp(FilterThis.get('value.val'), 'i');
                            if (reg.test(data)) return true;
                        }
                    }
                },
                components: {

                },
                init: function (options) {
                    this._super(options);
                    var that = this;
                    FilterThis = this;

                    this._timeOut = null;
                    this._next = 0;

                    this.on({
                        change: function (data) {
                            // ставим условие чтоб тело функции change
                            // выполнялось на изменение name.value
                            if (data && (data['name'] != undefined)) {

                                clearTimeout(this._timeOut);
                                this._timeOut = setTimeout(function () {
                                    this.set('value.val', data['name']);
                                    this.hasSelected();
                                }.bind(this), 100);
                            }
                        },
                        resetFilter: function () {
                            this.set({
                                'name' : '',
                                'value.val': ''
                            });

                        },
                        teardown: function (evt) {
                            FilterThis = null;
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


