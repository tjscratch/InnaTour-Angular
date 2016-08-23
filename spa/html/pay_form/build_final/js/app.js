(function () {
    'use strict';
    
    var app = angular.module('pay_form', [
        'app.controllers',
        'ui.mask',
        'validation',
        'validation.rule'
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
    
    
    appControllers.controller("PayFormCtrl", ["$scope", "$locale", "$filter", "$injector", "$timeout", function ($scope, $locale, $filter, $injector, $timeout) {
        
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
    }]);
    
}());