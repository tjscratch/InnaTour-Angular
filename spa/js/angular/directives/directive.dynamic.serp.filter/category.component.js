angular.module('innaApp.directives')
    .directive('dynamicSerpFilterCategory', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/category.html',
                scope: {
                    hotels: '&'
                },
                controller: [
                    '$scope',
                    function($scope){
                        console.log('dynamicSerpFilterCategory: $scope = ', $scope);
                    }
                ]
            }
        }
    ]);