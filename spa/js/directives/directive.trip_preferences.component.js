innaAppDirectives.directive('tripPreferences', ['$templateCache', function($templateCache){
    return {
        template: function (el, attr) {
            if (attr.templ) {
                return $templateCache.get(attr.templ);
            }
            return $templateCache.get('components/trip_preferences.html');
        },
        replace: true,
        scope: {
            showBackTripOptions: '@',
            klassModel: '=',
            typePage: '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;

            /*Events*/
            $scope.onChoose = function(option) {
                $scope.klassModel = option;
            }

            $scope.$watch('klassModel', function (newValue, oldValue) {

                if(newValue != oldValue) {
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': $scope.typePage == 'DP' ? 'Packages' : 'Avia',
                            'Action': 'ServiceClass',
                            'Label': newValue.display && newValue.display == 'Эконом' ? 'Economy' : 'Business',
                            'Content': '[no data]',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    };
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }
                }
            });
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