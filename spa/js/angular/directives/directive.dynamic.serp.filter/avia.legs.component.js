angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaLegs', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.legs.html',
                scope: {
                    tickets: '='
                },
                controller: [
                    '$scope',
                    function($scope){
                        $scope.options = [{
                            title: 'Прямой',
                            show: false,
                            comparator: function(l){ return l == 1; }
                        }, {
                            title: '1 пересадка',
                            show: false,
                            comporator: function(l){ return l == 2; }
                        }, {
                            title: '2+ пересадки',
                            show: false,
                            comparator: function(l) { return l > 2; }
                        }]

                        $scope.$watchCollection('tickets', function(newVal){
                            _.each($scope.options, function(option){

                            });
                        });
                    }
                ]
            }
        }
    ]);