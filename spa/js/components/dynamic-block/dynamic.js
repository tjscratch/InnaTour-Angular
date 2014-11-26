/**
 * Компонент DynamicBlock
 * Настраиваемый визуальный блок для вывода карточки отеля и авиа билета
 * принемает параметры
 * влияют на его визуальное отображение
 *
 * @param {Object} settings ->
 *
 * @param {Number} height
 * @param {Number} countColumn
 * @param {String} classBlock
 * @param {String} classColl3
 *
 * Метод setClass - устанавливает класс на основной div блока
 *
 * от этого компонента наследуются Hotels Ticket и Bundle
 *
 * Имеет дочерние компоненты поумолчанию
 *
 * components: {
 *     Stars: Stars,
 *     Tripadvisor: Tripadvisor,
 *     PriceGeneric: PriceGeneric
 * }
 *
 * Так же можно передать шаблоны колонок блока
 * collOneContent
 * collTwoContent
 * collThreeContent
 *
 * И задать любые partials
 */


innaAppConponents.
    factory('DynamicBlock', [
        'innaApp.API.events',
        '$templateCache',
        '$filter',

        // components
        'Stars',
        'Tripadvisor',
        'PriceGeneric',
        'DatePartialsCollection',
        function (Events, $templateCache, $filter, Stars, Tripadvisor, PriceGeneric, DatePartialsCollection) {

            /**
             * Компонент DynamicBlock
             * @class
             */
            var DynamicBlock = Ractive.extend({
                append: true,
                template: $templateCache.get('components/dynamic-block/templ/base.hbs.html'),
                data: {
                    settings: {
                        height: 220,
                        countColumn: 3,
                        classBlock: '',
                        classColl3: ''
                    },
                    setClass: function () {
                        if (this.get('settings.classBlock')) {
                            return this.get('settings.classBlock');
                        } else {
                            return (this.get('settings.countColumn') == 3) ? 'b-result_col_three' : 'b-result_col_two';
                        }
                    },
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    }
                },
                partials: {
                    collOneContent: '<div></div>',
                    collTwoContent: $templateCache.get('components/dynamic-block/templ/hotel-dp.hbs.html'),
                    collThreeContent: $templateCache.get('components/dynamic-block/templ/combination-price.hbs.html'),

                    ruble: $templateCache.get('components/ruble.html')
                },
                components: {
                    Stars: Stars,
                    Tripadvisor: Tripadvisor,
                    PriceGeneric: PriceGeneric,
                    DatePartialsCollection : DatePartialsCollection
                },

                onrender: function (options) {
                    this._super(options);

                    this.on({
                        teardown: function (evt) {
                            this.reset();
                        }
                    })
                }
            });

            return DynamicBlock;
        }
    ])
    .directive('dynamicBlockDirective', [
        'EventManager',
        '$templateCache',
        '$filter',
        'aviaHelper',
        'DynamicBlock',
        function (EventManager, $templateCache, $filter, aviaHelper, DynamicBlock) {
            return {
                replace: true,
                template: '',
                scope: {
                    settings: "=",
                    recommendedPair: "=",
                    tripadvisor : "="
                },
                link: function ($scope, $element, $attr) {

                    var _newDynamicBlock = new DynamicBlock({
                        el: $element[0],
                        data: {
                            settings: $scope.settings,
                            tripadvisor : $scope.tripadvisor
                        },
                        partials: {
                            collOneContent: $templateCache.get('components/dynamic-block/templ/ticket2ways.hbs.html'),
                            collTwoContent: $templateCache.get('components/dynamic-block/templ/hotel-info-bed-type.hbs.html')
                        }
                    });

                    $scope.$watch('recommendedPair', function (value) {
                        if(value) {
                            _newDynamicBlock.set({
                                'AviaInfo' : value.ticket.data,
                                'hotel' : value.hotel.data,
                                'recommendedPair' : value
                            });
                        }
                    }, true);


                    $scope.$on('$destroy', function () {
                        if(_newDynamicBlock) {
                            _newDynamicBlock.teardown();
                            _newDynamicBlock = null;
                        }
                    })
                }
            }
        }])
