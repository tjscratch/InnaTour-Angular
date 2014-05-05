angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterIndicators', function(){
        return {
            templateUrl: '/spa/templates/components/dynamic-serp-filter/indicators.html',
            replace: true,
            scope: {
                filters: '=innaDynamicSerpFilterIndicatorsFilters',
                items: '=innaDynamicSerpFilterIndicatorsItems'
            },
            controller: [
                '$scope',
                function($scope){
                    console.log('innaDynamicSerpFilterIndicators', $scope);
                }
            ]
        }
    })