innaAppDirectives.directive('productInfo', function ($templateCache) {
    return {
        replace: true,
        scope: {
            productData: '=',
            productType: '='
        },
        controller: function ($scope, aviaHelper, paymentService) {
    
            /**
             * ToDo
             * старый говнокод, отрефакторить
             */
            $scope.helper = aviaHelper;
            
            // data.ProductType
            // Avia = 1
            // Динамический пакет = 2
            // Сервисный сбор = 3
            // Отели = 4
            // Не определен = 0
            switch ($scope.productType) {
                case 1:
                    $scope.templateUrl = 'components/productInfo/templ/productInfoAvia.html';
                    $scope.tarifs = new $scope.helper.tarifs();
                    aviaHelper.addCustomFields($scope.productData.AviaInfo);
                    $scope.tarifs.fillInfo($scope.productData.AviaInfo);
                    $scope.ticketsCount = aviaHelper.getTicketsCount($scope.productData.AviaInfo.AdultCount, $scope.productData.AviaInfo.ChildCount, $scope.productData.AviaInfo.InfantsCount);
                    $scope.ticketsNumber = aviaHelper.getCharterAndNumSeatsText($scope.productData.AviaInfo.NumSeats, $scope.ticketsCount, $scope.productData.AviaInfo.IsCharter, $scope.productData.AviaInfo.alertDifferentPorts, $scope.productData.AviaInfo);
                    loadTarifs();
                    visaNeededCheck();
                    break;
                case 2:
                    $scope.templateUrl = 'components/productInfo/templ/productInfoDp.html';
                    $scope.tarifs = new $scope.helper.tarifs();
                    aviaHelper.addCustomFields($scope.productData.AviaInfo);
                    aviaHelper.addAggInfoFields($scope.productData.Hotel);
                    $scope.tarifs.fillInfo($scope.productData.AviaInfo);
                    loadTarifs();
                    visaNeededCheck();
                    $scope.hotelRules = new $scope.helper.hotelRules();
                    //правила отмены отеля
                    $scope.hotelRules.fillData($scope.productData.Hotel);
                    $scope.insuranceRules = new $scope.helper.insuranceRules();
                    break;
                case 3:
                    $scope.templateUrl = 'components/productInfo/templ/productInfo.html';
                    break;
                case 4:
                    $scope.templateUrl = 'components/productInfo/templ/productInfoHotel.html';
                    break;
                default:
                    $scope.templateUrl = 'components/productInfo/templ/productInfo.html';
            }
    
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
    
            $scope.visaControl = new aviaHelper.visaControl();
    
            function visaNeededCheck () {
                if ($scope.productData != null && $scope.productData.passengers != null && $scope.productData.AviaInfo != null) {
                    //Id-шники гражданств пассажиров
                    var passengersCitizenshipIds = _.map($scope.productData.passengers, function (pas) {
                        return pas.citizenship.id;
                    });
                    $scope.visaControl.check(passengersCitizenshipIds, $scope.productData.AviaInfo);
                }
            }
        },
        link: function (scope, element, attrs) {
            
        },
        template: '<div class="productInfo" ng-include="templateUrl"></div>'
    }
});
