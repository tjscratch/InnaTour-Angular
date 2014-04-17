angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaTime', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.time.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaTimeTickets'
                },
                controller: [
                    '$scope',
                    function($scope) {
                        this.HAS_EVENT = 'inna.innaDynamicSerpFilterAviaTime.Has';
                        this.CHANGE_EVENT = 'inna.innaDynamicSerpFilterAviaTime.Changed';

                        this.MORNING = 'Morning';
                        this.DAY = 'Day';
                        this.EVENING = 'Evening';
                        this.NIGHT = 'Night';
                        this.ARRIVAL = 'ArrivalDate';
                        this.DEPARTURE = 'DepartureDate';

                        var self = this;

                        var starts = {};
                        starts[this.MORNING] = 6;
                        starts[this.DAY] = 12;
                        starts[this.EVENING] = 18;
                        starts[this.NIGHT] = 0;

                        var ends = {};
                        ends[this.MORNING] = 12;
                        ends[this.DAY] = 18;
                        ends[this.EVENING] = 24;
                        ends[this.NIGHT] = 6;

                        var prefixes = {To: '', Back: 'Back'};

                        $scope.flat = {};

                        $scope.$watch('tickets', function(newVal){
                            _.each(prefixes, function(prefix, dir){
                                _.each([self.MORNING, self.DAY, self.EVENING, self.NIGHT], function(period){
                                    var start = starts[period], end = ends[period];

                                    _.each([self.ARRIVAL, self.DEPARTURE], function(property){
                                        if(_.find(newVal, function(ticket){
                                            return dateHelper.isHoursBetween(ticket[prefix + property], start, end);
                                        })) {
                                            var eData = {
                                                property: property
                                            };
                                            eData[dir] = period;

                                            $scope.$broadcast(self.HAS_EVENT, eData);
                                        }
                                    });
                                });
                            });
                        });

                        $scope.$on(this.CHANGE_EVENT, function(event, data){
                            _.each(data.value, function(period, periodName){
                                _.each(period, function(model, property){
                                    var name = [prefixes[data.dir] + property, periodName].join('.');
                                    $scope.flat[name] = model.checked && [starts[periodName], ends[periodName]];
                                });
                            });

                            var compact = {}
                            _.each($scope.flat, function(value, key){
                                if(value) compact[key] = value;
                            });

                            $scope.$emit('inna.Dynamic.SERP.Ticket.Filter', {filter: 'Time', value: compact});
                        });
                    }
                ]
            };
        }
    ])
    .directive('innaDynamicSerpFilterAviaTimeSection', [
        function(){
            return {
                require: '^innaDynamicSerpFilterAviaTime',
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.time.html/section',
                scope: {
                    caption: '@innaDynamicSerpFilterAviaTimeSectionCaption',
                    dir: '@innaDynamicSerpFilterAviaTimeSectionDir'
                },
                link: function(scope, element, attrs, parentCtrl){
                    scope.ARRIVAL = parentCtrl.ARRIVAL;
                    scope.DEPARTURE = parentCtrl.DEPARTURE;

                    scope.property = scope.ARRIVAL;

                    scope.names = {}
                    scope.names[parentCtrl.MORNING] = "Утро";
                    scope.names[parentCtrl.DAY] = "День";
                    scope.names[parentCtrl.EVENING] = "Вечер";
                    scope.names[parentCtrl.NIGHT] = "Ночь";


                    scope.models = {}
                    _.each([parentCtrl.MORNING, parentCtrl.DAY, parentCtrl.EVENING, parentCtrl.NIGHT], function(period){
                        scope.models[period] = {}

                        _.each([scope.ARRIVAL, scope.DEPARTURE], function(prop){
                            scope.models[period][prop] = {
                                show: false,
                                checked: false
                            }
                        });
                    });

                    scope.onChange = function(){
                        scope.$emit(parentCtrl.CHANGE_EVENT, {dir: scope.dir, value: angular.copy(scope.models)});
                    };

                    scope.$on(parentCtrl.HAS_EVENT, function(event, data){
                        if(scope.dir in data) {
                            var period = data[scope.dir];
                            scope.models[period][data.property].show = true;
                        }
                    });
                }
            }
        }
    ]);