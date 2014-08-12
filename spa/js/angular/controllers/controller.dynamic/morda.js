innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope',
        '$location',
        'innaApp.Urls',
        'DynamicFormSubmitListener',
        'innaApp.services.PageContentLoader',
        'innaApp.API.pageContent.DYNAMIC',
        function ($scope, $location, URLs, DynamicFormSubmitListener, PageContentLoader, sectionID) {
            /*EventListeners*/
            //$('body').addClass('scrollVisible');
            DynamicFormSubmitListener.listen();

            function getSectionId (path) {
                if (path.indexOf(URLs.URL_PACKAGES_LANDING) > -1) { //ЛП
                    var bits = QueryString.getBits(path);
                    if (bits.length == 1 || bits.length == 2) {
                        return bits[0];
                    }
                    else {
                        return null;
                    }
                }
            }

            var routeSectionID = getSectionId($location.path());//IN-2501 Лэндинги стран
            if (routeSectionID != null) {
                sectionID = routeSectionID;
            }
            //console.log('sectionID:', sectionID);

            /*Data fetching*/
            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function ($scope) {
                        
                        if (data.Landing != null) {
                            //включаем отображение доп. полей
                            if (routeSectionID != null) {
                                data.Landing.canDisplayDataForLandingPages = true;
                            }

                            //доп-обработка - добавляем текст в 2 колонки, если нужно
                            if (data.Landing == 2) {//текст в 2 колонки
                                data.Landing.columsTextIntro = StringHelper.splitToTwoColumns(data.Landing.TextIntro);
                            }

                            $scope.landing = data.Landing;
                        }

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