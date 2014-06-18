app.directive('bindOnce', [
    '$timeout',
    function($timeout) {
        return {
            scope: true,
            link: function($scope, $element) {
                $timeout(function() {
                    $scope.$destroy();
                }, 0);
            }
        }
    }
]);