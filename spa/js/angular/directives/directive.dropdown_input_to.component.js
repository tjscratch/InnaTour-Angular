innaAppDirectives.directive('dropdownInputTo', [function(){
    return {
        templateUrl: '/spa/templates/components/dropdown_input_to.html',
        scope: {
        	provideSuggestCallback: '=', //callback for ngChange
        	suggest: '=', //list of suggested objects
            result: '='
        },
        controller: ['$scope', function($scope){
        	/*Properties*/
        	$scope.fulfilled = false;
        	
        	/*Events*/
        	$scope.setCurrent = function(option) {
        		$scope.input.val(option.name + option.description());
        		$scope.fulfilled = true;
        	}
            $scope.unfulfill = function(){
                $scope.fulfilled = false;
                $scope.result = null;
            }
        }],
        link: function(scope, elem, attrs){
        	scope.input = $('input[type="text"]', elem);

            scope.input.keypress(_.debounce(function(event){
                var value = scope.input.val();
        		var preparedText = value.split(', ')[0].trim();

        		scope.provideSuggestCallback(preparedText, value);
        	}, 200));
        }
    }
}]);