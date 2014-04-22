angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaLegs', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.legs.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaLegsTickets'
                },
                controller: [
                    '$scope', 'innaApp.API.events',
                    function($scope, Events){
                        $scope.options = [{
                            id: 'Stright',
                            title: 'Прямой',
                            show: false,
                            comparator: function(l){ return l == 1; },
                            selected: false
                        }, {
                            id: 'OneJump',
                            title: '1 пересадка',
                            show: false,
                            comparator: function(l){ return l == 2; },
                            selected: false
                        }, {
                            id: 'MultipleJumps',
                            title: '2+ пересадки',
                            show: false,
                            comparator: function(l) { return l > 2; },
                            selected: false
                        }];

                        $scope.$watchCollection('tickets', function(newVal){
                            _.each($scope.options, function(option){
                                var ticket = _.find(newVal, function(ticket){
                                    return option.comparator(ticket.EtapsTo.length) || option.comparator(ticket.EtapsBack.length);
                                });

                                if(ticket) { //at least one
                                    option.show = true;
                                }
                            });
                        });

                        $scope.onChange = function(){
                            var legs = _.reduce($scope.options, function(memo, option){
                                if(option.selected) {
                                    memo[option.id] = {
                                        title: option.title,
                                        comparator: option.comparator
                                    }
                                }

                                return memo;
                            }, {});
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_TICKET, {filter: 'Legs', value: legs});
                        };

                        $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, 'Legs.*'), function(event, data){
                            var optionToTurnOff = _.findWhere($scope.options, {id: data.split('.')[1]});

                            optionToTurnOff.selected = false;
                            $scope.onChange();
                        });
                    }
                ]
            }
        }
    ]);