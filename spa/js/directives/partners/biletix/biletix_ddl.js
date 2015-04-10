innaAppDirectives.directive('biletixDdl',
    function ($templateCache) {
        return {
            require: '^biletixForm',
            restrict: 'E',
            scope: {
                value: "=",
                disabled: "="
            },
            template: function () {
                return $templateCache.get('components/partners/biletix/biletix_ddl.html')
            },
            controller: function ($element, $scope) {
                $scope.isShow = false;

                $scope.select = function (val) {
                    $scope.value = val;
                };

                $scope.range = function (start, end) {
                    var list = [start];
                    if (start < end) {
                        while (start < end) {
                            start++;
                            list.push(start);
                        }
                    }
                    return list;
                }
            },
            link: function(scope, element, attrs){
                $(document).click(function(event){
                    var isInsideComponent = !!$(event.target).closest(element).length;

                    if(isInsideComponent) {
                        scope.$apply(function($scope){
                            if (!$scope.disabled) {
                                $scope.isShow = !$scope.isShow;
                            }
                        });
                    } else {
                        scope.$apply(function($scope){
                            $scope.isShow = false;
                        });
                    }
                });
            }
        }
    });
