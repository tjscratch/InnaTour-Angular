innaAppDirectives.directive('tooltipDirectiveBase', [
    '$templateCache',
    '$timeout',
    'EventManager',
    '$filter',

    'TooltipBase',
    function ($templateCache, $timeout, EventManager, $filter, TooltipBase) {
        return{
            replace: true,
            template: '',
            scope: {
                tooltipKlass : '@',
                contentHtml : '@',
                condition : '&',
                position : '@'
            },
            link: function ($scope, element, attrs) {

                var _tooltipBase = new TooltipBase({
                    el: element[0],
                    data: {
                        tooltipKlass: $scope.tooltipKlass,
                        contentHTML : $scope.contentHtml,
                        condition : $scope.condition,
                        position : $scope.position
                    }
                })


                $scope.$on('$destroy', function(){
                    _tooltipBase.teardown();
                })
            }
        }
    }])

