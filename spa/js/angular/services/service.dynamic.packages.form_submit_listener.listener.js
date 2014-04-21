angular.module('innaApp.services')
    .factory('DynamicFormSubmitListener', [
        '$rootScope', '$location', 'innaApp.Urls',
        function($rootScope, $location, appURLs){
            return {
                listen: function(){
                    $rootScope.$on('inna.DynamicPackages.Search', function(event, data){
                        $location.path(
                            appURLs.URL_DYNAMIC_PACKAGES_SEARCH +
                            [
                                data.DepartureId,
                                data.ArrivalId,
                                data.StartVoyageDate,
                                data.EndVoyageDate,
                                data.TicketClass,
                                data.Adult,
                                data.children.join('_')
                            ].join('-')
                        );
                    });
                }
            }
        }
    ]);