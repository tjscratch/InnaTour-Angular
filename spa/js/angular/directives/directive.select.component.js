innaAppDirectives.directive('select', [function(){
    return {
        templateUrl: '/spa/templates/components/select.html',
        scope: {
        	options: '=',
        	caption: '@',
        	current: '='
        },
        controller: function($scope){
        	/*Properties*/
        	$scope.isOpen = false;
        	
        	/*Events*/
        	$scope.setCurrent = function(option){
        		$scope.current = option;
        	}
        },
        link: function(scope, element, attrs){
        	var doc = $(document);
			
        	doc.click(function bodyClick(event){
        		var isInsideComponent = !!$(event.target).closest(element).length;
        		
        		if(!isInsideComponent) {
        			scope.$apply(function($scope){ 
        				$scope.isOpen = false;
        			});
        		} else {
        			scope.$apply(function($scope){ 
        				$scope.isOpen = !$scope.isOpen; 
        			});
        		}
        	});
        }
    }
}]);