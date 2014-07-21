angular.module('innaApp.conponents').
    factory('Stars', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var Stars = Ractive.extend({
                template: $templateCache.get('components/stars/templ/index.hbs.html'),
                append: true,
                data: {
                    withOutTd: false
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
                 * @param end
                 * @returns {Array}
                 */
                parse: function (st) {
                    var list = [];

                    for (var i = 0; i < st; i++) {
                        list.push(i)
                    }
                    return list;
                }

            });

            return Stars;
        }]);

