innaAppDirectives.directive('datePickerWidget', [function(){
    return {
        templateUrl: '/spa/templates/components/date_picker_widget.html',
        scope: {
            date: '='
        },
        controller: ['$scope', function($scope){
            /*Methods*/
            $scope.short = function(ddmmyy) {
                if(!ddmmyy) return '';

                var bits = ddmmyy.split('.');
                return [bits[0], bits[1]].join('.');
            }
        }],
        link: function(scope, element, attrs){
            var checker = scope.$eval(attrs.interval);
            var caption = attrs.caption;
            var uiWidget = $('.Calendar-input', element);

            uiWidget.datepicker({
                minDate: new Date(),
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
                    uiWidget.datepicker("show");
                    uiWidget.focus();
                } else {
                    uiWidget.datepicker("hide");
                    uiWidget.blur();
                }
            });
        }
    }
}])