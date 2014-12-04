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
                    starsArr: []
                },
                onrender: function () {
                    this.observe('stars', function (newValue, oldValue, keypath) {
                        if (newValue) {
                            this.set({starsArr: this.parse(this.get('stars'))})
                        } else {
                            this.set({starsArr: []})
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


                    for (var i = 0; i < parseInt(st, 10); i++) {
                        list.push(i + 1)
                    }
                    //console.log(st, list);
                    return list;

                }

            });

            return Stars;
        }])
    .directive('starsDirective', [
        '$timeout',
        'EventManager',
        '$filter',
        'Stars',
        function ($timeout, EventManager, $filter, Stars) {
            return {
                replace: true,
                template: '',
                scope: {
                    hotelData: '='
                },
                link: function ($scope, $element, $attr) {

                    /* Stars */
                    var _stars = new Stars({el: $element[0]});

                    $scope.$watch('hotelData', function (value) {
                        _stars.set('stars', value);
                    })

                    $scope.$on('$destroy', function () {
                        _stars.teardown();
                        _stars = null;
                    })
                }
            }
        }])
