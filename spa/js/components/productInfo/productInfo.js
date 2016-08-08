innaAppDirectives.directive('productInfo', function ($templateCache) {
    return {
        replace: true,
        scope:{
            productData: '=',
            productType: '='
        },
        controller: function ($scope, aviaHelper) {
            console.log($scope.productData);
            $scope.helper = aviaHelper;
        },
        link: function(scope, element, attrs) {
            
            // data.ProductType
            // Avia = 1
            // Динамический пакет = 2
            // Сервисный сбор = 3
            // Отели = 4
            // Не определен = 0
            switch (scope.productType) {
                case 1:
                    scope.templateUrl = 'components/productInfo/templ/productInfo.html';
                    break;
                case 2:
                    scope.templateUrl = 'components/productInfo/templ/productInfoDp.html';
                    break;
                case 3:
                    scope.templateUrl = 'components/productInfo/templ/productInfo.html';
                    break;
                case 4:
                    scope.templateUrl = 'components/productInfo/templ/productInfo.html';
                    break;
                default:
                    scope.templateUrl = 'components/productInfo/templ/productInfo.html';
            }
        },
        template: '<div class="productInfo" ng-include="templateUrl"></div>'
    }
});
