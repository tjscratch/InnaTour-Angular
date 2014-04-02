innaAppDirectives.directive('select', [function(){
    return {
        templateUrl: '/spa/templates/components/select.html',
        scope: {
        	options: '=',
        	caption: '='
        }
    }
}]);