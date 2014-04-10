innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'dataService','sharedProperties',
        function ($scope, DynamicFormSubmitListener, dataService, sharedProperties) {
            /*EventListeners*/
            DynamicFormSubmitListener.listen();

            //КОПИПАСТА ИЗ controllers.tours.js
                function updateModel(data) {
                    $scope.sections = data.SectionLayouts;
                    $scope.slides = data.Slider;
                    sharedProperties.setSlider($scope.slides);
                }
                //карусель
                $scope.myInterval = 5000;

                $scope.hellomsg = "Привет из ToursCtrl";
                var params = {
                    sectionLayoutId: QueryString.getFromUrlByName(location.href, 'sectionLayoutId'),
                    sliderId: QueryString.getFromUrlByName(location.href, 'sliderId'),
                    layoutOffersId: QueryString.getFromUrlByName(location.href, 'layoutOffersId')
                };
                dataService.getSectionTours(params, function (data) {
                    //обновляем данные
                    if (data != null) {
                        updateModel(data);
                    }
                }, function (data, status) {});
            //КОНЕЦ КОПИПАСТЫ
        }
    ]);