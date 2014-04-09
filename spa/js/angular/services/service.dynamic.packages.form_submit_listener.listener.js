angular.module('innaApp.services')
    .factory('DynamicFormSubmitListener', [
        '$rootScope', '$location',
        function($rootScope, $location){
            return {
                listen: function(){
                    $rootScope.$on('inna.DynamicPackages.Search', function(event, data){
                        $location.path(
                                app.URL_DYNAMIC_PACKAGES_SEARCH +
                                [
                                    data.DepartureId,
                                    data.ArrivalId,
                                    data.StartVoyageDate,
                                    data.EndVoyageDate,
                                    data.TicketClass,
                                    data.Adult
                                ].join('-')
                        );
                    });
                }
            }
        }
    ]);