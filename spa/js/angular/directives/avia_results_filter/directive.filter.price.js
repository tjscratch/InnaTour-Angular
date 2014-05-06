

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

                $scope.preventBubbling = eventsHelper.preventBubbling;
                $scope.preventDefault = eventsHelper.preventDefault;

                $scope.resetFilter = function ($event) {
                    eventsHelper.preventBubbling($event);
                    $scope.minValue = $scope.initMinValue;
                    $scope.maxValue = $scope.initMaxValue;
                }
            }],
            link: function ($scope, element, attrs, ngModel) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.filter = ngModel.$modelValue;

                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen && isInsideComponent) {
                            $scope.isOpen = false;
                        }
                        else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        };
    }]);
