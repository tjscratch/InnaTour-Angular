innaAppConponents.
    factory('IndicatorFilters', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',

        // components
        'Tripadvisor',
        'Stars',
        function (EventManager, Events, $templateCache, Tripadvisor, Stars) {

            var IndicatorFilters = Ractive.extend({
                template: $templateCache.get('components/indicator-filters/templ/indicator-filters.hbs.html'),
                data: {
                    filters: [],
                    isArray : angular.isArray,
                    atLeastOne: false
                },
                components: {
                    Tripadvisor: Tripadvisor,
                    Stars: Stars
                },
                init: function (options) {
                    var that = this;


                    this.on({
                        action: this.action,
                        removeFilter : function(data){
                            console.log(data.context);
                        }
                    })


                    this.observe('isVisible',
                        function (newValue, oldValue) {
                            if (newValue) {
                                this.set({location: document.location});
                                $(this._input).select();
                            }
                        }, {defer: true});

                    EventManager.on(Events.FILTER_PANEL_CHANGE, function (data) {
                        clearTimeout(that._filterTimeout);
                        that._filterTimeout = setTimeout(function () {
                            that.set('filters', data);
                            console.log(data, 'IndicatorFilters');
                        }, 300);
                    });
                },


                action: function () {
                    // событие переключения на карты и обратно
                    EventManager.fire(Events.DYNAMIC_SERP_TOGGLE_MAP);
                }
            });

            return IndicatorFilters;
        }
    ]);

