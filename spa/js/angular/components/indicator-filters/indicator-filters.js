innaAppConponents.
    factory('IndicatorFilters', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',
        'FilterSettings',

        // components
        'IndicatorFiltersItem',
        function (EventManager, Events, $templateCache, FilterSettings, IndicatorFiltersItem) {

            /**
             * Выводим выбранные значения фильтров
             */
            var IndicatorFilters = Ractive.extend({
                template: $templateCache.get('components/indicator-filters/templ/indicator-filters.hbs.html'),
                data: {
                    filters: [],
                    isArray: angular.isArray,
                    atLeastOne: false
                },
                components: {
                    IndicatorFiltersItem: IndicatorFiltersItem
                },
                init: function (options) {
                    var that = this;

                    this.on({
                        action: this.action,
                        resetAllFilters: function (data) {
                            EventManager.fire(Events.FILTER_PANEL_RESET_ALL);
                        },
                        teardown: function (evt) {
                            EventManager.off(Events.FILTER_PANEL_CHANGE, this.changeFilters);
                            EventManager.off(Events.FILTER_PANEL_RESET, this.resetFilters);
                        }
                    })


                    EventManager.on(Events.FILTER_PANEL_CHANGE, this.changeFilters.bind(this));
                    /** событие сброса фильтров */
                    EventManager.on(Events.FILTER_PANEL_RESET, this.resetFilters.bind(this));
                },

                changeFilters: function (data) {
                    this.set('filters', data);
                },

                resetFilters : function(){
                    this.set('filters', {});
                }
            });

            return IndicatorFilters;
        }
    ]);

