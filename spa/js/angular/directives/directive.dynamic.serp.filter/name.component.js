angular.module('innaApp.directives')
    .directive('dynamicSerpFilterName', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/name.html',
                scope: {
                    hotels: '='
                },
                controller: [
                    '$scope', 'innaApp.API.events',
                    function($scope, Events){
                        var NAME = 'Name';
                        var DEFAULT = '';

                        $scope.name = DEFAULT;

                        $scope.$watch('name', function(newVal){
                            $scope.$emit(Events.DYNAMIC_SERP_FILTER_HOTEL, {filter: NAME, value: newVal});
                        });

                        $scope.$on(Events.build(Events.DYNAMIC_SERP_FILTER_ANY_DROP, NAME), function(){
                            $scope.name = DEFAULT;
                        });
                    }
                ]
            }
        }
    ]);