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

                $scope.toggle = function () {
                    if (!$scope.disabled) {
                        $scope.isShow = !$scope.isShow;
                    }
                };

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
            }
        }
    });
