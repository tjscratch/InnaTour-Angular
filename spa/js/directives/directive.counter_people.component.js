innaAppDirectives.directive('counterPeople', ['$templateCache', function($templateCache){
    return {
        template: function (el, attr) {
            if (attr.templ) {
                return $templateCache.get(attr.templ);
            }
            return $templateCache.get('components/counter_people.html');
        },
        scope: {
            adultCount: '=',
            childrenCount: '=',
            childrensAge: '=',
            typePage: '='
        },
        controller: ['$scope', '$location', function($scope, $location){
            /*Properties*/
            $scope.isOpen = false;

            /*Methods*/
            $scope.range = _.generateRange;

            /*Events*/
            $scope.onCounterClick = function(model, count){
                $scope[model] = count;

                if(model == 'childrenCount') {
                    $scope.childrensAge = [];
                    for(var i = 0; i < $scope.childrenCount; i++) {
                        $scope.childrensAge.push({value: 0});
                    }
                }
            }

            $scope.onAgeSelectorClick = function(num){
                var selector = $scope.childrensAge[num];
                selector.isOpen = !selector.isOpen;
            }

            $scope.sum = function(a, b){
                return +a + +b;
            }

            $scope.currentActive = function (route) {
                var loc = $location.path();
                var abs = $location.absUrl();

                if (route == '/') {
                    return ((abs.indexOf('/tours/?') > -1) || loc == route);
                }
                else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            };

            /*Watchers*/
            $scope.$watch('adultCount', function(newValue, oldValue){
                if(newValue instanceof Error) {
                    $scope.adultCount = oldValue;

                    $scope.rootElement.tooltip({
                        position: {
                            my: 'center top+22',
                            at: 'center bottom'
                        },
                        items: "[data-title]",
                        content: function () {
                            return $scope.rootElement.data("title");
                        }
                    });
                    $scope.rootElement.tooltip('open');
                }
                if(newValue && newValue != oldValue) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': $scope.typePage == 'DP' ? 'Packages' : 'Hotels',
                            'Action': 'Adults',
                            'Label': newValue,
                            'Content': newValue + $scope.childrenCount,
                            'Context': newValue > oldValue ? 'plus' : 'minus',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            $scope.$watch('childrenCount', function (newVal, oldVal) {
                if(newVal || newVal == 0 && newVal != oldVal) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': $scope.typePage == 'DP' ? 'Packages' : 'Hotels',
                            'Action': 'Childrens',
                            'Label': newVal,
                            'Content': newVal + $scope.adultCount,
                            'Context': newVal > oldVal ? 'plus' : 'minus',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });

            $scope.$watch('isOpen', function(newValue){
                if(newValue === true) try {
                    $scope.rootElement.tooltip('destroy');
                } catch(e) {}
            });
        }],
        link: function(scope, element, attrs){
            scope.rootElement = $('.search-form-item-current', element);

            $(document).click(function bodyClick(event){
                var isInsideComponent = !!$(event.target).closest(element).length;
                var isOnComponentTitle = event.target == element || event.target == scope.rootElement[0];

                scope.$apply(function($scope){
                    if (isOnComponentTitle) {
                        //���� ������ ����� - ��� WL-full ������� �������� ����
                        //��� ��������
                        if (!scope.isOpen && window.partners && window.partners.isFullWL()) {
                            window.partners.scrollToChildSelector();
                        }

                        $scope.isOpen = !$scope.isOpen;
                    } else {
                        $scope.isOpen = isInsideComponent;
                    }
                });
            });
        }
    }
}]);

innaAppDirectives.directive('counterPeopleChildAgeSelector', ['$templateCache', function($templateCache){
    return {
        template: $templateCache.get('components/counter_people.subcomponent.html'),
        scope: {
            'selector': '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;

            /*Methods*/
            $scope.range = _.generateRange

            /*Events*/
            $scope.onChoose = function(age){
                $scope.selector.value = age;
            }
        }],
        requires: '^counterPeople',
        link: function(scope, element, attrs){
            $(document).click(function(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                if (isInsideComponent) {
                    scope.$apply(function ($scope) {
                        //���� ������ ����� - ��� WL-full ������� �������� ����
                        //��� ��������
                        if (!scope.isOpen && window.partners && window.partners.isFullWL()) {
                            window.partners.scrollToChildSelectorItem();
                        }

                        $scope.isOpen = !$scope.isOpen;
                    });
                } else {
                    scope.$apply(function($scope){
                        $scope.isOpen = false;
                    });
                }
            });
        }
    }
}])
