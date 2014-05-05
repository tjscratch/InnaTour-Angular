﻿innaAppDirectives.directive('peopleComponent', ['eventsHelper', function (eventsHelper) {
    return {
        replace: true,
        templateUrl: '/spa/templates/components/people_component.html',
        scope: {
            adultCount: '=',
            childCount: '=',
            infantsCount: '='
        },
        controller: ['$scope', function ($scope) {

            $scope.isOpen = false;

            $scope.getPeopleCount = function () {
                return parseInt($scope.adultCount, 10) + parseInt($scope.childCount, 10) + parseInt($scope.infantsCount, 10);
            }

            function countPlus (value) {
                value = parseInt(value, 10);
                var value = value + 1;
                if (value > 6)
                    value = 6;
                return value;
            }
            function countMinus(key) {
                var value = $scope[key];
                value = parseInt(value, 10);
                value = value - 1;
                if (value < 0)
                    value = 0;

                if (key == 'adultCount' && value < 1) {
                    value = 1;
                }

                return value;
            }
            function canAddPeoples(data) {
                var adultCount = parseInt(data.adultCount, 10);
                var childCount = parseInt(data.childCount, 10);
                var infantsCount = parseInt(data.infantsCount, 10);
                //Один взрослый или ребенок может провести не более одного младенца без места
                var infFree = adultCount + childCount;
                var infPaid = infantsCount - infFree;
                if (infPaid < 0) {
                    infPaid = 0;
                }
                var maxPeople = adultCount + childCount + infPaid;
                return maxPeople <= 6;
            }

            $scope.minusClick = function ($event, key) {
                eventsHelper.preventBubbling($event);

                var val = countMinus(key);
                $scope[key] = val;
            }
            $scope.plusClick = function ($event, key) {
                eventsHelper.preventBubbling($event);

                var data = { adultCount: $scope.adultCount, childCount: $scope.childCount, infantsCount: $scope.infantsCount };
                data[key] = countPlus(data[key]);
                if (canAddPeoples(data)) {
                    $scope[key] = countPlus($scope[key]);
                }
            }
        }],
        link: function ($scope, element, attrs) {
            $(document).click(function bodyClick(event) {
                var isInsideComponent = !!$(event.target).closest(element).length;

                $scope.$apply(function ($scope) {
                    if ($scope.isOpen && isInsideComponent){//повторный клик закрывает
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
