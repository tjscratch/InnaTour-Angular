innaAppDirectives
    .directive('verticalMenu', [
        '$templateCache',
        '$location',
        function($templateCache, $location) {
            return {
                restrict: 'E',
                scope: {},
                controller: function($scope, $element) {

                    $scope.isOpen = false;

                    // $('body').on('click', function (e) {
                    //     e.stopPropagation();
                    //     if($scope.isOpen) {
                    //         $scope.isOpen = false;
                    //     }
                    // });
                    
                    $scope.toggleVertMenu = function () {
                        console.log('isOpen', $scope.isOpen);
                        var isOpen = $scope.isOpen;
                        $scope.isOpen = !isOpen;
                        console.log('isOpen', $scope.isOpen);
                    };

                    $scope.etapMainPage = '';

                    etapMainPage();

                    $scope.$on('$routeChangeStart', function (next, current) {
                        etapMainPage();
                    });

                    function etapMainPage() {
                        switch ($location.$$path) {
                            case '/':
                            case '/avia/':
                            case '/tours/':
                            case '/packages/':
                            case '/hotels/':
                            case '/bus/':
                            case '/individualtours/':
                                if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {

                                }else{
                                    $scope.etapMainPage = true;
                                }
                                break;
                            default:
                                $scope.etapMainPage = false;
                                break;
                        }
                    }

                },
                template: $templateCache.get('components/vertical-menu/templ/menu.html'),
                replace: true
            };
        }])