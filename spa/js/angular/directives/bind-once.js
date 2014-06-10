app.directive('bindOnce', function() {
    return {
        scope: true,
        link: function($scope) {
            setTimeout(function() {
                $scope.$destroy();
            }, 0);
        }
    }
});