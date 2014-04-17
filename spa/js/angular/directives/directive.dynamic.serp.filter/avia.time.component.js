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
                        var self = this;

                        this.HAS_EVENT = 'inna.innaDynamicSerpFilterAviaTime.Has';
                        this.MORNING = 'Morning';
                        this.DAY = 'Day';
                        this.EVENING = 'Evening';
                        this.NIGHT = 'Night';

                        function generatePredicate(property, start, end){
                            return function(ticket){
                                var h = dateHelper.apiDateToJsDate(ticket[property]).getHours();
                                return start < end ? (h >= start && h < end) : (h >= start || h < end);
                            }
                        }

                        $scope.$watch('tickets', function(newVal){
                            _.each({To: '', Back: 'Back'}, function(prefix, dir){
                                _.each([
                                    [self.MORNING, 5, 13],
                                    [self.DAY, 13, 18],
                                    [self.EVENING, 18, 23],
                                    [self.NIGHT, 23, 5]
                                ], function(period){
                                    var start = period[1], end = period[2];

                                    _.each(['DepartureDate', 'ArrivalDate'], function(property){
                                        if(_.find(newVal, function(ticket){
                                            var h = dateHelper.apiDateToJsDate(ticket[prefix + property]).getHours();
                                            return start < end ? (h >= start && h < end) : (h >= start || h < end);
                                        })) {
                                            var eData = {}
                                            eData[dir] = period[0];
                                            $scope.$broadcast(self.HAS_EVENT, eData);
                                        }
                                    });
                                });
                            });
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
                controller: [
                    '$scope',
                    function($scope){
                        $scope.models = {
                            Morning: {
                                show: false,
                                checked: false
                            },
                            Day: {
                                show: false,
                                checked: false
                            },
                            Evening: {
                                show: false,
                                checked: false
                            },
                            Night: {
                                show: false,
                                checked: false
                            }
                        }
                    }
                ],
                link: function(scope, element, attrs, parentCtrl){
                    scope.$on(parentCtrl.HAS_EVENT, function(event, data){
                        if(scope.dir in data) {
                            var model = data[scope.dir];
                            scope.models[model].show = true;
                        }
                    });
                }
            }
        }
    ]);