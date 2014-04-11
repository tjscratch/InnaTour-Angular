angular.module('innaApp.directives')
    .directive('dynamicSerpFilterName', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/name.html',
                scope: {
                    hotels: '='
                },
                controller: [
                    '$scope',
                    function($scope){
                        $scope.name = '';

                        $scope.$watch('name', function(newVal){
                            $scope.$emit('inna.Dynamic.SERP.Hotel.Filter', {filter: 'Name', value: newVal});
                        });
                    }
                ]
            }
        }
    ]);