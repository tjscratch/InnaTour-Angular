innaAppDirectives
    .directive('tabs', [
        '$templateCache',
        function($templateCache) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function($scope, $element) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(pane) {
                        pane.selected = false;
                    });
                    pane.selected = true;
                }

                this.addPane = function(pane) {
                    if (panes.length == 0) $scope.select(pane);
                    panes.push(pane);
                }
            },
            template: $templateCache.get('components/tabs/templ/tabs.html'),
            replace: true
        };
    }])

    .directive('pane', [
        '$templateCache',
        function($templateCache) {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: { title: '@' },
            link: function(scope, element, attrs, tabsController) {
                tabsController.addPane(scope);
            },
            template: $templateCache.get('components/tabs/templ/pane.html'),
            replace: true
        };
    }])

