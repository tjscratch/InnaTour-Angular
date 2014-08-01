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
        function (Events, $templateCache, $filter, Stars, Tripadvisor, PriceGeneric) {

            /**
             * Компонент DynamicBlock
             * @constructor
             */
            var DynamicBlock = Ractive.extend({
                append: true,
                template: $templateCache.get('components/dynamic-block/templ/base.hbs.html'),
                data: {
                    settings: {
                        height: 220,
                        countColumn: 3,
                        classBlock : '',
                        classColl3 : ''
                    },
                    setClass : function(){
                        if(this.get('settings.classBlock')){
                            return this.get('settings.classBlock');
                        } else {
                            return (this.get('settings.countColumn') == 3)?'b-result_col_three':'b-result_col_two';
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
                    PriceGeneric: PriceGeneric
                },

                init: function (options) {
                    this._super(options);

                    this.on({
                        teardown: function (evt) {
                            this.reset();
                        }
                    })
                },

                getHotelDetails: function (evt) {

                },

                beforeInit: function (options) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    console.log('complete');
                }
            });

            return DynamicBlock;
        }
    ]);