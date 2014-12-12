angular.module('innaApp.components')
    .directive('partialsCollection', [
        '$templateCache',
        '$log',
        function ($templateCache, $log) {
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
                    ticketModel : "="
                },
                link: function ($scope, $element, $attr) {
                    $scope.$log = $log;


                    $scope.$watch('ticketModel',function(value){
                        if(value){
                            $scope.collectionAirlines = value.collectAirlines();
                        }
                    });

                    $scope.$on('$destroy', function () {
                        console.info('$destroy DatePartialsCollection');
                    });
                }
            }
        }])
