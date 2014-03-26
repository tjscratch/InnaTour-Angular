
'use strict';

/* Controllers */

innaAppControllers.
    controller('IndividualToursCategoryCtrl', ['$log', '$scope', '$rootScope', '$routeParams', '$filter', '$timeout', 'dataService', 'sharedProperties',
        function IndividualToursCategoryCtrl($log, $scope, $rootScope, $routeParams, $filter, $timeout, dataService, sharedProperties) {
            function log(msg) {
                $log.log(msg);
            }

            $scope.hellomsg = "Привет из IndividualToursCategoryCtrl";
            $scope.offersList = [];
            $scope.filteredOffersList = [];

            $scope.programsTypeList = [];
            $scope.countriesList = [];
            $scope.isProgrammOpened = false;
            $scope.isCountryOpened = false;

            $scope.filter = {
                selectedProgramm: null,
                selectedCountry: null
            };

            //отключаем бабблинг событий
            function preventBubbling($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }

            var skipCloseType = { prog: 'prog', country: 'country' };
            function closeAllPopups(skipClose) {
                if (skipClose != skipCloseType.prog)
                    $scope.isProgrammOpened = false;
                if (skipClose != skipCloseType.country)
                    $scope.isCountryOpened = false;
            };

            $scope.programmClick = function ($event) {
                closeAllPopups(skipCloseType.prog);
                $scope.isProgrammOpened = !$scope.isProgrammOpened;
                preventBubbling($event);
            };
            $scope.countryClick = function ($event) {
                closeAllPopups(skipCloseType.country);
                $scope.isCountryOpened = !$scope.isCountryOpened;
                preventBubbling($event);
            };
            $scope.programmItemClick = function (item, $event) {
                $scope.filter.selectedProgramm = item;
                applyFilter();
                scrollToTop();
            };
            $scope.countryItemClick = function (item, $event) {
                $scope.filter.selectedCountry = item;
                applyFilter();
            };

            //слушаем клик на body
            $rootScope.addBodyClickListner('it_category_tours', function () {
                //log('IndividualToursCategoryCtrl bodyClick');
                closeAllPopups();
            });

            //получаем категорию
            var categoryId = $routeParams.id;
            //log('$scope.getIndividualToursCategory, categoryId:' + categoryId);
            dataService.getIndividualToursCategory(categoryId, function (data) {
                //обновляем данные
                if (data != null) {
                    //log('data: ' + angular.toJson(data));
                    //log('$scope.getIndividualToursCategory success');
                    updateModel(data);
                    //$scope.blocks = angular.fromJson(data);
                }
            }, function (data, status) {
                //ошибка получения данных
                log('getIndividualToursCategory error; status:' + status);
            });

            function updateModel(data) {
                $scope.data = data;

                //список категорий
                $scope.categoryList = data.CategoryList;
                //корневая
                $scope.rootCategory = {
                    Id: data.Id,
                    Name: data.Name,
                    Description: data.Description
                };
                //выбранная
                $scope.selectedCategory = $scope.rootCategory;

                //разбираем типы программ и страны (города)
                var programsTypeList = [];
                var countriesList = [];
                //составляем список
                _.each(data.IndividualTourList, function (item) {
                    programsTypeList.push(new idNameItem(item.IndividualTourCategoryId, item.IndividualTourCategoryName));
                    countriesList.push(new idNameItem(item.DirectoryId, item.DirectoryName));
                });
                //оставляем только уникальные
                programsTypeList = _.uniq(programsTypeList, false, function (item) {
                    return item.id;
                });
                programsTypeList.unshift(new idNameItem(0, "Все"));
                $scope.programsTypeList = programsTypeList;

                //оставляем только уникальные
                countriesList = _.uniq(countriesList, false, function (item) {
                    return item.id;
                });
                //пропускаем пустые страны
                countriesList = _.filter(countriesList, function (item) { return item.id > 0; });
                //добавляем путнкт все в начало
                countriesList.unshift(new idNameItem(0, "Все"));
                $scope.countriesList = countriesList;

                //ставим выбранные
                if ($scope.programsTypeList.length > 0)
                    $scope.filter.selectedProgramm = $scope.programsTypeList[0];
                if ($scope.countriesList.length > 0)
                    $scope.filter.selectedCountry = $scope.countriesList[0];

                //выводим сразу нефильтрованные значения
                $scope.offersList = data.IndividualTourList;
                $scope.filteredOffersList = $scope.offersList;

                $scope.slides = data.Slider;
                //данные для слайдера - нужны другому контроллеру
                sharedProperties.setSlider($scope.slides);

                $scope.$broadcast('comboboxDataLoaded');
            };

            function scrollToTop() {
                //$(document.body).animate({
                //    scrollTop: 0
                //}, 50);
                //$(document.documentElement).animate({
                //    scrollTop: 0
                //}, 50);
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            };

            function applyFilter() {
                var filteredOffersList = [];
                _.each($scope.offersList, function (item) {
                    if (($scope.filter.selectedProgramm.id == 0
                        || item.IndividualTourCategoryId == $scope.filter.selectedProgramm.id)
                        &&
                        ($scope.filter.selectedCountry.id == 0
                        || item.DirectoryId == $scope.filter.selectedCountry.id)) {
                        filteredOffersList.push(item);
                    }
                });

                $scope.filteredOffersList = filteredOffersList;

                //меняем описание для категории в шапке
                if ($scope.filter.selectedProgramm.id > 0)
                {
                    $scope.selectedCategory = _.find($scope.categoryList, function (cat) { return cat.Id == $scope.filter.selectedProgramm.id });
                }
                else
                {
                    //устанавливаем корневую
                    $scope.selectedCategory = $scope.rootCategory;
                }
            };
        }]);