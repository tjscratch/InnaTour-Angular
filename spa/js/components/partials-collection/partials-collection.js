angular.module('innaApp.components')
    .directive('partialsCollection', [
        '$templateCache',
        '$log',
        'aviaHelper',
        function ($templateCache, $log, aviaHelper) {
            return {
                template: function (el, attr) {
                    if (attr.partialName) {
                        var temp = $templateCache.get('components/partials-collection/templ/' + attr.partialName + '.html');
                        return temp;
                    }
                },
                replace: true,
                scope: {
                    date: '=',
                    direction: '@',
                    aviaInfo: "=",
                    hotel: "=",
                    ticketModel : "=",
                    toOrBack: "="
                },
                link: function ($scope, $element, $attr) {
                    $scope.$log = $log;



                    //время в пути
                    function getFlightTimeFormatted(avia){
                        avia.TimeToFormatted = aviaHelper.getFlightTimeFormatted(avia.TimeTo);
                        avia.TimeBackFormatted = aviaHelper.getFlightTimeFormatted(avia.TimeBack);

                        // console.log(avia.TimeBackFormatted);
                        // console.log(avia.TimeToFormatted);
                    }

                    $scope.$watch('ticketModel',function(value){
                        if(value){
                            $scope.collectionAirlines = value.collectAirlines();
                            $scope.airLogo = value.airLogo;
                        }
                    });

                    $scope.$on('$destroy', function () {
                        //console.info('$destroy DatePartialsCollection');
                    });
                }
            }
        }])
