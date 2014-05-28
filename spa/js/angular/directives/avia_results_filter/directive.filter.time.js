

innaAppDirectives.
    directive('filterTime', ['$templateCache', 'eventsHelper', 'aviaHelper', function ($templateCache, eventsHelper, aviaHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_time.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.list != null) {
                        return _.any($scope.list, function (item) { return item.checked == true; });
                    }
                    return false;
                }

                $scope.isToDepartureChecked = true;
                $scope.isBackDepartureChecked = true;

                $scope.resetTo = function ($event) {
                    eventsHelper.preventBubbling($event);
                    for (var i = 0; i <= 7; i++) {
                        $scope.list[i].checked = false;
                    }
                }

                $scope.resetBack = function ($event) {
                    eventsHelper.preventBubbling($event);
                    for (var i = 8; i <= 15; i++) {
                        $scope.list[i].checked = false;
                    }
                }

                $scope.resetItems = function (isToOrBack) {
                    if (isToOrBack) {
                        if ($scope.isToDepartureChecked) {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.arrival });
                            _.each(list, function (item) { item.checked = false; });
                        }
                        else
                        {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.departure });
                            _.each(list, function (item) { item.checked = false; });
                        }
                    }
                    else {
                        if ($scope.isBackDepartureChecked) {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.backArrival });
                            _.each(list, function (item) { item.checked = false; });
                        }
                        else {
                            var list = _.filter($scope.list, function (item) { return item.direction == aviaHelper.directionType.backDeparture });
                            _.each(list, function (item) { item.checked = false; });
                        }
                    }
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