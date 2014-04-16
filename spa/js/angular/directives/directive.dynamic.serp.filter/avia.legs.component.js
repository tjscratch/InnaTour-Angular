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
                        $scope.$watchCollection('tickets', function(newVal){

                        });
                    }
                ]
            }
        }
    ]);