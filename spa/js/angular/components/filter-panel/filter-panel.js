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

angular.module('innaApp.components').
    factory('FilterPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',

        'IndicatorFilters',

        'FilterSettings',

        'FilterTime',
        'FilterAirline',
        'FilterAirPort',
        'FilterAviaLegs',

        'FilterExtra',
        'FilterPrice',
        'FilterName',
        'FilterStars',
        'FilterTaFactor',
        'FilterType',
        'FilterSort',
        function (EventManager, $filter, $templateCache, $routeParams, Events, IndicatorFilters, FilterSettings, FilterTime, FilterAirline, FilterAirPort, FilterAviaLegs, FilterExtra, FilterPrice, FilterName, FilterStars, FilterTaFactor, FilterType, FilterSort) {


            /**
             * Компонент FilterPanel
             * @constructor
             */
            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ/panel.hbs.html'),
                append: true,
                data: {
                    asMap: false,
                    filtersCollection: [],
                    filter_hotel: true,
                    filter_avia: false,

                    // данные для компонентов фильтров
                    filtersModel: null
                },

                // части шаблонов которые содержат компоненты фильтров
                partials: {
                    HotelsFilter: $templateCache.get('components/filter-panel/templ/panel.hotel.filters.hbs.html'),
                    TicketFilter: $templateCache.get('components/filter-panel/templ/panel.avia.hbs.html'),
                    MapFilter: '<div>MapFilter</div>',

                    ruble: $templateCache.get('components/ruble.html')
                },
                components: {
                    IndicatorFilters: IndicatorFilters,

                    'FilterTime': FilterTime,
                    'FilterAirline': FilterAirline,
                    'FilterAirPort': FilterAirPort,
                    'FilterAviaLegs': FilterAviaLegs,

                    'FilterExtra': FilterExtra,
                    'FilterPrice': FilterPrice,
                    'FilterName': FilterName,
                    'FilterStars': FilterStars,
                    'FilterTaFactor': FilterTaFactor,
                    'FilterType': FilterType,
                    'FilterSort': FilterSort
                },
                init: function () {
                    var that = this;
                    this.observeChildValue = null;
                    this.observeFiltersData = null;
                    this.observeSortValueVal = null;
                    this.observeIsOpen = null;

                    this.setModel();

                    document.addEventListener('click', this.bodyClickHide.bind(this), false);


                    this.listenChildren();

                    this.on({
                        goToHotelList: function () {
                            EventManager.fire(Events.DYNAMIC_SERP_BACK_TO_MAP);
                        },
                        change: function (data) {
                        },
                        teardown: function (evt) {
                            this.observeChildValue.cancel();
                            this.observeFiltersData.cancel();
                            this.observeSortValueVal.cancel();
                            this.observeIsOpen.cancel();

                            document.removeEventListener('click', this.bodyClickHide.bind(this), false);
                            EventManager.off(Events.FILTER_PANEL_RESET_ALL);
                            EventManager.off(Events.FILTER_PANEL_CLOSE_FILTERS);
                            EventManager.off('IndicatorFiltersItem:remove');
                            EventManager.off('sort:default');

                            this.findAllComponents().forEach(function (child) {
                                child.fire('resetFilter');
                            })
                        }
                    });


                    EventManager.on(Events.DYNAMIC_SERP_MAP_LOAD, function () {
                        that.set('asMap', true);
                    });
                    EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, function () {
                        that.set('asMap', false);
                    });

                    /** если нужно закрыть все открытые фильтры */
                    EventManager.on(Events.FILTER_PANEL_CLOSE_FILTERS, function () {
                        var childComponents = that.findAllComponents();

                        childComponents.forEach(function (child) {
                            child.set({isOpen: false});
                        })
                    });

                    EventManager.on(Events.FILTER_PANEL_RESET_ALL, function () {
                        EventManager.fire(Events.FILTER_PANEL_RESET);

                        that.findAllComponents().forEach(function (item) {
                            item.fire('resetFilter', { silent : true });
                        });
                    });


                    /**
                     * Событие сброса фильтра
                     * Получаем его от компонента IndicatorFilters
                     */
                    EventManager.on('IndicatorFiltersItem:remove', function (dataContext, componentName) {
                        that.findAllComponents().forEach(function (component) {
                            if (component.get('value.name') == componentName) {
                                component.fire('filtersItemRemove', dataContext, componentName);
                            }
                        })
                    });


                    EventManager.on('sort:default', function () {
                        that.findComponent('FilterSort').sortDefault();
                    });

                    /**
                     * Слушаем изменение filtersData
                     * Обновление настроек фильтров
                     */
                    this.observeFiltersData = this.observe('filtersData', function (value) {
                        if (value) {
                            this.setModel();
                        }
                    }, {init: false})

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

                        // изменение фильтров
                        that.observeChildValue = child.observe('value', function (newValue, oldValue, test) {

                            if (newValue && (newValue.val != undefined) && !newValue.silent) {
                                that.collectChildData();
                            } else if(newValue && (newValue.val != undefined) && newValue.silent){
                                child.data.value.silent = false;
                            }

                        }, {defer: true, init: false});


                        // сортировка
                        that.observeSortValueVal = child.observe('sortValue.val', function (newValue, oldValue) {
                            if (newValue) {
                                // передаем компонент сортировки - далее из него возьмем функцию сортировки
                                EventManager.fire(Events.FILTER_PANEL_SORT, child);
                            }
                        }, {defer: true, init: false});


                        // открытие закрытие отдельного фильтра
                        that.observeIsOpen = child.observe('isOpen', function (newValue, oldValue) {
                            if (newValue) {
                                that.fire('hide:child', child);
                            }
                        });


                        that.on('hide:child', function (childComponent) {
                            if (childComponent._guid != child._guid) {
                                child.fire('hide');
                            }
                        })
                    })
                },

                /**
                 * Проходим по всем дочерним компонентам и
                 * собираем данные для фильтрации
                 * также собираем объекты компонентов которые изменились
                 * обновляем массив filtersCollection
                 */
                collectChildData: function () {
                    var that = this;
                    var tempArr = [];

                    this.findAllComponents().forEach(function (child) {
                        if (child.get('value') && child.get('value.val') && child.get('value.val').length) {
                            tempArr.push(child.get('value'));
                        }
                    })

                    this.merge('filtersCollection', tempArr);

                    if (tempArr.length) {
                        EventManager.fire(Events.FILTER_PANEL_CHANGE, tempArr);
                    } else {
                        EventManager.fire(Events.FILTER_PANEL_RESET);
                    }
                },

                /**
                 * Создаем новую модель фильтров
                 * @param dataFilters
                 */
                setModel: function (opt_data) {
                    if (opt_data || this.get('filtersData')) {
                        var modelFilters = new FilterSettings({
                            data: {
                                model: opt_data || this.get('filtersData')
                            }
                        });

                        this.set('filtersModel', modelFilters.get('settings'));
                    }
                },

                /**
                 * Переключение фильтров
                 * пока не работает
                 * @param dataFilters
                 */
                toggleFilters: function (dataFilters) {
                    this.setModel(dataFilters);

                    this.findAllComponents().forEach(function (child) {
                        child.fire('resetFilter');
                    });

                    this.toggle('filter_hotel');
                    this.toggle('filter_avia');
                    this.listenChildren();
                },


                /**
                 * @param {Object} data - данные на основе которых собираются фильтры
                 */
                prepareHotelsFiltersData: function (data) {

                },

                /**
                 * @param {Object} data - данные на основе которых собираются фильтры
                 */
                prepareAviaFiltersData: function (data) {

                },


                bodyClickHide: function (evt) {
                    evt.stopPropagation();
                    var $this = evt.target;

                    if (!this.find('.' + $this.classList[0]) && !this.closest($this, '.filter')) {
                        this.findAllComponents().forEach(function (child) {
                            child.fire('hide');
                        })
                    }
                },

                closest: function (elem, selector) {

                    while (elem) {
                        if (elem.matches && elem.matches(selector)) {
                            return true;
                        } else {
                            elem = elem.parentNode;
                        }
                    }
                    return false;
                },

                complete: function (data) {
                    //console.log('complete');
                }
            });

            return FilterPanel;
        }]);
