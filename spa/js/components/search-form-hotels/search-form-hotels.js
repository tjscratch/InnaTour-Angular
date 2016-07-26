innaAppDirectives.directive('searchFormHotels', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/search-form-hotels/templ/form.html"),
        controller: function ($element, $scope, $routeParams,
                              $timeout, $location, AppRouteUrls, HotelService, dataService, widgetValidators, $q) {
            
            
            $scope.hotelsSearchForm = {};
            
            
            /**
             * поиск "Город/Название отеля"
             */
            $scope.getLocationFrom = function (text) {
                return HotelService.getSuggest(text)
                    .then(function (data) {
                        return data;
                    });
            };
            
            
            /**
             * BEGIN
             * установка значения поля Adult формы поиска
             */
            if ($routeParams.Adult) {
                $scope.hotelsSearchForm.Adult = $routeParams.Adult;
            } else {
                $scope.hotelsSearchForm.Adult = 2;
            }
            if($routeParams.Children){
                $scope.hotelsSearchForm.Children = $routeParams.Children.split('_').map(function (age) {
                    return { value: age };
                });
                $scope.hotelsSearchForm.ChildrenCount = $scope.hotelsSearchForm.Children.length;
            }else{
                $scope.hotelsSearchForm.Children = [];
                $scope.hotelsSearchForm.ChildrenCount = $scope.hotelsSearchForm.Children.length;
            }
            /**
             * END
             */
            
            
            /**
             * BEGIN
             * установка значения поля NightCount формы поиска
             */
            if ($routeParams.NightCount) {
                $scope.hotelsSearchForm.NightCount = $routeParams.NightCount;
            } else {
                $scope.hotelsSearchForm.NightCount = 7;
            }
            /**
             * END
             */
            
            
            /**
             * BEGIN
             * установка значения поля ArrivalId формы поиска из $routeParams
             */
            if ($routeParams.ArrivalId) {
                dataService.getLocationById($routeParams.ArrivalId)
                    .then(function (res) {
                        $scope.locationFrom = {
                            id: res.data.Id,
                            name: res.data.Name + ", " + res.data.CountryName
                        }
                    });
            } else {
                $scope.locationFrom = null;
            }
            /**
             * END
             */
            
            
            /**
             * BEGIN datapicker
             *
             *
             *
             */
            var datepickerElem = $element.find('.b-search-form-hotels__input-datapicker');
            $element.find(".b-search-form-hotels__field-icon").on('click', function (e) {
                e.preventDefault();
                datepickerElem.trigger('focus');
            });
            $scope.setStartDate = new Date();
            datepickerElem.datepicker({
                format: "d M yyyy",
                startDate: $scope.setStartDate,
                endDate: new Date($scope.setStartDate.valueOf() + 86400000 * 365),
                language: "ru",
                autoclose: true,
                todayHighlight: true,
                toggleActive: true
            }).on('show', function () {
                /**
                 * fix
                 * https://innatec.atlassian.net/browse/IN-4644
                 */
                $(".datepicker .datepicker-switch").on('click', function (e) {
                    e.stopPropagation();
                })
            })
            /**
             * установка значения датепикера из $routeParams
             */
            if ($routeParams.StartVoyageDate) {
                var selectedDate = moment($routeParams.StartVoyageDate, 'YYYY MM DD');
                $timeout(function () {
                    datepickerElem.datepicker('update', new Date(selectedDate.valueOf()));
                }, 0);
            }
            /**
             *
             *
             *
             * END datepicker
             */
            
            
            /**
             * BEGIN form validation
             */
            /**
             * END form validation
             */
            
            
            /**
             * BEGIN hotelsSearchStart
             * params:
             * ArrivalId=6733&StartVoyageDate=2016-05-24&NightCount=2&Adult=2
             */
            $scope.hotelsSearchStart = function (event) {
                event.preventDefault();

                var isBus = $location.path().startsWith(AppRouteUrls.URL_BUS);

                $scope.hotelsSearchForm.ArrivalId = $scope.locationFrom ? $scope.locationFrom.id : null;
                
                var searchUrl;
                if (isBus) {
                    searchUrl = HotelService.getBusIndexUrl($scope.hotelsSearchForm);
                } else {
                    searchUrl = HotelService.getHotelsIndexUrl($scope.hotelsSearchForm);
                }
                
                var validateArrivalId = widgetValidators.required($scope.hotelsSearchForm.ArrivalId, 'ArrivalId', 'Введите город или страну, куда планируете поехать');
                var validateStartVoyageDate = widgetValidators.required($scope.hotelsSearchForm.StartVoyageDate, 'StartVoyageDate', 'Выберите дату заезда');

                $q.all([validateArrivalId, validateStartVoyageDate])
                    .then(function (data) {
                        $location.path(searchUrl);
                    }, function (error) {
                        showError(error);
                    });
                
            };
            
            function showError(error) {
                if (error.name == 'ArrivalId') {
                    $scope.ArrivalIdError = error.error;
                }
                if (error.name == 'StartVoyageDate') {
                    $scope.StartVoyageDateError = error.error;
                }
            };
            /**
             * END hotelsSearchStart
             */
            
        }
    }
});
