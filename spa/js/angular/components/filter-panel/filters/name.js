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
                            if (data && (data['name.value'] != undefined)) {

                                clearTimeout(this._timeOut);
                                this._timeOut = setTimeout(function () {
                                    this.set('value.val', data['name.value']);
                                    this.hasSelected();
                                }.bind(this), 100);
                            }
                        },
                        resetFilter: function () {
                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },

                parse: function (end) {

                },


                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return FilterName;
        }]);


