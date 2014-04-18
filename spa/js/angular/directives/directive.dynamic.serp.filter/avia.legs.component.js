angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaLegs', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.legs.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaLegsTickets'
                },
                controller: [
                    '$scope',
                    function($scope){
                        $scope.options = [{
                            title: 'Прямой',
                            show: false,
                            comparator: function(l){ return l == 1; },
                            selected: false
                        }, {
                            title: '1 пересадка',
                            show: false,
                            comparator: function(l){ return l == 2; },
                            selected: false
                        }, {
                            title: '2+ пересадки',
                            show: false,
                            comparator: function(l) { return l > 2; },
                            selected: false
                        }]

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

                        $scope.onChange = function(option){
                            $scope.$emit('inna.Dynamic.SERP.Ticket.Filter', {filter: 'Legs', value: angular.copy($scope.options)});
                        };
                    }
                ]
            }
        }
    ]);