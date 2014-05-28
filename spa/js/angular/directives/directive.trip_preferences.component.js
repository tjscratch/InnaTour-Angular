innaAppDirectives.directive('tripPreferences', [function(){
    return {
        templateUrl: '/spa/templates/components/trip_preferences.html',
        replace: true,
        scope: {
            showBackTripOptions: '@',
            klassModel: '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;

            /*Events*/
            $scope.onChoose = function(option) {
                $scope.klassModel = option;
            }
        }],
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