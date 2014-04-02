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
            var uiWidget = $('.Calendar-input', element);
            var doc = $(document);

            $(document).click(function(event){
                var isInsideComponent = !!$(event.target).closest(element).length;

                if(isInsideComponent) {
                    console.log('inside');
                    uiWidget.datepicker("show");
                    uiWidget.focus();
                } else {
                    console.log('outside');
                    uiWidget.datepicker("hide");
                    uiWidget.blur();
                }
            });
        }
    }
}])