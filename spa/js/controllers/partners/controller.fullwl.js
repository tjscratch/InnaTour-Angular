'use strict';

/* Controllers */

innaAppControllers.
    controller('FullWLMainCtrl', [
        'EventManager', '$scope', '$rootScope', '$location', 'innaApp.Urls', '$routeParams', 'innaAppApiEvents', 'DynamicFormSubmitListener', 'innaApp.services.PageContentLoader', 'innaApp.API.pageContent.DYNAMIC',
        function (EventManager, $scope, $rootScope, $location, URLs, $routeParams, Events, DynamicFormSubmitListener, PageContentLoader, sectionID) {
            //EventManager.fire(Events.HEAD_HIDDEN);
            //EventManager.fire(Events.FOOTER_HIDDEN);

            $('body').addClass('partner-body-class');
            //чтобы влезали все формы
            $('#main-content-div').css("min-height", "730px");

            function getSectionId(path) {
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

            if (window.partners && window.partners.isFullWL() && window.partners.getPartner().showOffers) {
                $scope.showOffers = true;

                var routeSectionID = getSectionId($location.path());//IN-2501 Лэндинги стран
                if (routeSectionID != null) {
                    sectionID = routeSectionID;
                }

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

            DynamicFormSubmitListener.listen();

            //location.href = 'http://192.168.105.54/#/packages/search/6733-6623-09.10.2014-19.10.2014-0-2-';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/search/6733-6623-09.10.2014-19.10.2014-0-2-';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/details/6733-6623-09.10.2014-19.10.2014-0-2--138050-777142817-777142827-4?displayHotel=138050';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/reservation/6733-6623-10.10.2014-18.10.2014-0-1-?room=0f5b6412-5dfa-7ab4-da79-f380821e0f7f&hotel=435490&ticket=777081287&debug=1';
            //location.href = 'http://biletix.lh.inna.ru/#/packages/buy/PT9K6N';

            $scope.$on('$destroy', function () {
                $('body').removeClass('partner-body-class');
                $('#main-content-div').css("min-height", "");
            });
        }
    ]);
