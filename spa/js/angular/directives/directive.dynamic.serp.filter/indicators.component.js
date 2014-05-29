angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterIndicators', ['$templateCache', function($templateCache){
        return {
            template: function(element, attr){
                var templatePath = 'components/dynamic-serp-filter/';
                var templateName = attr.templateName || 'indicators.html';

                return $templateCache.get(templatePath + templateName);
            },
            replace: true,
            scope: {
                isMap : '=',
                filters: '=innaDynamicSerpFilterIndicatorsFilters',
                items: '=innaDynamicSerpFilterIndicatorsItems',
                mod_papper: '=modWpapper',
                action: '=innaDynamicSerpFilterIndicatorsAction',
                name: '@innaDynamicSerpFilterIndicatorsItemsName'
            },
            controller: [
                '$scope',
                '$element',
                function($scope, $element){

                    if($scope.isMap) {
                        $element.find('.button-map-list')
                            .toggleClass('checked', $scope.isMap);
                    }

                    if($scope.mod_papper){
                        $element.addClass('b-switch-filters_mod-wrapper');
                    }

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
    }])