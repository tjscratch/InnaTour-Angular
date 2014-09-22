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
                    filtersCollection : [],
                    asMap : false,
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
                        removeFilter : function(dataEvents, filterItem){
                            this._parent.fire('IndicatorFiltersItem:remove', dataEvents, filterItem);
                        },
                        resetAllFilters: function (data) {
                            this.set('filtersCollection', []);
                        },
                        teardown: function (evt) {
                            //console.log('teardown IndicatorFilters');
                            EventManager.off(Events.DYNAMIC_SERP_MAP_LOAD, this.mapLoad);
                            EventManager.off(Events.DYNAMIC_SERP_MAP_DESTROY, this.mapLoad);
                            this.set('filters', []);
                        }
                    });

                    EventManager.on(Events.DYNAMIC_SERP_MAP_LOAD, this.mapLoad.bind(this));
                    EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, this.mapLoad.bind(this));


                    this.observe('filtersCollection', function(value){
                        this.set('filters', value);
                    })
                },

                mapLoad : function(){
                    this.toggle('asMap');
                }
            });

            return IndicatorFilters;
        }
    ]);

