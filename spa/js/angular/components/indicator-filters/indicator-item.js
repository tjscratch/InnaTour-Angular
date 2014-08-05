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

                    this.parse();

                    this.on({
                        action: this.action,
                        removeFilter: function (data) {
                            EventManager.fire('IndicatorFiltersItem:remove:' + this.get('filterItem.name'), data.context);
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                parse: function () {
                    var filterItem = this.get('filterItem');

                    console.log(filterItem, 'filterItem');

                    if (filterItem.name == 'DepartureDate') {

                        filterItem.val.forEach(function (item) {


                            var resultState = item.state.filter(function (state) {
                                return state.isActive;
                            });

                            var resultDays = item.dayState.filter(function (day) {
                                return day.isChecked;
                            });


                            if (resultDays.length) {

                            }
                            if (resultState.length) {

                            }
                        })


                    }
                }
            });

            return IndicatorFiltersItem;
        }
    ]);

