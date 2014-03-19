'use strict';

/* Controllers */

innaAppControllers.
    controller('NavigationCtrl', ['$log', '$scope', '$location', 'dataService',
        function NavigationCtrl($log, $scope, $location, dataService) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.isActive = function (route) {
                var loc = $location.path();
                //console.log('loc: ' + loc + ' route: ' + route);
                if (route == '/') {
                    return loc == route;
                }
                else {
                    if (loc.indexOf(route) > -1)
                        return true;
                    else
                        return false;
                }
            }

            function addPathAndVersion(url) {
                //версия нужна чтобы обновлялись шаблоны
                return appPath + url + '?v=' + UrlHelper.ver;
            }

            $scope.getHeadForm = function () {
                var loc = $location.path();
                var abs = $location.absUrl();
                if (loc == '/' || abs.indexOf('/tours/?') > -1) {
                    return addPathAndVersion('templates/nav_forms/tours.html');
                }
                else {
                    return addPathAndVersion('templates/nav_forms/empty.html');
                }
            };



        }]);