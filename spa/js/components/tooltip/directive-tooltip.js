innaAppDirectives.directive('errorTooltip', [
    '$templateCache',
    '$timeout',
    'EventManager',
    function ($templateCache, $timeout, EventManager) {
        return{
            replace : true,
            template: $templateCache.get("components/tooltip/templ/error-tooltip.html"),
            scope   : {
                positionTop: '@',
                align      : '@',
                message    : '@'
            },
            link    : function ($scope, element, attrs) {

                element.css({
                    top: $scope.positionTop
                });

                $scope.$watch('message', function (newValue) {
                    if (newValue != '') {
                        var width = element.width();
                        if ($scope.align == 'width-center') {
                            element.css({
                                left      : '50%',
                                marginLeft: -width / 2
                            });
                        }
                        $timeout(function () {
                            $scope.message = ''
                        }, 1000)
                    }
                });

            }
        }
    }])