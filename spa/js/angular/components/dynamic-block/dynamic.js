/**
 * Компонент DynamicBlock
 * Настраиваемый визуальный блок для вывода карточки отеля и авиа билета
 * принемает параметры
 *
 * @param {Object} settings ->
 *
 * @param {Number} height
 * @param {Number} countColumn
 * @param {String} classBlock
 * @param {String} classColl3
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
        function (Events, $templateCache, $filter, Stars, Tripadvisor, PriceGeneric) {

            /**
             * Компонент DynamicBlock
             * @constructor
             */
            var DynamicBlock = Ractive.extend({
                debug: true,
                template: $templateCache.get('components/dynamic-block/templ/base.hbs.html'),
                data: {

                    // настройки блока
                    // влияют на его визуальное отображение
                    settings: {
                        height: 220,
                        countColumn: 3,
                        classBlock : '',
                        classColl3 : ''
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
                    PriceGeneric: PriceGeneric
                },

                init: function (options) {
                    this._super(options);
                },

                getHotelDetails: function (evt) {

                }
            });

            return DynamicBlock;
        }
    ]);