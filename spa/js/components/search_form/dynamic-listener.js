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

                            if (window.partners && window.partners.isFullWL() && window.partners.jumptoUrl && window.partners.jumptoUrl.length > 0) {
                                var url = window.partners.jumptoUrl + '#' + searchUrl;
                                //console.log('setNewUrl:', url);
                                window.partners.setParentLocationHref(url);
                            }
                            else {
                                $location.path(searchUrl);
                            }
                        }

                    });
                }
            }
        }
    ]);