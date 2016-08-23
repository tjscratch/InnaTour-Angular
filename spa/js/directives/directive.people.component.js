innaAppDirectives.directive('peopleComponent', [
    '$templateCache', 'eventsHelper', 'aviaHelper',
    function ($templateCache, eventsHelper, aviaHelper) {
        return {
            replace: true,
            template: $templateCache.get('components/people_component.html'),
            scope: {
                adultCount: '=',
                childCount: '=',
                infantsCount: '='
            },
            controller: ['$scope', function ($scope) {

                $scope.isOpen = false;

                $scope.aviaHelper = aviaHelper;

                $scope.getPeopleCount = function () {
                    return parseInt($scope.adultCount, 10) + parseInt($scope.childCount, 10) + parseInt($scope.infantsCount, 10);
                };

                $scope.preventBubbling = eventsHelper.preventBubbling;

                function countPlus(value) {
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
                    //Один взрослый может провести не более одного младенца без места
                    var infFree = adultCount;
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

                $scope.$watch('adultCount', function (newValue, oldValue) {
                    if(newValue && oldValue) {
                        console.log('new', newValue);
                        console.log('old', oldValue);
                    }
                });

                $scope.$watch('childCount', function (newValue, oldValue) {
                    if(newValue) {
                        console.log('newChild', newValue);
                        console.log('oldChild', oldValue);
                    }
                });
            }],
            link: function ($scope, element, attrs) {
                $(document).click(function bodyClick(event) {
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen && isInsideComponent) {//повторный клик закрывает
                            $scope.isOpen = false;
                        }
                        else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });

                $scope.hover = { timeoutId: null, element: null };
                $('.js-people-minus,.js-people-plus').on('mouseout', function () {
                    var el = $(this);
                    el.removeClass('hover');

                    if ($scope.hover.timeoutId) {
                        clearInterval($scope.hover.timeoutId);
                    }
                });
                $('.js-people-minus,.js-people-plus').on('click', function () {
                    var el = $(this);
                    el.addClass('hover');

                    if ($scope.hover.timeoutId) {
                        clearInterval($scope.hover.timeoutId);
                    }

                    $scope.hover.element = el;
                    $scope.hover.timeoutId = setTimeout(function () {
                        if ($scope.hover.element) {
                            $scope.hover.element.removeClass('hover');
                        }
                    }, 1000);
                });

                $scope.$on('$destroy', function () {
                    $('.js-people-minus,.js-people-plus').off();
                });
            }
        };
    }]);
