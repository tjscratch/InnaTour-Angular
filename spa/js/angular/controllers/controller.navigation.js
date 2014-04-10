'use strict';

/* Controllers */

innaAppControllers.
    controller('NavigationCtrl', ['$log', '$scope', '$location', 'dataService', 'eventsHelper',
        function NavigationCtrl($log, $scope, $location, dataService, eventsHelper) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.isActive = function (route) {
                var loc = $location.path();
                var abs = $location.absUrl();
                //console.log('loc: ' + loc + ' route: ' + route);
                if (route == '/') {
                    return ((abs.indexOf('/tours/?') > -1) || loc == route);
                }
                else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            }

            $scope.getHeadForm = function () {
                var loc = $location.path();
                //log('$scope.getHeadForm, loc:' + loc);
                var abs = $location.absUrl();
                if (loc == '/' || abs.indexOf('/tours/?') > -1) {
                    return UrlHelper.addPathAndVersion('/spa/templates/nav_forms/tours_search_form.html');
                } else if(loc.startsWith(app.URL_DYNAMIC_PACKAGES)) {
                	return UrlHelper.addPathAndVersion('/spa/templates/nav_forms/dynamic_search_form.html');
                }
                else if (loc.indexOf('/avia/') > -1) {
                    return UrlHelper.addPathAndVersion('/spa/templates/nav_forms/avia_search_form.html');
                }
                else {
                    return UrlHelper.addPathAndVersion('/spa/templates/nav_forms/empty.html');
                }
            };

            $scope.getTitle = function () {
                
                var loc = $location.path();
                var abs = $location.absUrl();

                if (loc == '/') {
                    return "Главная";
                } else if (loc.indexOf(app.URL_DYNAMIC_PACKAGES) > -1) {
                    return "Динамические пакеты";
                }
                else if (loc.indexOf(app.URL_AVIA) > -1) {
                    return "Авиабилеты";
                }
                else if (loc.indexOf(app.URL_PROGRAMMS) > -1) {
                    return "Программы";
                }
                else if (loc.indexOf(app.URL_ABOUT) > -1) {
                    return "О компании";
                }
                else if (loc.indexOf(app.URL_CONTACTS) > -1) {
                    return "Контакты";
                }
                else {
                    return "Главная";
                }
            };

            setTitle();
            function setTitle() {
                $scope.title = "Инна-Тур - " + $scope.getTitle();
            };

            $scope.$on('$routeChangeSuccess', function () {
                setTitle();
            });

            $scope.isLoginPopupOpened = false;
            $scope.headLoginBtnclick = function ($event) {
                eventsHelper.preventBubbling($event);
                $scope.isLoginPopupOpened = !$scope.isLoginPopupOpened;
            };

        }]);