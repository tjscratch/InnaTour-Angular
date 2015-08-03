

innaAppDirectives.
    directive('filterTransfer', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_transfer.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    _.each($scope.list, function (item) { item.checked = false });
                };

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                };

                $scope.anyChecked = function () {
                    if ($scope.list != null) {
                        return _.any($scope.list, function (item) { return item.checked; });
                    }
                    return false;
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
