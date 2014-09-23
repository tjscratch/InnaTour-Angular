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
        '$timeout',

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
        function (EventManager, $filter, $templateCache, $routeParams, Events, $timeout, IndicatorFilters, FilterSettings, FilterTime, FilterAirline, FilterAirPort, FilterAviaLegs, FilterExtra, FilterPrice, FilterName, FilterStars, FilterTaFactor, FilterType, FilterSort) {


            /**
             * Компонент FilterPanel
             * @constructor
             */
            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ/panel.hbs.html'),
                append: true,
                data: {
                    isVisible: true,
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
                    this.observeSortValueVal = null;
                    this.observeIsOpen = null;

                    document.addEventListener('click', this.bodyClickHide.bind(this), false);


                    this.listenChildren();

                    this.on({
                        goToHotelList: function () {
                            EventManager.fire(Events.DYNAMIC_SERP_BACK_TO_MAP);
                        },
                        change: function (data) {
                        },
                        changeChildFilter: function (data) {
                            if (data != undefined) {
                                this.collectChildData();
                            }
                        },
                        sortChild: function (data) {
                            if (data != undefined) {
                                this.set('sortingValue', data);
                                EventManager.fire(Events.FILTER_PANEL_SORT, data);
                            }
                        },
                        hide: function (evt) {
                            this.set('isVisible', false);
                        },
                        teardown: function (evt) {
                            this.observeSortValueVal.cancel();
                            this.observeIsOpen.cancel();

                            document.removeEventListener('click', this.bodyClickHide.bind(this), false);
                            EventManager.off(Events.FILTER_PANEL_CLOSE_FILTERS);
                            EventManager.off('sort:default');

                            this.findAllComponents().forEach(function (child) {
                                child.fire('resetFilter', {silent: true});
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

                    /**
                     * Событие сброса фильтра
                     * Получаем его от компонента IndicatorFilters
                     */
                    this.on('IndicatorFiltersItem:remove', function (dataContext, componentName) {
                        that.findAllComponents().forEach(function (component) {
                            if (component.get('value.name') == componentName) {
                                component.fire('filtersItemRemove', dataContext, componentName);
                            }
                        })
                    });




                    setTimeout(function(){
                        that.findComponent('FilterSort').sortDefault();
                    }, 1000);


                    /**
                     * Слушаем изменение filtersData
                     * Обновление настроек фильтров
                     */
                    this.observe('filtersData', function (value) {
                        if (value) {
                            this.show();
                            FilterSettings.set({
                                'settings.Hotels': value.Hotels,
                                'settings.Tickets': value.Tickets
                            });
                            this.set('filtersModel', FilterSettings.get('settings'));
                        }
                    })

                    this.observe('filtersCollection', function (value) {
                        if (!value || !value.length) {
                            this.findAllComponents().forEach(function (item) {
                                item.fire('resetFilter', {silent: true});
                            });
                            EventManager.fire(Events.FILTER_PANEL_RESET);
                            this.fire(Events.FILTER_PANEL_RESET);
                        }
                    }, {init: false})


                    // если это обновление фильтров
                    this.observe('updateModel', function (value) {
                        EventManager.fire(Events.FILTER_PANEL_SORT, that.get('sortingValue'));
                        $timeout(function(){
                            that.collectChildData(true);
                        }, 500);
                    }, {init: false});
                },

                show: function () {
                    this.set('isVisible', true);
                },

                fireSort: function () {
                    this.show();
                    this.collectChildData();
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
                 */
                listenChildren: function () {
                    var that = this;
                    var childComponents = this.findAllComponents();

                    childComponents.forEach(function (child) {

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
                 *
                 * @param {Boolean} opt_param - при сохранении фильтров не нужно делать reset
                 */
                collectChildData: function (opt_param) {
                    var that = this;
                    var tempArr = [];

                    this.findAllComponents().forEach(function (child) {
                        if (child.get('value') && child.get('value.val') && child.get('value.val').length) {
                            tempArr.push(child.get('value'));
                        }
                    })

                    this.merge('filtersCollection', tempArr);


                    if (this.get('filtersCollection').length) {
                        EventManager.fire(Events.FILTER_PANEL_CHANGE, this.get('filtersCollection'));
                        this.fire(Events.FILTER_PANEL_CHANGE, this.get('filtersCollection'));
                    } else {
                        if(!opt_param) {
                            EventManager.fire(Events.FILTER_PANEL_RESET);
                            this.fire(Events.FILTER_PANEL_RESET);
                        }
                    }
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
                    this.set('styleWidth', document.documentElement.scrollWidth);
                }
            });

            return FilterPanel;
        }]);
