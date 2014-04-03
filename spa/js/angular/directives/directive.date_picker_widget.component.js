innaAppDirectives.directive('datePickerWidget', [function(){
    return {
        templateUrl: '/spa/templates/components/date_picker_widget.html',
        scope: {
            date: '=',
            minDate: '='
        },
        controller: ['$scope', '$timeout', function($scope, $timeout){
            /*Methods*/
            $scope.short = function(ddmmyy) {
                if(!ddmmyy) return '';

                var bits = ddmmyy.split('.');
                return [bits[0], bits[1]].join('.');
            };

            /*Watchers*/
            $scope.$watch('minDate', function (newVal) {
                var date;

                if (newVal) {
                    date = Date.fromDDMMYY(newVal);
                } else {
                    date = new Date();
                }

                $scope.uiWidget.datepicker("option", "minDate", date);
            });
        }],
        link: function(scope, element, attrs){
            var checker = scope.$eval(attrs.interval);
            var caption = attrs.caption;
            scope.uiWidget = $('.Calendar-input', element);

            scope.uiWidget.datepicker({
                minDate: scope.minDate && Date.fromDDMMYY(scope.minDate) || new Date(),
                onSelect: function (dateText) {
                    scope.$apply(function (scope) {
                        scope.date = dateText;
                    });
                },
                afterShow: function(){
                    var calendarNode = $('#'+$.datepicker._mainDivId);
                    var headerNode = $("<div class='calendar-head'></div>");

                    if(caption) {
                        headerNode.prepend("<span class='caption'>" + caption + "</span>")
                    }

                    if(checker) {
                        //TODO
                    }

                    calendarNode.prepend(headerNode);
                }
            });

            $(document).click(function(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                if(isInsideComponent) {
                    scope.uiWidget.datepicker("show");
                    scope.uiWidget.focus();
                } else {
                    scope.uiWidget.datepicker("hide");
                    scope.uiWidget.blur();
                }
            });
        }
    }
}])