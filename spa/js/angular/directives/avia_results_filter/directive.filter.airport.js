

innaAppDirectives.
    directive('filterAirport', ['eventsHelper', function (eventsHelper) {
        return {
            replace: true,
            templateUrl: '/spa/templates/components/avia_results_filter/filter_airport.html',
            scope: {
                filter: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.minLen = 1;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    _.each($scope.filter.fromPorts, function (item) { item.checked = false });
                    _.each($scope.filter.toPorts, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.filter != null) {
                        return _.any($scope.filter.fromPorts, function (item) { return item.checked; }) || _.any($scope.filter.toPorts, function (item) { return item.checked; });
                    }
                    return false;
                }

                //$scope.$watch('filter', function (newValue) {
                //    console.log(newValue);
                //}, true);
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
