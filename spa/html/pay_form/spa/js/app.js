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
        var expression = {
            //passport: /^.*([a-zA-Z]).*([а-яА-ЯёЁ])(\D)*(\d{6})+$/,
            month: function (value, scope, element, attrs, param) {
                if (value >= 1 && value <= 12) {
                    return true;
                } else {
                    return false;
                }
            },
            year: function (value, scope, element, attrs, param) {
                if (value >= 0 && value <= 99) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        
        var validMsg = {
            month: {
                error: 'Укажите месяц от 1 до 12',
                success: 'Ок'
            },
            year: {
                error: 'Укажите год от 0 до 99',
                success: 'Ок'
            }
        };
        
        $validationProvider
            .setExpression(expression)
            .setDefaultMsg(validMsg);
        
        $validationProvider.showSuccessMessage = false; // or true(default)
        //$validationProvider.showErrorMessage = false; // or true(default)
        
        $validationProvider.validCallback = function (element) {
            //console.log(element)
            //element.parents('.validator-container:first').removeClass('has-error').addClass('has-success-tick');
        };
        
    }]);
    
    var appControllers = angular.module('app.controllers', []);
    var appDirectives = angular.module('app.directives', []);
    
    
    appControllers.controller("PayFormCtrl", function ($scope, $locale, $filter, $injector, $timeout) {
        
        //var monthInput = angular.element(document).find('#month');
        var monthInput = document.getElementById('monthInput');
        var yearInput = document.getElementById('yearInput');
        var cvsInput = document.getElementById('cvsInput');
        var formBtn = document.getElementById('formBtn');
        
        $scope.ccForm = {}
        
        $scope.validationValidHandler = function (val, data) {
            $timeout(function () {
                if (val == 'number' && data.$valid) {
                    if ($scope.ccForm.number.length == 16) {
                        if (/^2/.test($scope.ccForm.number)) {
                            monthInput.focus();
                        } else if (/^4/.test($scope.ccForm.number)) {
                            monthInput.focus();
                        } else if (/^5/.test($scope.ccForm.number)) {
                            monthInput.focus();
                        }
                    } else if ($scope.ccForm.number.length == 18) {
                        monthInput.focus();
                    }
                }
                if (val == 'month') {
                    if (data.$valid) {
                        yearInput.focus();
                    } else {
                        $scope.ccForm.month = $scope.ccForm.month ? $scope.ccForm.month.substr(0, 2) : null;
                    }
                }
                if (val == 'year' && data.$valid) {
                    cvsInput.focus();
                } else {
                    $scope.ccForm.year = $scope.ccForm.year ? $scope.ccForm.year.substr(0, 2) : null;
                }
                
                if (val == 'cvc') {
                    var number = /^\d+$/;
                    
                    if (data.$valid) {
                        formBtn.focus();
                    } else {
                        if (number.test($scope.ccForm.cvc)) {
                            $scope.ccForm.cvc = $scope.ccForm.cvc ? $scope.ccForm.cvc.substr(0, 4) : null;
                        } else {
                            $scope.ccForm.cvc = null;
                        }
                    }
                }
                
            }, 0);
        };
        
        var $validationProvider = $injector.get('$validation');
        
        $scope.form = {
            checkValid: $validationProvider.checkValid,
            submit: function (e, form) {
                $validationProvider.validate(form);
            }
        };
        
        
        $scope.currentYear = parseInt($filter('date')(new Date(), "yy"));
        $scope.currentMonth = new Date().getMonth() + 1;
    });
    
    
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