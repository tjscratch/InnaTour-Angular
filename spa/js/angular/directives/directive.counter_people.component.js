innaAppDirectives.directive('counterPeople', [function(){
    return {
        templateUrl: '/spa/templates/components/counter_people.html',
        scope: {
            adultCount: '=',
            childrenCount: '=',
            childrensAge: '='
        },
        controller: ['$scope', function($scope){
            function ChildAgeSelector() {
                this.value = 0;
            }

            /*Properties*/
            $scope.isOpen = false;

            /*Methods*/
            $scope.range = _.generateRange;

            /*Events*/
            $scope.onCounterClick = function(model, count){
                $scope[model] = count;

                $scope.childrensAge = [];
                for(var i = 0; i < $scope.childrenCount; i++) {
                    $scope.childrensAge.push(new ChildAgeSelector());
                }
            }

            $scope.onAgeSelectorClick = function(num){
                var selector = $scope.childrensAge[num];
                selector.isOpen = !selector.isOpen;
            }
        }],
        link: function(scope, element, attrs){
            $(document).click(function bodyClick(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                scope.$apply(function($scope){
                    $scope.isOpen = isInsideComponent;
                });
            });
        }
    }
}]);

innaAppDirectives.directive('counterPeopleChildAgeSelector', [function(){
    return {
        templateUrl: 'counter-people-child-age-selector.subcomponent.js.html',
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