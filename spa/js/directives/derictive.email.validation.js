innaAppDirectives.directive('checkEmailFormat', function () {
    var EMAIL_REGX = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/;
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ctrl) {
            if (ctrl && ctrl.$validators.email) {
                ctrl.$validators.email = function (modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGX.test(modelValue);
                };
            }
        }
    };
});