angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterIndicators', function(){
        return {
            templateUrl: function(element, attr){
                var templatePath = '/spa/templates/components/dynamic-serp-filter/';
                var templateName = attr.templateName || 'indicators.html';

                return templatePath + templateName;
            },
            replace: true,
            scope: {
                filters: '=innaDynamicSerpFilterIndicatorsFilters',
                items: '=innaDynamicSerpFilterIndicatorsItems',
                mod_papper: '=modWpapper',
                action: '=innaDynamicSerpFilterIndicatorsAction'
            },
            controller: [
                '$scope',
                '$element',
                function($scope, $element){
                    var isMap = false;

                    $element.on('click', '.button-map-list', function(evt){
                        if(!isMap){
                            isMap = true;
                            $scope.action();
                        } else {
                            isMap = false;
                            $scope.action();
                        }

                        $(this).toggleClass('checked', isMap);
                    });

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
    })