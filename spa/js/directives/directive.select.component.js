//:ToDO это дерьмо походу нигде не используется временно закоментировал
//innaAppDirectives.directive('select', ['$templateCache', function($templateCache){
//    return {
//        template: $templateCache.get('components/select.html'),
//        scope: {
//        	options: '=',
//        	caption: '@',
//        	current: '='
//        },
//        controller: function($scope){
//        	/*Properties*/
//        	$scope.isOpen = false;
//        	
//        	/*Events*/
//        	$scope.setCurrent = function(option){
//        		$scope.current = option;
//        	}
//        },
//        link: function(scope, element, attrs){
//        	$(document).click(function(event){
//        		var isInsideComponent = !!$(event.target).closest(element).length;
//        		
//        		if(!isInsideComponent) {
//        			scope.$apply(function($scope){ 
//        				$scope.isOpen = false;
//        			});
//        		} else {
//        			scope.$apply(function($scope){ 
//        				$scope.isOpen = !$scope.isOpen; 
//        			});
//        		}
//        	});
//        }
//    }
//}]);