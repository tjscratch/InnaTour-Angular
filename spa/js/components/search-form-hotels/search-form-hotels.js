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

            var highlightDates = function (date) {
                var month = date.getMonth() + 1;
                var dates = date.getDate() + "." + month + "." + date.getFullYear();
                var oneDay;
                if ($scope.startDate == $scope.endDate) {
                    oneDay = $scope.startDate;
                }

                if (dates == oneDay) {
                    return {
                        classes: 'one_date'
                    };
                } else {
                    if (dates == $scope.startDate) {
                        return {
                            classes: 'from_date'
                        };
                    }
                    if (dates == $scope.endDate) {
                        return {
                            classes: 'to_date'
                        };
                    }
                }
            };

            $element.find('.from_date')
                .on('changeDate', function (selected) {
                    //console.log('changeDate', selected, $scope.dontFocusToDate);
                    if (selected.date) {
                        $scope.setStartDate = selected.date;
                    } else {
                        $scope.setStartDate = $scope.setStartDate;
                        $element.find('.from_date').datepicker('setStartDate', new Date());
                        $element.find('.from_date').datepicker('setEndDate', new Date($scope.setStartDate.valueOf() + 86400000 * 28))
                    }

                    if ($scope.formType == 1) {
                        $element.find('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf() + 86400000));
                    } else {
                        $element.find('.to_date').datepicker('setStartDate', new Date(selected.date.valueOf()));
                    }
                    $element.find('.to_date').datepicker('setEndDate', new Date(selected.date.valueOf() + 86400000 * 28))

                    //fix открытия при програмном обновлении дат
                    if (!$scope.dontFocusToDate) {
                        $element.find('.to_date').focus();
                    }
                    $timeout(function () {
                        $scope.dontFocusToDate = false;
                    }, 100);
                });


            $element.find('.input-daterange').datepicker({
                    //format: "d.m.yyyy",
                    format: "d M yyyy",
                    startDate: $scope.setStartDate,
                    endDate: new Date($scope.setStartDate.valueOf() + 86400000 * 365),
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    toggleActive: true,
                    beforeShowDay: highlightDates
                })
                .on('show', function () {
                    $timeout(function () {
                        if ($scope.formType == 2) {
                            setCheckboxesAviaCalendar();
                        }
                    }, 0);
                    /**
                     * fix
                     * https://innatec.atlassian.net/browse/IN-4644
                     */
                    $(".datepicker .datepicker-switch").on('click', function (e) {
                        e.stopPropagation();
                    })
                })
                .on('hide', function () {
                    $('.datepicker').find('.datepicker-checkboxes').remove();
                })
            /**
             * end datepicker
             */


        }
    }
});
