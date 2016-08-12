innaAppDirectives.directive('userInfo', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/userInfo/templ/userInfo.html"),
        scope: {
            productData: '='
        },
        controller: function ($scope, aviaHelper, paymentService) {
         
            $scope.reservationModel = $scope.productData;
    
            // $scope.reservationModel.Email = $scope.productData;
            
        }
    }
});
