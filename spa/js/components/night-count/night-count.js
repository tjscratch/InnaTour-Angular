innaAppDirectives.directive('nightCount', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/night-count/templ/night-count.html"),
        scope: {
            count: '='
        },
        controller: function ($scope) {
            $scope.isOpen = false;

            $scope.$watch('count', function (newValue, oldValue) {
                if( newValue != oldValue ) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Hotels',
                            'Action': 'NightsCount',
                            'Label': newValue,
                            'Content': '[no data]',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    };
                    // console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            $scope.increment = function (inc) {
                if (inc == 'input_change') {
                    incCount();
                } else {
                    incCount(inc);
                }
            };

            function incCount (number) {
                var num = Math.ceil(number) ? Math.ceil(number) : 0;
                var count = Math.ceil($scope.count) + num;
                if (count >= 1 && count <= 28) {
                    $scope.count = count;
                } else if (count <= 1) {
                    $scope.count = 1;
                } else if (count >= 28) {
                    $scope.count = 28;
                }
            }

        },
        link: function (scope, element, attrs) {
            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (isInsideComponent) {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = true;
                    });
                } else {
                    scope.$apply(function ($scope) {
                        $scope.isOpen = false;
                    });
                }
            });
        }
    }
});
