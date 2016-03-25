innaAppDirectives.directive('searchFormHotels', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/search-form-hotels/templ/form.html"),
        controller: function ($element, $scope, $timeout, $location, refactoringAppUrls, HotelService) {


            $scope.hotelsSearchForm = {};

            /**
             * BEGIN example form data
             */
            $scope.locationFrom = null;
            $scope.adultCount = 2;
            $scope.childrenCount = 0;
            $scope.hotelsSearchForm.Adult = $scope.adultCount + $scope.childrenCount;
            $scope.hotelsSearchForm.NightCount = 7;
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
             * begin datepicker
             */

            /**
             * BEGIN datapicker
             */
            $scope.setStartDate = new Date();

            $element.find('.b-search-form-hotels__input-datapicker').datepicker({
                format: "d M yyyy",
                startDate: $scope.setStartDate,
                endDate: new Date($scope.setStartDate.valueOf() + 86400000 * 365),
                language: "ru",
                autoclose: true,
                todayHighlight: true,
                toggleActive: true
            })
            /**
             * end datepicker
             */

            /**
             * BEGIN hotelsSearchStart
             * params:
             * ArrivalId=6733&StartVoyageDate=2016-05-24&NightCount=2&Adult=2
             */
            $scope.hotelsSearchStart = function (event){
                event.preventDefault();
                $scope.hotelsSearchForm.ArrivalId = $scope.locationFrom ? $scope.locationFrom.id : null;

                var searchUrl = refactoringAppUrls.URL_HOTELS +
                    [
                        $scope.hotelsSearchForm.ArrivalId,
                        $scope.hotelsSearchForm.StartVoyageDate,
                        $scope.hotelsSearchForm.NightCount,
                        $scope.hotelsSearchForm.Adult
                    ].join('--');

                $location.path(searchUrl);
            };
            /**
             * END hotelsSearchStart
             */

        }
    }
});
