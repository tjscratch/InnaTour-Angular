

innaAppDirectives.
    directive('filterSort', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_sort.html'),
            scope: {
                sort: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    //_.each($scope.list, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.sort.list != null) {
                        return _.any($scope.list, function (item) { return item.checked; });
                    }
                    return false;
                }

                $scope.applySort = function ($event, type) {
                    $scope.isOpen = false;
                    //eventsHelper.preventBubbling($event);
                    //log('applySort: ' + type + ', $scope.sort:' + $scope.sort + ', $scope.reverse:' + $scope.reverse);

                    var reverse = false;
                    if ($scope.sort.sortType == type)
                        reverse = !$scope.sort.reverse;
                    else
                        reverse = false;

                    $scope.sort.sortType = type;
                    $scope.sort.reverse = reverse;
                };

                $scope.getCurrentSortName = function () {
                    return _.find($scope.sort.list, function (item) { return item.sort == $scope.sort.sortType }).name;
                };
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
