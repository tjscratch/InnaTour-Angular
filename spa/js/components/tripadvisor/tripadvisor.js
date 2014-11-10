angular.module('innaApp.components').
    factory('Tripadvisor', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            var Tripadvisor = Ractive.extend({
                template: $templateCache.get('components/tripadvisor/templ/index.hbs.html'),
                append: true,
                data: {
                    withOutTd : false,
                    TaFactorArr : []
                },
                onrender: function () {
                    var that = this;

                    this.on({
                        change : function(data){

                        },
                        teardown: function (evt) {

                        }
                    })

                    this.observe('TaFactor', function(newValue, oldValue, keypath) {
                        if (newValue) {
                            this.set({ TaFactorArr: this.parse(this.get('TaFactor'))})
                        }
                    });
                },

                /**
                 * Создаем массив для шаблона
                 * @param end
                 * @returns {Array}
                 */
                parse: function (end) {
                    var list = [];
                    var isFloat = $filter('isFloat')(end);

                    for (var i = 0; i < 5; ++i) {
                        list.push({
                            value: null,
                            active: false,
                            isFloat: false
                        })
                    }

                    list.every(function (item, index) {
                        //console.log((index + 1) <= end, (index + 1) , end, isFloat );
                        if ((index + 1) <= end) {
                            item.active = true;
                            item.value = end;
                        } else {
                            if(isFloat){
                                item.isFloat = true;
                            }
                            return false;
                        }
                        return true;
                    })

                    return list;
                }

            });

            return Tripadvisor;
        }]);

