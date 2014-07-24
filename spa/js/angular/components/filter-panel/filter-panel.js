/**
 * Панель фильтрации для отелей и билетов
 * Вообще сама панель не чего не фильтрует
 *
 * Просто передает массив данных по которым нужно будет фильтровать
 *
 * При выборе любого свойства на панели, собираем новый набор и диспачим событие с этим набором
 *
 * EventManager.fire('FilterPanel:change', filtersCollection)
 * Логику фильтрации реализуют все компоненты подписчики
 */


angular.module('innaApp.conponents').
    factory('FilterPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'FilterSettings',
        'FilterExtra',
        'FilterPrice',
        'FilterName',
        'FilterCategory',
        'FilterSlider',
        'FilterStars',
        'FilterTaFactor',
        'FilterType',
        'FilterSort',
        function (EventManager, $filter, $templateCache, $routeParams, Events, FilterSettings, FilterExtra, FilterPrice, FilterName, FilterCategory, FilterSlider, FilterStars, FilterTaFactor, FilterType, FilterSort) {


            /**
             * Компонент FilterPanel
             * @constructor
             */
            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ/panel.hbs.html'),
                append: true,
                data: {
                    asMap: false,
                    filtersCollection : [],
                    filter_hotel: true,
                    filter_avia: false,

                    // данные для компонентов фильтров
                    filtersData: FilterSettings
                },

                // части шаблонов которые содержат компоненты фильтров
                partials: {
                    HotelsFilter: $templateCache.get('components/filter-panel/templ/panel.hotel.filters.hbs.html'),
                    TicketFilter: '<div>TicketFilter</div>',
                    MapFilter: '<div>MapFilter</div>',

                    ruble: $templateCache.get('components/ruble.html')
                },
                components: {
                    'FilterExtra': FilterExtra,
                    'FilterPrice': FilterPrice,
                    'FilterName': FilterName,
                    'FilterCategory': FilterCategory,
                    'FilterSlider': FilterSlider,
                    'FilterStars': FilterStars,
                    'FilterTaFactor': FilterTaFactor,
                    'FilterType': FilterType,
                    'FilterSort' : FilterSort
                },
                init: function () {
                    var that = this;

                    this.listenChildren();

                    this.on({
                        change: function (data) {

                        },
                        teardown: function (evt) {

                        }
                    })
                },

                /**
                 * Слушаем событие изменения дочерних компонентов
                 * FilterPanel выступает EventManager-ром для своих детей
                 *
                 * child._parent - каждый child слушает своего родителя
                 *
                 * if(childComponent._guid != child._guid) Если событие от другого компонента
                 * то прячем попап
                 *
                 *
                 *  Слушаем изменения свойства value
                 *  В нем содержится название свойства и собственно его значение
                 */
                listenChildren: function () {
                    var that = this;
                    var childComponents = this.findAllComponents();

                    childComponents.forEach(function (child) {


                        child.observe('value.val', function (newValue, oldValue) {
                            if (newValue) {
                                // собираем данные с панели фильтров
                                that.collectChildData();
                            }
                        });

                        child.observe('isOpen', function (newValue, oldValue) {
                            if (newValue) {
                                that.fire('hide:child', child);
                            }
                        });

                        child._parent.on('hide:child', function (childComponent) {
                            if (childComponent._guid != child._guid) {
                                child.fire('hide');
                            }
                        })
                    })
                },

                /**
                 * Проходим по всем дочерним компонентам и
                 * собираем данные для фильтрации
                 * обновляем массив filtersCollection
                 */
                collectChildData : function(){
                    var that = this;
                    var tempArr = [];

                    this.findAllComponents().forEach(function(child){
                        if(child.get('value') && child.get('value.val').length) tempArr.push(child.get('value'));
                    })
                    this.merge('filtersCollection', tempArr);


                    // маленькая защита от ложного срабатывания события
                    console.log(this.get('filtersCollection').length, 'countFilters');


                    if(this.get('filtersCollection').length) {
                        this.set('alreadyFiltered', true);
                        EventManager.fire('filter-panel:change', this.get('filtersCollection'));
                    } else {
                        if(this.get('alreadyFiltered')){
                            EventManager.fire('filter-panel:reset');
                        }
                    }
                },


                parse: function (end) {

                },


                doFilter: function () {

                },

                beforeInit: function (data) {
                    //console.log('beforeInit');
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return FilterPanel;
        }]);


