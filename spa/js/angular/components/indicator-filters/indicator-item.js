innaAppConponents.
    factory('IndicatorFiltersItem', [
        'EventManager',
        'innaApp.API.events',
        '$templateCache',
        'FilterSettings',

        // components
        'Tripadvisor',
        'Stars',
        function (EventManager, Events, $templateCache, FilterSettings, Tripadvisor, Stars) {

            var IndicatorFiltersItem = Ractive.extend({
                template: $templateCache.get('components/indicator-filters/templ/indicator-item.hbs.html'),
                data: {
                    isArray: angular.isArray
                },
                components: {
                    Tripadvisor: Tripadvisor,
                    Stars: Stars
                },
                init: function (options) {
                    var that = this;

                    console.log(this);

                    this.on({
                        action: this.action,
                        removeFilter: function (data) {
                            console.log(data);
                            EventManager.fire('IndicatorFiltersItem:remove:' + this.get('filterItem.name'), data.context);
                        },
                        teardown: function (evt) {

                        }
                    })
                }
            });

            return IndicatorFiltersItem;
        }
    ]);

