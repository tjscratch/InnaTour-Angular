angular.module('innaApp.services')
    .factory('DynamicFormSubmitListener', [
        '$rootScope',
        '$location',
        'innaApp.Urls',
        '$route',
        function ($rootScope, $location, appURLs, $route) {
            return {
                listen: function () {
                    $rootScope.$on('inna.DynamicPackages.Search', function (event, data) {

                        var searchUrl = appURLs.URL_DYNAMIC_PACKAGES_SEARCH +
                            [
                                data.DepartureId,
                                data.ArrivalId,
                                data.StartVoyageDate,
                                data.EndVoyageDate,
                                data.TicketClass,
                                data.Adult,
                                data.children.join('_')
                            ].join('-');

                        $location.search({});

                        if($location.path() == searchUrl) {

                            $route.reload();
                        }
                         else {
                            $location.path(searchUrl)
                        }

                    });
                }
            }
        }
    ]);