

innaAppDirectives.
    directive('filterTime', ['eventsHelper', function (eventsHelper) {
        return {
            replace: true,
            templateUrl: '/spa/templates/components/avia_results_filter/filter_time.html',
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    //_.each($scope.list, function (item) { item.checked = true });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);
/*
new BaseOption('Утро', 6, 12),
new BaseOption('День', 12, 18),
new BaseOption('Вечер', 18, 0),
new BaseOption('Ночь', 24, 6)
*/