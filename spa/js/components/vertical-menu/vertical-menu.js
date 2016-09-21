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

                    // $('body').on('click', function () {
                    //     // e.stopPropagation();
                    //     if($scope.isOpen) {
                    //         $scope.isOpen = false;
                    //     }
                    // });
                    
                    $scope.toggleVertMenu = function () {
                        var isOpen = $scope.isOpen;
                        $scope.isOpen = !isOpen;
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

                    function clickHanlder (e) {
                        $scope.$apply(function ($scope) {
                            var $this = e.target;
                            console.log('asdasdasd', e);
                            if($this.classList) {
                                console.log($this.classList);
                                if($scope.isOpen == true) {
                                    if ($this.classList[0] != 'menu__ul-li' &&
                                        $this.classList[0] != 'icon-menu' &&
                                        $this.classList[0] != 'icon-vert-menu' &&
                                        $this.classList[0] != 'icon-menu__line') {
                                        $scope.isOpen = false;
                                        e.stopPropagation();
                                        console.log('NOOOOOOOOOOOOOOOo');
                                    }
                                }
                            }
                        });
                    };

                    document.addEventListener('click', clickHanlder, false);

                    // $scope.$on('$destroy', function () {
                    //     document.removeEventListener('click', clickHanlder, false);
                    // });

                },
                template: $templateCache.get('components/vertical-menu/templ/menu.html'),
                replace: true
            };
        }])