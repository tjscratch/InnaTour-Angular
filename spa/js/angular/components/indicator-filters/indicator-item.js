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
                    TimeIndicator : [],
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
                        change : function(data){
                            if(!data['TimeIndicator']) this.parse();
                        },
                        action: this.action,
                        removeFilter: function (data, param) {
                            //console.log(data, param);
                            var dataEvents = data.context;

                            if(this.get('filterItem.name') == 'DepartureDate') {
                                data.context.direction = param;
                            }

                            EventManager.fire('IndicatorFiltersItem:remove:' + this.get('filterItem.name'), dataEvents);
                        },
                        teardown: function (evt) {

                        }
                    });
                },

                parse: function () {
                    var filterItem = this.get('filterItem');
                    var newTimeIndicator = [];

                    if (filterItem.name == 'DepartureDate') {

                        filterItem.val.forEach(function (item) {

                            var resultState = item.state.filter(function (state) {
                                return state.isActive;
                            });

                            var resultDays = item.dayState.filter(function (day) {
                                return day.isChecked;
                            });


                            if (resultDays.length) {
                                newTimeIndicator.push({
                                    direction : (item.direction == 'to') ? 'Туда' : 'Обратно',
                                    directionOriginal : item.direction,
                                    days : resultDays,
                                    state : resultState[0]
                                });
                            }
                        })

                        this.set('TimeIndicator', newTimeIndicator);
                    }


                }
            });

            return IndicatorFiltersItem;
        }
    ]);

