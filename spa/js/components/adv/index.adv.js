'use strict';
console.info('lksdhjshdgfhjs');
angular.module('innaApp.directives').directive('AdvComponent', [
    'EventManager',
    'innaApp.API.events',
    '$templateCache',
    '$routeParams',
    '$location',
    function (EventManager, Events, $templateCache, $routeParams, $location) {
        console.info('slkdfhsjkdfghhjsdgf sjdfgjhsdf sjdhfvhsgdfh');
        console.info('slkdfhsjkdfghhjsdgf sjdfgjhsdf sjdhfvhsgdfh');
        console.info('slkdfhsjkdfghhjsdgf sjdfgjhsdf sjdhfvhsgdfh');
        console.info('slkdfhsjkdfghhjsdgf sjdfgjhsdf sjdhfvhsgdfh');

        return {
            restrict: 'A',
            replace: true,
            template: $templateCache.get('components/adv/templ/index.adv.hbs.html'),
            scope: {
                isVisible: false,
                styleWidth: ''
            },
            controller: [
                '$element',
                '$scope',
                function ($element, $scope) {

                    console.info('test adv');

                    function determine() {
                        if ($location.search().adv) {
                            document.body.classList.add('adv-inject');

                            var injectStyle = document.createElement('link');
                            injectStyle.type = 'text/css';
                            injectStyle.rel = 'stylesheet';
                            injectStyle.href = '/spa/js/components/adv/css/adv.base.css';
                            document.getElementsByTagName('head')[0].appendChild(injectStyle);

                            show();
                        }
                    }

                    determine();

                    function show() {
                        $scope.isVisible = true;
                    }


                    function hide(evt) {
                        $scope.isVisible = false;
                    }

                    function toggleVisible() {
                        if ($scope.isVisible)
                            $scope.isVisible = false;
                        else
                            $scope.isVisible = true;
                    }


                    $scope.$watch('isVisible', function (value) {
                        if (value) {

                        } else {

                        }
                    })
                }]
        }
    }
]);

