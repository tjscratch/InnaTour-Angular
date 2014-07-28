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
                        val: [],
                        fn : function(data){
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
                                    if (this.get('name.value').length) {
                                        var nameData = this.get('name.value').toLowerCase();
                                        this.set('value.val', nameData); //.split(' ')
                                    } else {
                                        this.set('value.val', '')
                                    }
                                }.bind(this), 300);
                            }
                        },
                        resetFilter: function () {
                            this.set({
                                'value.val': [],
                                'name.value' : '',
                                'isOpen': false
                            });
                        },
                        teardown: function (evt) {
                            FilterThis = null;
                        }
                    });
                },

                changeName: function (data) {
                    var that = this;
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


