innaAppDirectives.directive('counterPeople', ['$templateCache', function($templateCache){
    return {
        template: $templateCache.get('components/counter_people.html'),
        scope: {
            adultCount: '=',
            childrenCount: '=',
            childrensAge: '='
        },
        controller: ['$scope', function($scope){
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

                scope.$apply(function($scope){
                    $scope.isOpen = isInsideComponent;
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

                if(isInsideComponent) {
                    scope.$apply(function($scope){
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