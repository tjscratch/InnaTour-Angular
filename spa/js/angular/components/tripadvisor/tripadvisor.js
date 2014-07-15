angular.module('innaApp.conponents').
    factory('Tripadvisor', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var EventManager = new Ractive();

            var Tripadvisor = Ractive.extend({
                append: true,
                data: {
                    isVisible: false
                },
                init: function () {
                    var that = this;

                },

                test: function (end) {
                    console.log(end);
                    var list = [];
                    var start = 0;

                    for (var i = 0; i < 5; i++) {
                        list.push({
                            index: i,
                            value: null,
                            active: false,
                            isFloat: false
                        })
                    }


                    if (start < end) {
                        while (start < end) {
                            list.forEach(function (item) {
                                if (item.index == start) {
                                    item.active = true;
                                    item.value = end;
                                }
                            })
                            start++;
                        }
                    }
                    return list;
                }

            });

            return Tripadvisor;
        }]);

