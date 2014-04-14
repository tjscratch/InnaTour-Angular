angular.module('innaApp.directives')
    .directive('dynamicSerpMap', function(){
        return {
            templateUrl: '/spa/templates/pages/dynamic_package_serp.map.html',
            scope: {
                hotels: '@'
            },
            link: function(scope, elem, attrs){
                console.log(elem);
            }
        }
    });