innaAppConponents.
    factory('IndicatorFilters', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',
        function (EventManager, Events, $templateCache) {

            var IndicatorFilters = Ractive.extend({
                template: $templateCache.get('components/indicator-filters/templ/indicator-filters.hbs.html'),
                data : {
                    filters : [],
                    mod_wrapper : false,
                    atLeastOne : false
                },
                init: function (options) {
                    this.on({
                        action : this.action
                    })


                    this.observe('isVisible',
                        function (newValue, oldValue) {
                            if (newValue) {
                                this.set({location: document.location});
                                $(this._input).select();
                            }
                        },{defer: true});
                },

                action : function(){
                    // событие переключения на карты и обратно
                    EventManager.fire(Events.DYNAMIC_SERP_TOGGLE_MAP);
                }
            });

            return IndicatorFilters;
        }
    ]);

