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
                    $scope.atLeastOne = function(){
                        var result = false;

                        $scope.filters.each(function(filter){
                            result = result || (filter.options.getSelected().options.length !== 0);
                        });

                        return result;
                    }

                    $scope.reset = function(){
                        $scope.filters.each(function(filter){
                            filter.options.reset();
                        });
                    }

                    $scope.delete = function(option){
                        if(option.reset) option.reset();
                        else option.selected = false;
                    }
                }
            ]
        }
    })