innaAppConponents.
    factory('IndicatorFilters', [
        'EventManager',
        'innaAppApiEvents',
        '$templateCache',
        'FilterSettings',

        // components
        'IndicatorFiltersItem',
        'DpServices',
        '$location',
        function (EventManager, Events, $templateCache, FilterSettings, IndicatorFiltersItem, DpServices, $location) {

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
                    atLeastOne: false,
                    isActiveHotels: false
                },
                components: {
                    IndicatorFiltersItem: IndicatorFiltersItem,
                    DpServices: DpServices
                },
                onrender: function (options) {
                    var that = this;

                    utils.bindAll(this);

                    var loc = $location.path();

                    if (loc.indexOf('/hotels/') > -1) {
                        this.set('isActiveHotels', true);
                    } else {
                        this.set('isActiveHotels', false);
                    }
                    
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
                        },
                    });

                    EventManager.on(Events.DYNAMIC_SERP_MAP_LOAD, this.mapShow);
                    EventManager.on(Events.DYNAMIC_SERP_MAP_DESTROY, this.mapHide);

                    this.observe('filtersCollection', function(value){
                        this.set('filters', value);
                    }, {init : false});
                    
                },

                mapShow : function(){
                    this.set('asMap', true);
                },
                mapHide : function(){
                    this.set('asMap', false);
                }
            });

            return IndicatorFilters;
        }
    ]);

