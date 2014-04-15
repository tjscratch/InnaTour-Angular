innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope', 'DynamicFormSubmitListener', 'innaApp.services.PageContentLoader', 'innaApp.API.pageContent.DYNAMIC',
        function ($scope, DynamicFormSubmitListener, PageContentLoader, sectionID) {
            /*EventListeners*/
            DynamicFormSubmitListener.listen();

            /*Data fetching*/
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.sections = data.SectionLayouts;
                }
            });
        }
    ]);