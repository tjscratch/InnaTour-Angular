/**
 * Панель фильтрации для отелей и билетов
 *
 * При выборе любого свойства на панели,
 * фильтруем, сортируем и диспачим событие с этим набором
 *
 * EventManager.fire('FilterPanel:change', filtersCollection)
 * Логику фильтрации реализует сама панель и сервис FilterService
 */

angular.module('innaApp.components').
    factory('FilterPanel', [
        'EventManager',
        '$filter',
        '$templateCache',
        '$routeParams',
        'innaApp.API.events',
        '$timeout',
        'FilterService',
        'FilterSettings',

        'IndicatorFilters',
        'FilterSort',
        function (EventManager, $filter, $templateCache, $routeParams, Events, $timeout, FilterService, FilterSettings, IndicatorFilters, FilterSort) {


          /**
           * Компонент FilterPanel
           * @class
           */
            var FilterPanel = Ractive.extend({
                template: $templateCache.get('components/filter-panel/templ/panel.hbs.html'),
                append: true,
                data: {
                    type: '',
                    isVisible: true,
                    asMap: false,
                    filtersCollection: [],
                    filter_hotel: true,
                    filter_avia: false,
                    Collection: [],
                    resultFilters: [],
                    resultSort: [],

                    // данные для компонентов фильтров
                    filtersModel: null
                },

                components: {
                    'IndicatorFilters': IndicatorFilters,
                    'FilterSort': FilterSort
                },

                // части шаблонов которые содержат компоненты фильтров
                partials: {
                    HotelsFilter: $templateCache.get('components/filter-panel/templ/panel.hotel.filters.hbs.html'),
                    TicketFilter: $templateCache.get('components/filter-panel/templ/panel.avia.hbs.html'),
                    ruble: $templateCache.get('components/ruble.html')
                },
                init: function () {
                    var that = this;
                    this.sortingValue = null;

                    utils.bindAll(this);

                    document.addEventListener('click', this.bodyClickHide, false);


                    this.listenChildren();

                    this.on({
                        goToHotelList: function () {
                            EventManager.fire(Events.DYNAMIC_SERP_BACK_TO_MAP);
                        },
                        '*.onCheckedFilter': function (data) {
                            if (data != undefined) {
                                this.collectChildData();
                            }
                        },
                        sortChild: function (data) {
                            if (data) this.sortingValue = angular.copy(data);
                            setTimeout(function () {
                                that.doSort(true);
                            }, 0);
                        },
                        hide: function (evt) {
                            this.set('isVisible', false);
                        },
                        teardown: function (evt) {
                            document.removeEventListener('click', this.bodyClickHide, false);
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


                    setTimeout(function () {
                        that.findComponent('FilterSort').sortDefault();
                    }, 500);


                    /**
                     * Слушаем изменение filtersData
                     * Обновление настроек фильтров
                     */
                    this.observe('filtersData', function (value, oldValue) {
                        if (value) {
                            this.show();
                            FilterSettings.set({
                                'settings.Hotels': value.Hotels,
                                'settings.Tickets': value.Tickets
                            });
                            this.set('filtersModel', FilterSettings.get('settings'));
                        }
                    })


                    /* фильтрация */
                    this.observe('filtersCollection', function (value) {
                        if (!value || !value.length) {
                            setTimeout(function () {
                                that.resetFilter();
                            }, 0);
                        }
                        else if (value && value.length) {
                            setTimeout(function () {
                                that.doFilter();
                            }, 0);
                        }
                    }, {init: false});


                    // если это обновление фильтров
                    this.observe('updateModel', function (value) {
                        setTimeout(function () {
                            if (that.get('isFiltered')) {
                                that.collectChildData(true);
                            } else {
                                that.doSort(true);
                            }
                        }, 500);
                    }, {init: false});
                },

                show: function () {
                    this.set('isVisible', true);
                },

                /**
                 * resultFilters - отфильтрованный набор
                 */
                doFilter: function () {

                    // фильтруем коллекцию
                    var resultFilters = FilterService.filterListPanel({
                        collection: this.get('Collection'),
                        filterCollection: this.get('filtersCollection')
                    });

                    this.set({
                        'isFiltered': true,
                        'resultFilters': resultFilters
                    });
                    var resultSort = this.doSort();

                    // события для наблюдателей
                    EventManager.fire(Events.LIST_PANEL_FILTES_HOTELS_DONE, resultSort);
                    EventManager.fire(Events.FILTER_PANEL_CHANGE, resultSort);
                    this.fire(Events.FILTER_PANEL_CHANGE, this.get('filtersCollection'));
                },

                /**
                 * resultSort - отсортированный и отфильрованный набор
                 * @param {Boolean} opt_param
                 * @returns {*}
                 */
                doSort: function (opt_param) {
                    var sortCollection = this.get('Collection');

                    // если коллекция уже фильтровалась
                    // то сортируем ее
                    if (this.get('isFiltered')) {
                        sortCollection = this.get('resultFilters');
                    }

                    if (!this.sortingValue) {
                        return sortCollection;
                    }

                    var resultSort = FilterService.sortListPanel(sortCollection, this.sortingValue);
                    resultSort = resultSort || [];

                    this.set('resultSort', resultSort);

                    if (opt_param)
                        EventManager.fire(Events.FILTER_PANEL_CHANGE, resultSort);

                    return resultSort;
                },

                /**
                 *
                 * @returns {*}
                 */
                resetFilter: function () {
                    // втихую сбрасываем все фильтры
                    this.findAllComponents().forEach(function (item) {
                        item.fire('resetFilter', {silent: true});
                    });

                    this.set({
                        'isFiltered': false,
                        'resultFilters': []
                    });

                    // сортируем коллекцию
                    var resultSort = this.doSort();

                    // событие для наблюдателей
                    EventManager.fire(Events.FILTER_PANEL_CHANGE, resultSort);
                    EventManager.fire(Events.LIST_PANEL_FILTES_RESET_DONE, resultSort);
                    this.fire(Events.FILTER_PANEL_RESET);
                },

                /**
                 * Слушаем событие изменения дочерних компонентов
                 * FilterPanel выступает EventManager-ром для своих детей
                 *
                 * child._parent - каждый child слушает своего родителя
                 *
                 * if(childComponent._guid != child._guid) Если событие от другого компонента
                 * то прячем попап
                 */
                listenChildren: function () {
                    var that = this;
                    var childComponents = this.findAllComponents();

                    childComponents.forEach(function (child) {

                        // открытие закрытие отдельного фильтра
                        child.observe('isOpen', function (newValue, oldValue) {
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
                 * обновляем массив filtersCollection
                 */
                collectChildData: function () {
                    var tempArr = [];

                    this.findAllComponents().forEach(function (child) {
                        if (child.get('value') && child.get('value.val') && child.get('value.val').length) {
                            tempArr.push(angular.copy(child.get('value')));
                        }
                    });
                    console.info([].concat(tempArr));

                    this.set('filtersCollection', [].concat(tempArr));
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
                    //this.set('styleWidth', document.documentElement.scrollWidth);
                }
            });

            return FilterPanel;
        }]);
