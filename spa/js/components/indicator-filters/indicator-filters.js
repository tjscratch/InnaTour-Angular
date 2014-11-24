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
                onrender: function (options) {
                    var that = this;
                    utils.bindAll(this);

                    this.on({
                        action: this.action,
                        removeFilter : function(dataEvents, filterItem){
                            this._parent.fire('IndicatorFiltersItem:remove', dataEvents, filterItem);
                        },
                        resetAllFilters: function (data) {
                            this.set('filtersCollection', []);
                        },
                        teardown: function (evt) {
                            EventManager.off(Events.DYNAMIC_SERP_MAP_LOAD, this.mapLoad);
                            EventManager.off(Events.DYNAMIC_SERP_MAP_DESTROY, this.mapLoad);
                            this.set('filters', []);
                        }
                    });

                    EventManager.on(Events.DYNAMIC_SERP_MAP_LOAD, this.mapLoad);
                    EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, this.mapLoad);




                    this.observe('filtersCollection', function(value){
                        this.set('filters', value);
                    }, {init : false});
                    
                },

                mapLoad : function(){
                    this.toggle('asMap');
                }
            });

            return IndicatorFilters;
        }
    ]);

