innaAppDirectives.directive('dropdownInputTo', [function(){
    return {
        templateUrl: '/spa/templates/components/dropdown_input_to.html',
        scope: {
        	provideSuggestCallback: '=', //callback for ngChange
        	suggest: '=' //list of suggested objects
        },
        controller: ['$scope', function($scope){
        	$scope.rawText = '';
        	$scope.onTextChange = function(){
        		var preparedText = $scope.rawText.split(',')[0].trim();
        		$scope.provideSuggestCallback(preparedText, $scope.rawText);
        	}
        	$scope.getToItemDescription = function (item) {
        		var toItemType = { country: 'country', resort: 'resort', hotel: 'hotel' };
                var country = "";
                var resort = "";
                
                if (item.countryName != null) {
                	country = item.countryName;
                }
                
                if (item.resortName != null) {
                	resort = item.resortName;
                }
                
                

                if (item.type == toItemType.country)  {
                	return ", по всей стране";
                } else if (item.type == toItemType.resort) {
                    return ", " + country;
                } else if (item.type == toItemType.hotel) {
                    return ", " + country + ", " + resort;
                }
            };
        }]
    }
}]);