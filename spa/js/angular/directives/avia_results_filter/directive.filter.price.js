

innaAppDirectives.
    directive('filterPrice', ['eventsHelper', function (eventsHelper) {
        return {
            require: 'ngModel',
            replace: true,
            templateUrl: '/spa/templates/components/avia_results_filter/filter_price.html',
            scope: {
                initMinValue: '=',
                initMaxValue: '=',
                minValue: '=',
                maxValue: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.minValue = $scope.initMinValue;
                    $scope.maxValue = $scope.initMaxValue;
                }

                $scope.headClicked = false;
                $scope.toggle = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;
                    $scope.isOpen = !$scope.isOpen;
                }
            }],
            link: function ($scope, element, attrs, ngModel) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.filter = ngModel.$modelValue;

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
