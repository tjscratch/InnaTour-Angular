innaAppDirectives.directive('searchFormHotels', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/search-form-hotels/templ/form.html"),
        controller: function ($element, $scope, $timeout, HotelService) {


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
             * BEGIN adultCount
             */
            $scope.adultCount = 2;
            $scope.childrenCount = 0;
            /**
             * END adultCount
             */


        }
    }
});
