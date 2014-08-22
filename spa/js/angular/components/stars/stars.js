angular.module('innaApp.components').
        factory('Stars', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var Stars = Ractive.extend({
                template: $templateCache.get('components/stars/templ/index.hbs.html'),
                append: true,
                data: {
                    withOutTd: false,
                    starsArr : []
                },
                init: function () {
                    this.observe('stars', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.set({ starsArr: this.parse(this.get('stars'))})
                        }
                    });
                },

                /**
                 * Создаем массив для шаблона
                 * @param {Number} st
                 * @returns {Array}
                 */
                parse: function (st) {
                    var list = [];


                    for (var i = 0; i < parseInt(st,10); i++) {
                        list.push(i+1)
                    }
                    //console.log(st, list);
                    return list;

                }

            });

            return Stars;
        }]);

