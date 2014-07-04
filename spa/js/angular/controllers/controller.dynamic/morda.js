innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope',
        'DynamicFormSubmitListener',
        'innaApp.services.PageContentLoader',
        'innaApp.API.pageContent.DYNAMIC',
        function ($scope, DynamicFormSubmitListener, PageContentLoader, sectionID) {
            /*EventListeners*/
            //$('body').addClass('scrollVisible');
            DynamicFormSubmitListener.listen();

            /*Data fetching*/
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function($scope) {
                        $scope.sections = data.SectionLayouts;
                        //данные для слайдера
                        $scope.$broadcast('slider.set.content', data.Slider);
                    });
                }
            });

            /*$scope.$on('$destroy', function(){
                $('body').removeClass('scrollVisible');
            })*/
        }
    ]);