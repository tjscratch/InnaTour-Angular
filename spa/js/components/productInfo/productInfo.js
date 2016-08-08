innaAppDirectives.directive('productInfo', function ($templateCache) {
    return {
        replace: true,
        scope: {
            productData: '=',
            productType: '='
        },
        controller: function ($scope, aviaHelper, paymentService) {
            console.log($scope.productData);
            
            /**
             * ToDo
             * старый говнокод, отрефакторить
             */
            $scope.helper = aviaHelper;
            
            $scope.tarifs = new $scope.helper.tarifs();
            
            function loadTarifs() {
                paymentService.getTarifs({
                        variantTo: $scope.productData.AviaInfo.VariantId1,
                        varianBack: $scope.productData.AviaInfo.VariantId2
                    },
                    function (data) {
                        $scope.tarifs.tarifsData = data;
                    },
                    function (data, status) {
                        console.log('paymentService.getTarifs error');
                    });
            }
            
            $scope.tarifs.fillInfo($scope.productData.AviaInfo);
            loadTarifs();
            
            
            $scope.hotelRules = new $scope.helper.hotelRules();
            //правила отмены отеля
            $scope.hotelRules.fillData($scope.productData.Hotel);
            
            $scope.insuranceRules = new $scope.helper.insuranceRules();
        },
        link: function (scope, element, attrs) {
            
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
