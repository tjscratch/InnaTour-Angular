innaAppDirectives.directive('searchFormHotels', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/search-form-hotels/templ/form.html"),
        controller: function ($element, $scope, $routeParams, $timeout, $location, refactoringAppUrls, HotelService, dataService) {


            $scope.hotelsSearchForm = {};


            /**
             * BEGIN example form data
             */
            $scope.childrenCount = 0;
            /**
             * END example form data
             */


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
                dataService.getDPLocationById($routeParams.ArrivalId)
                    .then(function (data) {
                        $scope.locationFrom = {
                            id: $routeParams.ArrivalId,
                            name: data.CountryName + ", " + data.Name
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
            $scope.setStartDate = new Date();
            var datepickerElem = $element.find('.b-search-form-hotels__input-datapicker');
            datepickerElem.datepicker({
                format: "d M yyyy",
                startDate: $scope.setStartDate,
                endDate: new Date($scope.setStartDate.valueOf() + 86400000 * 365),
                language: "ru",
                autoclose: true,
                todayHighlight: true,
                toggleActive: true
            });
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
             * BEGIN hotelsSearchStart
             * params:
             * ArrivalId=6733&StartVoyageDate=2016-05-24&NightCount=2&Adult=2
             */
            $scope.hotelsSearchStart = function (event) {
                event.preventDefault();

                $scope.hotelsSearchForm.ArrivalId = $scope.locationFrom ? $scope.locationFrom.id : null;

                var searchUrl = HotelService.getHotelsIndexUrl($scope.hotelsSearchForm);

                $location.path(searchUrl);
            };
            /**
             * END hotelsSearchStart
             */

        }
    }
});
