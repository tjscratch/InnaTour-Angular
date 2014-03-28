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
                }
                else if (loc.indexOf('/avia/') > -1) {
                    return UrlHelper.addPathAndVersion('/spa/templates/nav_forms/avia_search_form.html');
                }
                else {
                    return UrlHelper.addPathAndVersion('/spa/templates/nav_forms/empty.html');
                }
            };



        }]);