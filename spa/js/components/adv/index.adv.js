'use strict';
angular.module('innaApp.directives')
    .directive('advComponent', [
        'EventManager',
        'innaAppApiEvents',
        '$templateCache',
        '$routeParams',
        '$location',
        '$cookieStore',
        function (EventManager, Events, $templateCache, $routeParams, $location, $cookieStore) {

            return {
                replace: true,
                template: $templateCache.get('components/adv/templ/index.adv.html'),
                controller: [
                    '$element',
                    '$scope',
                    function ($element, $scope) {

                        $scope.isAdv = null;
                        $scope.isVisible = false;

                        function getPartner() {
                            var enumPartners = [
                                "sletat",
                                "ruspo",
                                "tourindex"
                            ]

                            if ($location.search().utm_source && enumPartners.indexOf($location.search().utm_source) != -1) {
                                return true;
                            }
                        }

                        function determine() {





                            // проверяем куки и параметры в url
                            $scope.isAdv = $cookieStore.get('ADV_VISIBLE') || (getPartner() &&
                            (angular.isUndefined($location.search().tourist) || $location.search().tourist == 0));

                            if ($cookieStore.get('ADV_NOT_VISIBLE')) {
                                $scope.isAdv = false;
                            }

                            if ($scope.isAdv) {
                                document.body.classList.add('adv-inject');

                                var injectStyle = document.createElement('link');
                                injectStyle.type = 'text/css';
                                injectStyle.setAttribute('id', 'injectStyleAdv');
                                injectStyle.rel = 'stylesheet';
                                injectStyle.href = '/spa/js/components/adv/css/adv.base.css?' + Math.random(1000).toString(16);
                                document.getElementsByTagName('head')[0].appendChild(injectStyle);

                                show();
                            }
                        }

                        determine();

                        function show() {
                            $scope.isVisible = true;
                            $cookieStore.put('ADV_VISIBLE', true);
                        }


                        $scope.hideAdv = function ($event) {
                            $event.stopPropagation();
                            $scope.isVisible = false;
                            $scope.isAdv = false;
                            delete $location.$$search.tourist;
                            $location.$$compose();

                            $('#injectStyleAdv').remove();
                            $cookieStore.remove('ADV_VISIBLE');
                            $cookieStore.put('ADV_NOT_VISIBLE', true);
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
                    }],
                link: function () {

                }
            }
        }
    ]);

