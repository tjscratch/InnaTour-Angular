innaAppDirectives.directive('datePickerWidget', [function(){
    return {
        replace: true,
        templateUrl: '/spa/templates/components/date_picker_widget.html',
        scope: {
            date1: '=',
            date2: '=',
            minDate: '='
        },
        controller: ['$scope', function($scope){
            /*Properties*/
            $scope.isOpen = false;

            /*Watchers*/
            $scope.$watch('date1', function(newValue, oldValue){
                if(newValue instanceof Error) {
                    $scope.date1 = oldValue;

                    $scope.input.tooltip({
                        position: {
                            my: 'center top+22',
                            at: 'center bottom'
                        }
                    }).tooltip('open');
                }
            });

            /*Methods*/
            $scope.short = function(date) {
                if(!date) return '';

                var bits = date.split('.');
                return [bits[0], bits[1]].join('.');
            };
        }],
        link: function(scope, element){
            var defaultDates = [];

            if(scope.date1) defaultDates.push(Date.fromDDMMYY(scope.date1));
            else defaultDates.push(new Date());

            if(scope.date2) defaultDates.push(Date.fromDDMMYY(scope.date2));
            else defaultDates.push(new Date());

            scope.input = $('.search-date-block', element).eq(0);

            $('.js-datepicker', element).DatePicker({
                flat: true,
                date: defaultDates,
                calendars: 2,
                mode: 'range',
                format: 'd.m.Y',
                starts: 1,
                onChange: function(formated, dates){
                    console.log(formated);

                    scope.$apply(function($scope){
                        $scope.date1 = formated[0];
                        $scope.date2 = formated[1];
                    });

                    try {
                        scope.input.tooltip('destroy');
                    } catch(e) {}
                }
            });

            $(document).click(function(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                scope.$apply(function($scope){
                    $scope.isOpen = isInsideComponent;
                });
            });
        }
    }
}])