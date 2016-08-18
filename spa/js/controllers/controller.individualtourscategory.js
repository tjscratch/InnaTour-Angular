
'use strict';

/* Controllers */

innaAppControllers.
    controller('IndividualToursCategoryCtrl', [
        '$log',
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        '$timeout',
        'dataService',
        'sharedProperties',
        function ($log, $scope, $rootScope, $routeParams, $location, $timeout, dataService, sharedProperties) {
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
                $timeout(function () {
                    if (skipClose != skipCloseType.prog)
                        $scope.isProgrammOpened = false;
                    if (skipClose != skipCloseType.country)
                        $scope.isCountryOpened = false;
                }, 0);
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
            $scope.programmItemClick = function (item) {
                $scope.filter.selectedProgramm = item;
                $location.search('type', item.id);
                applyFilter();
                scrollToTop();
            };
            $scope.countryItemClick = function (item) {
                $scope.filter.selectedCountry = item;
                $location.search('country', item.id);
                applyFilter();
            };

            //слушаем клик на body


            $('body').on('click', function () {
                closeAllPopups();
            });
            //$rootScope.addBodyClickListner('it_category_tours', function () {
                //closeAllPopups();
            //});

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

            $scope.programClick = function (offer) {
                track.programDownload(offer.Name, offer.DirectoryName, offer.IndividualTourCategoryName);
            }

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
				countriesList = _.sortBy(countriesList, function(item) { return item.name; });
                //добавляем путнкт все в начало
                countriesList.unshift(new idNameItem(0, "Все"));
                $scope.countriesList = countriesList;

                //ставим выбранные
                $scope.filter.selectedProgramm = $location.search().type &&
                    _.find($scope.programsTypeList, function(type){ return type.id == $location.search().type; }) ||
                    $scope.programsTypeList[0];
                $scope.filter.selectedCountry = $location.search().country &&
                    _.find($scope.countriesList, function(country){ return country.id == $location.search().country }) ||
                    $scope.countriesList[0];

                $scope.offersList = data.IndividualTourList;


                applyFilter();

                //данные для слайдера
                $scope.$broadcast('slider.set.content', data.Slider);

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

            $scope.$on('$destroy', function () {
                $('body').off('click', function () {
                    closeAllPopups();
                })
            })
        }
    ]);