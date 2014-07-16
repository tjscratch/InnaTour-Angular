'use strict';

/* Controllers */

innaAppControllers.
    controller('RootCtrl', [
        '$log',
        '$scope',
        '$location',
        'dataService',
        'eventsHelper',
        'urlHelper',
        'innaApp.Urls',
        'aviaHelper',
        function ($log, $scope, $location, dataService, eventsHelper, urlHelper, appUrls, aviaHelper) {

            // TODO : HELL
            $scope.baloon = aviaHelper.baloon;

            (function __INITIAL__(){
                var advParams = {
                    from: $location.search('from'),
                    from_param: $location.search('from_param'),
                    PartnerMarker: $location.search('PartnerMarker'),
                    id_partner: $location.search('id_partner'),
                    data: $location.search('data')
                };

                delete $location.$$search.from
                delete $location.$$search.from_param
                delete $location.$$search.PartnerMarker
                delete $location.$$search.id_partner
                delete $location.$$search.data
                $location.$$compose();

                dataService.getPartnershipCookie(advParams);
            })();
        }]);