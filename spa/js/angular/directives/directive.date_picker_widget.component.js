innaAppDirectives.directive('datePickerWidget', [function(){
    return {
        replace: true,
        templateUrl: '/spa/templates/components/date_picker_widget.html',
        scope: {
            date1: '=',
            date2: '=',
            minDate: '='
        },
        controller: ['$scope', '$timeout', function($scope, $timeout){
            /*Properties*/
            $scope.isOpen = false;

            /*Methods*/
            $scope.short = function(date) {
                if(!date) return '';

                var bits = date.split('.');
                return [bits[0], bits[1]].join('.');
            };
        }],
        link: function(scope, element, attrs){
            $('.js-datepicker', element).DatePicker({
                flat: true,
                date: new Date(),
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