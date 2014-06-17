

innaAppDirectives.
    directive('filterAircompany', ['$templateCache', 'eventsHelper', '$location', function ($templateCache, eventsHelper, $location) {
        return {
            replace: true,
            template: $templateCache.get('components/avia_results_filter/filter_aircompany.html'),
            scope: {
                list: '='
            },
            controller: ['$scope', function ($scope) {
                //console.log($scope.list);
                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);

                    _.each($scope.list, function (item) { item.checked = false });
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }

                $scope.anyChecked = function () {
                    if ($scope.list != null) {
                        return _.any($scope.list, function (item) { return item.checked; });
                    }
                    return false;
                }

                //заполняем выбранное из урла
                function initSelectedFromUrl() {
                    var transporterCode = $location.search().code;
                    if (transporterCode != null) {
                        var codes = transporterCode.split(',');
                        if ($scope.list != null && codes != null && codes.length > 0) {
                            _.each(codes, function (code) {
                                var selItems = _.filter($scope.list, function (item) {
                                    return item.TransporterCode == code;
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
