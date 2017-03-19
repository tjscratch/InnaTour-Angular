innaAppControllers.
    controller('DynamicPackageMordaCtrl', [
        '$scope',
        '$location',
        'innaApp.Urls',
        'DynamicFormSubmitListener',
        'innaApp.services.PageContentLoader',
        'innaApp.API.pageContent.DYNAMIC',
        'PromoCodes',
        function ($scope, $location, URLs, DynamicFormSubmitListener, PageContentLoader, sectionID, PromoCodes) {
            
            $scope.pageTitle = "Поиск туров на регулярных рейсах";
            $scope.pageTitleSub = "АВИАБИЛЕТ + ОТЕЛЬ = ВМЕСТЕ выгоднее";
            
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



            PageContentLoader.getSectionById(sectionID, function (data) {
                //обновляем данные
                if (data != null) {
                    $scope.$apply(function ($scope) {
                        $scope.isRosneftWL = {
                            cardType: null,
                            price: 10000
                        }
                        if(window.partners.partner) {
                            if (window.partners.partner.name == 'komandacard') {
                                $scope.isRosneftWL.cardType = 'komandacard';
                            } else if (window.partners.partner.name == 'bpclub') {
                                $scope.isRosneftWL.cardType = 'bpclub';
                            }
                        }
                        
                        if($scope.isRosneftWL.cardType) {
                            PromoCodes.getCurrentBonus($scope.isRosneftWL).success(
                                function (res) {
                                    if(res.Result == 'Success') {
                                        $scope.currentBonusRosneft = parseFloat((res.Data).replace(',','.'));
                                    }
                                }
                            );
                        }

                        if (data.Landing != null) {
                            //включаем отображение доп. полей
                            if (routeSectionID != null) {
                                data.Landing.canDisplayDataForLandingPages = true;
                            }

                            //доп-обработка - добавляем текст в 2 колонки, если нужно
                            if (data.Landing.RenderTextType == 2) {//текст в 2 колонки
                                data.Landing.columsTextIntro = StringHelper.splitToTwoColumnsByBrDelimiter(data.Landing.TextIntro);
                            }

                            $scope.landing = data.Landing;
                        }

                        $scope.sections = data.SectionLayouts;
                        //данные для слайдера
                        $scope.$broadcast('slider.set.content', data.Slider);
                    });
                }
            });
        }
    ]);