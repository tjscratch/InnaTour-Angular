

innaAppDirectives.
    directive('filterBaggage', ['$templateCache', 'eventsHelper', '$location', function ($templateCache, eventsHelper, $location) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_baggage.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {
                //console.log($scope.list);
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
                };

                //заполняем выбранное из урла
                function initSelectedFromUrl() {
                    var baggageUrl = $location.search().baggage;
                    if (baggageUrl != null) {
                        var baggages = baggageUrl.split(',');
                        if ($scope.list != null && baggages != null && baggages.length > 0) {
                            _.each(baggages, function (baggage) {
                                var selItems = _.filter($scope.list, function (item) {
                                    return item.value == baggage;
                                });
                                if (selItems != null && selItems.length > 0) {
                                    selItems[0].checked = true;
                                }
                            });
                        }
                    }
                }
                initSelectedFromUrl();
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
