innaAppConponents.
    factory('IndicatorFiltersItem', [
        'EventManager',
        'innaAppApiEvents',
        '$templateCache',

        // components
        'Tripadvisor',
        'Stars',
        function (EventManager, Events, $templateCache, Tripadvisor, Stars) {

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
                onrender: function (options) {
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

                            this._parent.fire('removeFilter', dataEvents, this.get('filterItem.name'));
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

