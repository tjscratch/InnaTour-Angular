angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterIndicators', [
        '$templateCache',
        '$location',
        function ($templateCache, $location) {
            return {
                template: function (element, attr) {
                    var templatePath = 'components/indicator-map/templ/';
                    var templateName = attr.templateName || 'indicators.html';

                    return $templateCache.get(templatePath + templateName);
                },
                replace: true,
                scope: {
                    isMap: '=isMap',
                    filters: '=innaDynamicSerpFilterIndicatorsFilters',
                    items: '=innaDynamicSerpFilterIndicatorsItems',
                    mod_wrapper: '=modWpapper',
                    name: '@innaDynamicSerpFilterIndicatorsItemsName'
                },
                controller: [
                    '$scope',
                    '$element',
                    function ($scope, $element) {

                        if ($scope.mod_wrapper) {
                            $element.addClass('b-switch-filters_mod-wrapper');
                            $element.find('.button-map-list').addClass('checked');
                        }

                        $scope.atLeastOne = function () {
                            var result = false;

                            $scope.filters.each(function (filter) {
                                result = result || (filter.options.getSelected().options.length !== 0);
                            });

                            return result;
                        }

                        $scope.reset = function () {
                            $scope.filters.each(function (filter) {
                                filter.options.reset();
                            });
                        }

                        $scope.action = function(){
                            $scope.$emit('toggle:view:hotels:map');
                        }

                        $scope.delete = function (option) {
                            if (option.reset) option.reset();
                            else option.selected = false;
                        }
                    }
                ]
            }
        }])