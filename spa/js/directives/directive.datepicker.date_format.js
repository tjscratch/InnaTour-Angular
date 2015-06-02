innaAppDirectives.directive('datePickerDateFormat', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, attr, ngModel) {
            //console.log('dateDisplayFormat init');
            //ngModel.$formatters.push(function(value){
            //    console.log('formatter', value);
            //    return value;
            //});

            ngModel.$parsers.push(function (value) {
                
                if(value){
                    var date = moment(value, 'DD MMM YYYY');
                    return date.format('D.M.YYYY');
                }else{
                    return null
                }
            });

        }
    };
});