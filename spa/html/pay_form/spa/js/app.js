(function () {
    'use strict';
    
    var app = angular.module('pay_form', [
        'app.controllers',
        'app.directives',
        'ui.mask',
        'validation',
        'validation.rule',
        'timer'
    ]);
    
    app.config(['$validationProvider', function ($validationProvider) {
        $validationProvider.showSuccessMessage = false; // or true(default)
        //$validationProvider.showErrorMessage = false; // or true(default)
    }]);
    
    var appControllers = angular.module('app.controllers', []);
    var appDirectives = angular.module('app.directives', []);
    
    
    appControllers.controller("PayFormCtrl", function ($scope, $locale, $filter, $injector, $timeout) {
        
        //var monthInput = angular.element(document).find('#month');
        var monthInput = document.getElementById('monthInput');
        var yearInput = document.getElementById('yearInput');
        var cvsInput = document.getElementById('cvsInput');
        
        $scope.ccForm = {}
        
        $scope.$watch('ccForm.number', function (data) {
            if (data) {
                monthInput.focus();
            }
        });
        
        $scope.$watch('ccForm.month', function (data) {
            if (data) {
                yearInput.focus();
            }
        });
        
        $scope.$watch('ccForm.year', function (data) {
            if (data) {
                cvsInput.focus();
            }
        });
        
        var $validationProvider = $injector.get('$validation');
        
        $scope.form = {
            checkValid: $validationProvider.checkValid,
            submit: function (e, form) {
                $validationProvider.validate(form);
            }
        };
        
        
        $scope.currentYear = parseInt($filter('date')(new Date(), "yy"));
        $scope.currentMonth = new Date().getMonth() + 1;
        //$scope.months = $locale.DATETIME_FORMATS.MONTH
        $scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        $scope.ccinfo = {type: undefined};
        $scope.save = function (data) {
            console.log(data)
            if ($scope.paymentForm.$valid) {
                console.log(data) // valid data saving stuff here
            }
        }
        
    })
    
    
    appDirectives.directive('validationNumber', function () {
        var isValid = function (s) {
            return s && s.length > 5 && /\D/.test(s) && /\d/.test(s);
        };
        
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModelCtrl) {
                
                console.log(scope)
                console.log(ngModelCtrl)
                ngModelCtrl.$parsers.unshift(function (viewValue) {
                    ngModelCtrl.$setValidity('strongPass', isValid(viewValue));
                    return viewValue;
                });
                
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    ngModelCtrl.$setValidity('strongPass', isValid(modelValue));
                    return modelValue;
                });
            }
        };
    });
    
    
    appDirectives.directive('creditCardType', function () {
            var directive =
            {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (value) {
                        scope.ccinfo.type =
                            (/^5[1-5]/.test(value)) ? "mastercard"
                                : (/^4/.test(value)) ? "visa"
                                : (/^3[47]/.test(value)) ? 'amex'
                                : (/^1/.test(value)) ? 'test'
                                : (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/.test(value)) ? 'discover'
                                : undefined
                        ctrl.$setValidity('invalid', !!scope.ccinfo.type)
                        return value
                    })
                }
            };
            return directive
        }
    )
    
    appDirectives.directive('cardExpiration', function () {
            var directive =
            {
                require: 'ngModel'
                , link: function (scope, elm, attrs, ctrl) {
                scope.$watch('[ccinfo.month,ccinfo.year]', function (value) {
                    ctrl.$setValidity('invalid', true)
                    if (scope.ccinfo.year == scope.currentYear
                        && scope.ccinfo.month <= scope.currentMonth
                    ) {
                        ctrl.$setValidity('invalid', false)
                    }
                    return value
                }, true)
            }
            }
            return directive
        }
    )
    
    appDirectives.filter('range', function () {
            var filter =
                function (arr, lower, upper) {
                    for (var i = lower; i <= upper; i++) {
                        arr.push(i);
                    }
                    return arr;
                }
            return filter
        }
    )
    
    appDirectives.directive('angularMask', function () {
        return {
            restrict: 'A',
            link: function ($scope, el, attrs) {
                var format = attrs.angularMask;
                
                function mask(el, format) {
                    var text = el;
                    var value = text.value;
                    var newValue = "";
                    for (var vId = 0, mId = 0; mId < format.length;) {
                        if (mId >= value.length) {
                            break;
                        }
                        if (format[mId] == '0' && value[vId].match(/[0-9]/) === null) {
                            break;
                        }
                        while (format[mId].match(/[0\*]/) === null) {
                            if (value[vId] == format[mId]) {
                                break;
                            }
                            newValue += format[mId++];
                        }
                        newValue += value[vId++];
                        mId++;
                    }
                    text.value = newValue;
                }
                
                el.bind('keyup keydown', function (e) {
                    var _format = format;
                    var _el = el[0];
                    mask(_el, _format);
                });
            }
        };
    });
    
    
}());