angular.module('innaApp.directives')
    .directive('innaDynamicSerpFilterAviaTime', [
        function(){
            return {
                templateUrl: '/spa/templates/components/dynamic-serp-filter/avia.time.html',
                scope: {
                    tickets: '=innaDynamicSerpFilterAviaTimeTickets'
                },
                controller: [
                    '$scope',
                    function($scope) {
                        console.log('hello from innaDynamicSerpFilterAviaTime');
                    }
                ]
            }
        }
    ])