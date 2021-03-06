﻿'use strict';

innaAppDirectives.directive('closePopup', ["aviaHelper", function (aviaHelper) {
    return {
        scope: {
            fnHide: '&'
        },
        controller: function () {

        },
        link: function ($scope, element, attrs) {
            function bodyClick(event) {
                var isInsideComponent = $.contains(element[0], event.target);

                //console.log('CLOSE_POPUP', element[0], event.target, isInsideComponent);

                $scope.$apply(function ($scope) {
                    if (!isInsideComponent) {
                        $scope.fnHide();
                    }
                });
            }

            $(document).on('click', bodyClick);

            $scope.$on('$destroy', function () {
                $(document).off('click', bodyClick);
            });
        }
    };
}]);

innaAppDirectives.directive('priceFormat', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter('price')(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter('price')(plainNumber));
                return plainNumber;
            });
        }
    };
}]);

innaAppDirectives.
    directive('datePicker', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                var minDate = new Date();
                minDate.setDate(minDate.getDate());

                var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                    minDate: minDate,
                    onSelect: function (dateText) {
                        scope.$apply(function (scope) {
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                    }
                });

                $(window).resize(function () {
                    element.datepicker('hide');
                    $('.Calendar-input').blur();
                });
            }
        };
    }]);


innaAppDirectives.directive('appSlider', ['$timeout', function ($timeout) {
    return {
        link: function ($scope, element, attrs) {
            //console.log('appSlider');
            $scope.$on('sliderDataLoaded', function () {
                //console.log('sliderDataLoaded');
                $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                    //jq script
                    var $banners = $('.Offer-card-banners > .offer-card-banner-item'),
                        length = $banners.length,
                        $dotsContainer = $('.Banner-dots'),
                        currentI = 0,
                        $dots,
                        animate = false;

                    if (length > 1) {
                        $banners.each(function () {
                            $dotsContainer.append('<li class="dot" />');
                        });

                        $dots = $dotsContainer.children();

                        $banners.eq(currentI).css('zIndex', 2);
                        $dots = $dotsContainer.children();
                        $dots.eq(currentI).addClass('active');

                        $dotsContainer.on('click', ':not(.active)', function (evt) {
                            if (animate) {
                                return;
                            }

                            var index = $dots.index(evt.target);

                            scroll(currentI, index)
                        });

                        setInterval($.proxy(function () {
                            var next = currentI + 1;

                            if (next === length) {
                                next = 0;
                            }

                            scroll(currentI, next);
                        }, this), 7000);
                    }

                    function scroll(fromI, toI) {
                        if (animate) {
                            return;
                        }
                        var $from = $banners.eq(fromI);
                        var $fromInfo = $from.find('.info-container');
                        var fromInfoWidth = $fromInfo.width();
                        var $to = $banners.eq(toI);
                        var $toInfo = $to.find('.info-container');
                        var toInfoWidth = $toInfo.width();
                        var $fromImg = $from.find('.img');

                        animate = true;
                        $dots
                            .removeClass('active')
                            .eq(toI)
                            .addClass('active');
                        $banners.css('zIndex', 0);
                        $to.css('zIndex', 1);
                        $fromImg.css('width', $fromImg.width());
                        $from
                            .css('zIndex', 2)
                            .animate({
                                'width': 0
                            }, {
                                duration: 1000,
                                ease: 'linear',
                                queue: false,
                                complete: function () {
                                    $to.css('zIndex', 2);
                                    $from.css({
                                        'width': '100%',
                                        'zIndex': 0
                                    });

                                    currentI = toI;
                                    animate = false
                                }
                            });

                        if ($fromInfo.length && $toInfo.length) {

                            $fromInfo
                                .css('width', fromInfoWidth)
                                .animate({
                                    'left': -fromInfoWidth
                                }, {
                                    duration: 1000,
                                    ease: 'linear',
                                    queue: false,
                                    complete: function () {
                                        $fromInfo.css({
                                            'left': 0,
                                            'width': '100%'
                                        });
                                    }
                                });

                            $toInfo
                                .css('left', toInfoWidth)
                                .animate({
                                    'left': 0
                                }, {
                                    duration: 1000,
                                    ease: 'linear',
                                    queue: false,
                                    complete: function () {
                                        $toInfo.css({
                                            'width': '100%'
                                        });
                                    }
                                });
                        }
                    }

                    function updateBannerSize() {
                        var w = $(window).width();
                        var h = $('.Offer-card-banners').height();

                        $banners.each(function (i, banner) {
                            var $banner = $(banner);
                            var $img = $banner.find('.img');
                            if ($img && $img.length > 0) {
                                var naturalWidth = $img[0].naturalWidth;
                                var naturalHeight = $img[0].naturalHeight;

                                var scaleH = w / naturalWidth;
                                var scaleV = h / naturalHeight;
                                var scale = scaleH > scaleV ? scaleH : scaleV;


                            }

                            if ($img) {
                                $img.css({
                                    width: scale * naturalWidth,
                                    height: scale * naturalHeight
                                });
                            }
                        })
                    }

                    $(window).on('resize', updateBannerSize);


                    $timeout(function () {
                        updateBannerSize();
                    }, 500, false)

                    $scope.$on('$destroy', function () {
                        $dotsContainer.off();
                        $(window).off('resize');
                    });
                }, 0, false);
            });
        }
    };
}]);


innaAppDirectives.directive('tooltip', [function () {
    return {
        link: function ($scope, element, attrs) {
            //console.log('jqUITooltip');
            var $to = $(element);
            $to.tooltip({position: {my: 'center top+22', at: 'center bottom'}});
            //$to.tooltip("open");
            $to.tooltip("disable");

            $scope.$on('$destroy', function () {
                $to.off();
            });
        }
    };
}]);

innaAppDirectives.directive('tooltipTitle', [function () {
    return {
        link: function ($scope, element, attrs) {
            var $to = $(element);
            $to.tooltip({
                position: {
                    my: "center top+10", at: 'center bottom'
                }
            });

            $scope.$on('$destroy', function () {
                $to.off();
            });
        }
    };
}]);

innaAppDirectives.directive('maskedInput', [function () {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
            //обрабатываем значение, перед присваиванием модели
            ctrl.$parsers.unshift(function (viewValue) {
                var normValue = viewValue;
                if (viewValue == '__.__.____'
                    || viewValue == '____ ______'
                    || viewValue == '_________'
                ) {
                    normValue = '';
                }
                //console.log('viewValue', viewValue, 'normValue', normValue);
                return normValue;
            });

            var listenCodeChangeEventSource = $scope.$eval(attrs.changeEvent);
            var m = attrs.mask;
            var hideField = attrs.keyPressHideField;
            var passenger = $scope[attrs.keyPressOnDocument];
            var hideFieldName = attrs.keyPressHideFieldName;

            function addMask(mask) {
                element.unmask();
                if (mask){
                    element.mask(mask, {
                        completed: function () {
                            var val = element.val();
                            $scope.$apply(function ($scope) {
                                ctrl.$modelValue = val;
                            })
                        }
                    });
                }
            }

            var placeHolder = element.attr('placeholder');

            if (listenCodeChangeEventSource) {
                $scope.$on(listenCodeChangeEventSource, function (event, result) {
                    //console.log('on', listenCodeChangeEventSource, result);
                    var value = result.value;
                    var source = result.source;

                    var needToAddMask = false;
                    if (listenCodeChangeEventSource.indexOf('DOC_CHANGED_') > -1) {
                        //маска только для паспорта РФ
                        if (value == 1) {
                            needToAddMask = true;
                            m = '9999 999999';
                            element.attr('placeholder', '1234 567890');
                            passenger[hideField][hideFieldName] = true;
                        }
                        else if (value == 2) {//загран
                            needToAddMask = true;
                            m = '999999999';
                            element.attr('placeholder', '123456789');
                            passenger[hideField][hideFieldName] = false;
                        }
                        else if (value == 3) {//св о рождении
                            needToAddMask = true;
                            m = null;
                            element.attr('placeholder', 'XI-МЮ №123456');
                            passenger[hideField][hideFieldName] = true;
                        }
                        else {
                            passenger[hideField][hideFieldName] = false;
                        }
                    }
                    else {
                        //маска только для России
                        if (value == '+7') {
                            needToAddMask = true;
                        }
                    }

                    if (needToAddMask) {
                        var elPlaceholder = element.attr('placeholder');
                        if (elPlaceholder) {
                        }
                        else {
                            element.attr('placeholder', placeHolder);
                        }

                        addMask(m);
                    }
                    else {
                        //снимаем плейсхолдер
                        element.removeAttr('placeholder');
                        $(element).removeData('isMaskAdded');
                        element.unmask();
                    }
                });
            }
            else {
                addMask(m);
            }
        }
    };
}]);

innaAppDirectives.directive('phoneInput', ['$parse', function ($parse) {
    return {
        link: function ($scope, element, attrs) {
            var $elem = $(element);

            $elem.on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;
                var shiftKey = theEvent.shiftKey;

                //console.log('key:' + key + ' shiftKey:' + shiftKey);

                var val = $elem.val();
                var selStart = $elem.get(0).selectionStart;
                var selEnd = $elem.get(0).selectionEnd;
                var supressSelectOnValue = $elem.attr('supress-select-on-value');
                if (supressSelectOnValue != null && supressSelectOnValue.length > 0) {
                    supressSelectOnValue = supressSelectOnValue.replace(/'/g, "");
                }

                //37-40 - стрелки
                //8 - backspace
                //46 - del
                //35-36 - end, home
                function isKeyInControlAndNavKeys(key) {
                    if ((key >= 37 && key <= 40) || key == 8 || key == 46 || (key >= 35 && key <= 36)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                function isKeyInNumKeys(key) {
                    if (key >= 48 && key <= 57) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }

                function isShiftPressed(key) {
                    //если нажат shift (shift + =) = (+) не считается
                    if (shiftKey == true && key != 43) {
                        return true
                    }
                    return false;
                }

                function setEndSelection() {
                    val = $elem.val();
                    $elem.get(0).selectionStart = val.length;
                    $elem.get(0).selectionEnd = val.length;
                }

                //console.log('phoneInput, key: %d, val: %s, val.len: %d, selStart: %d, selEnd: %d, supress: %s', key, val, val.length, selStart, selEnd, supressSelectOnValue);
                //48-57 - цифры
                //43 +

                //var plusEntered = (val == '+') || (val.substring(0, 1) == '+');
                //if (plusEntered) {
                //    if (selStart == selEnd) {
                //    }
                //    else {
                //        //если выделено все - то дописываем +
                //        if (selStart == 0 && selEnd == val.length) {
                //            if (supressSelectOnValue != null && val == supressSelectOnValue)//если значение +7
                //            {
                //                $elem.val(val);
                //                setEndSelection();
                //            }
                //            else {
                //                $elem.val("+");
                //                setEndSelection();
                //            }
                //        }
                //    }
                //}
                //else {
                //    $elem.val("+" + val);
                //    setEndSelection();
                //}

                //console.log('isShiftPressed(key): ', isShiftPressed(key));
                //даем вводить только цифры
                if (isShiftPressed(key) || !isKeyInNumKeys(key) && !isKeyInControlAndNavKeys(key)) {
                    //console.log('preventDefault');
                    event.preventDefault();
                    return false;
                }
            });

            $scope.$on('$destroy', function () {
                $elem.off();
            });
        }
    };
}]);

innaAppDirectives.directive('digitsInput', ['$parse', function ($parse) {
    return {
        link: function ($scope, element, attrs) {
            var $elem = $(element);
            $elem.on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;

                //введен плюс, даем вводить только цифры
                if (!(key >= 48 && key <= 57) && key != 46 && key != 8) {
                    event.preventDefault();
                    return false;
                }
            });

            $scope.$on('$destroy', function () {
                $elem.off();
            });
        }
    };
}]);

innaAppDirectives.directive('upperLatin', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModel) {

            var ruLetters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
            var latLetters = ['A', 'B', 'V', 'G', 'D', 'E', 'E', 'ZH', 'Z', 'I', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'F', 'KH', 'TS', 'CH', 'SH', 'SHCH', '', 'Y', '', 'E', 'IU', 'IA'];

            var capitalize = function (inputValue) {
                if (inputValue == null) return;

                var capitalized = inputValue.toUpperCase();

                var letters = [];
                _.each(capitalized, function (l) {
                    var index = ruLetters.indexOf(l);
                    if (index > -1) {
                        l = latLetters[index];
                    }
                    letters.push(l);
                });

                capitalized = letters.join('');

                if (capitalized !== inputValue) {
                    ngModel.$setViewValue(capitalized);
                    ngModel.$render();
                }
                return capitalized;
            };

            ngModel.$parsers.push(capitalize);
            capitalize($scope[attrs.ngModel]);// capitalize initial value
        }
    };
}]);

innaAppDirectives.directive('toUpper', ['$filter', function ($filter) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ngModel) {

            var capitalize = function (inputValue) {
                if (inputValue == null) return;

                var capitalized = inputValue.toUpperCase();

                if (capitalized !== inputValue) {
                    ngModel.$setViewValue(capitalized);
                    ngModel.$render();
                }
                return capitalized;
            }

            ngModel.$parsers.push(capitalize);
            capitalize($scope[attrs.ngModel]);// capitalize initial value
        }
    };
}]);

innaAppDirectives.directive('validateSimple', [function () {
    return {
        require: 'ngModel',
        scope: {
            validate: '&',
            key: '@',
            len: '@',
            goNext: '&'
        },
        link: function ($scope, element, attrs, ngModel) {
            function validate(isUserAction) {
                //console.log('validate');
                var type = null;
                if (isUserAction)
                    type = 'userAction';

                $scope.validate({key: $scope.key, value: ngModel.$modelValue});
                //console.log('validate end');
            };

            function safeApply(fn) {
                //console.log(arguments);
                if (!$scope.$$phase) {
                    fn();
                }
                else {
                    $scope.$apply(function () {
                        fn();
                    });
                }
            }

            element.on('blur', function () {
                //console.log('blur');
                safeApply(function () {
                    validate(true);
                });
            }).on('keypress', function (event) {
                //console.log('keypress');
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;
                if (key == 13) {//enter
                    safeApply(function () {
                        validate(true);
                    });
                }
            });
            //.on('click', function (event) {
            //    var val = ngModel.$modelValue;
            //    if (val != null && val.length > 0){
            //        $(this).select();
            //    }
            //});

            if ($scope.len != null) {
                $scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newVal, oldVal) {
                    if (newVal != null && newVal.length == $scope.len) {
                        //console.log('goNext');
                        $scope.goNext({key: $scope.key});
                    }
                })
            }

            $scope.$on('$destroy', function () {
                element.off();
            });
        }
    };
}]);

innaAppDirectives.directive('validateEventsDir', ['$rootScope', '$parse', '$interval', function ($rootScope, $parse, $interval) {
    return {
        require: 'ngModel',
        scope: {
            ngValidationModel: '=',
            validateType: '=',
            dependsOn: '=',
            dependsOn2: '=',
            validate: '&',
            supressSelectOnValue: '='
        },
        link: function ($scope, element, attrs, ctrl) {
            var isInitDone = false;
            var eid = 'dir_inp_' + _.uniqueId();
            var $elem = $(element);

            function validate(isUserAction) {
                var type = null;
                if (isUserAction)
                    type = 'userAction';

                //console.log('validate; ngValidationModel.value: %s', $scope.ngValidationModel.value);

                $scope.validate({item: $scope.ngValidationModel, type: type});
            }

            $elem.on('blur', function () {
                //убираем пробелы в начале и конце
                var trimVal = $elem.val().trim();
                $elem.val(trimVal);

                $scope.$apply(function () {
                    //console.log('validateEventsDir blur');
                    validate(true);
                });
                //}).on('change', function () {
                //    console.log('change');
                //    validate();
            }).on('keypress', function (event) {

                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;
                //console.log('key:', key);

                //для Серии и Номера документа - валидация - мгновенная
                if (key == 13) {//enter
                    $scope.$apply(function () {
                        //console.log('validateEventsDir keypress 13');
                        validate(true);
                    });
                }
            });
            //.on('click', function (event) {
            //    var val = $scope.ngValidationModel.value;

            //    if ($scope.supressSelectOnValue != null && val == $scope.supressSelectOnValue)//не выделяем
            //    {
            //        //+7 для телефона
            //    }
            //    else if (val != null && val.length > 0)
            //    {
            //        $(this).select();
            //    }
            //});


            //обновляем раз в 300мс
            var validateThrottled = _.debounce(function (isUserAction) {
                applyValidateDelayed(isUserAction);
            }, 200);

            var applyValidateDelayed = function (isUserAction) {
                $scope.$apply(function () {
                    validate(isUserAction);
                });

            };

            //когда придет модель - проставим аттрибут id элементу
            function updateAttrId(model) {
                if (!isInitDone && (model != null || $scope.validateType == 'sex')) {
                    //проставляем уникальный id элементу
                    $elem.attr("id", eid);
                    isInitDone = true;

                    //заполняем поля в модели
                    if ($scope.ngValidationModel != null &&
                        $scope.ngValidationModel.validationType == null &&
                        $scope.ngValidationModel.id == null) {

                        //console.log('key: %s, validationType: %s, value: %s',  $scope.ngValidationModel.key, $scope.ngValidationModel.validationType, $scope.ngValidationModel.value)
                        $scope.ngValidationModel.validationType = $scope.validateType;
                        $scope.ngValidationModel.id = eid;
                        //валидация зависит от поля
                        $scope.ngValidationModel.dependsOnField = $scope.dependsOn;
                        $scope.ngValidationModel.dependsOnField2 = $scope.dependsOn2;
                    }
                }
            }

            //мониторим изменения ngModel
            $scope.$watch('ngValidationModel.value', function (newVal, oldVal) {
                updateAttrId(newVal);
                //console.log('validateEventsDir watch: val: ' + newVal);

                //validateThrottled();
            });

            //fix autocomplete
            var tId = $interval(function () {
                if ($elem.val() != null && $elem.val().length > 2 && $elem.val() != ctrl.$modelValue
                    && $elem.val().indexOf('_') == -1
                ) {
                    //console.log('set value and validate', '['+ctrl.$modelValue+']', '['+$elem.val()+']');
                    ctrl.$setViewValue($elem.val());
                    validate();
                }
            }, 500);


            $scope.$on('$destroy', function () {
                $interval.cancel(tId);
                $elem.off();
            });
        }
    };
}]);

innaAppDirectives.directive('keyPressOnDocument', function ($rootScope, Validators) {
    return {
        require: 'ngModel',
        link: function ($scope, element, attrs, ctrl) {
            var $elem = $(element);

            //var hideField = attrs.keyPressHideField;
            var passenger = $scope[attrs.keyPressOnDocument];
            //var hideFieldName = attrs.keyPressHideFieldName;
            //console.log('keyPressOnDocument value', attrs.keyPressOnDocument, passenger, hideField);

            function doValidate() {
                if (passenger.citizenship.value.id == 189)//Россия
                {
                    //поездка по России
                    var tripInsideRF = $scope.isTripInsideRF($scope.item);

                    //если поездка в Украину
                    var tripInsideUkraine = $scope.isInside($scope.item, [226], true);

                    var doc_num = $elem.val();
                    //console.log('doc_num', doc_num);
                    doc_num = doc_num.replace(/\s+/g, '');

                    var isRuPassp = $scope.isCaseValid(function () {
                        Validators.ruPassport(doc_num, 'err');
                    });

                    var isBirthDoc = $scope.isCaseValid(function () {
                        Validators.birthPassport(doc_num, 'err');
                    });

                    //console.log('tripInsideRF', tripInsideRF, 'tripInsideUkraine', tripInsideUkraine, 'isRuPassp', isRuPassp, 'isBirthDoc', isBirthDoc);

                    if (tripInsideRF) {
                        if (isRuPassp || isBirthDoc) {
                            //passenger[hideField][hideFieldName] = true;

                            //console.log(passenger.doc_expirationDate.id);
                            var $to = $("#" + passenger.doc_expirationDate.id);
                            $scope.tooltipControl.close($to);

                            return;
                        }
                    }
                    else if (tripInsideUkraine) { //если в Украине
                        if (isRuPassp || isBirthDoc) {
                            setTimeout(function () {
                                var $to = $("#" + passenger.doc_series_and_number.id);
                                $scope.tooltipControl.close($to);
                                $scope.tooltipControl.init($to, 'С 1 марта 2015 года граждане РФ могут въезжать<br/>на территорию Украины только по заграничному паспорту.');
                                $scope.tooltipControl.open($to);
                            }, 100);

                            return;
                        }
                        else {
                            var $to = $("#" + passenger.doc_series_and_number.id);
                            $scope.tooltipControl.close($to);
                        }
                    }
                }

                //passenger[hideField][hideFieldName] = false;
                return;
            }

            $scope.$watch('passenger.doc_series_and_number.value', function (newVal, oldVal) {
                //console.log('doc_series_and_number.value', newVal);
                doValidate();
            });
        }
    };
});

innaAppDirectives.directive('clickOnFocus', [function () {
    return {
        link: function ($scope, element, attrs) {
            element.on('mousedown', onMouseDown);

            function onMouseDown() {
                $scope.mdown = true;
            }

            element.on('focus', onFocus);

            function onFocus() {
                var isDown = $scope.mdown;
                $scope.mdown = false;
                if (isDown) {
                }
                else { //tab
                    //generate click
                    element.data('simulate', true);
                    element.click();
                }
            }

            element.on('click', onClick);

            function onClick() {
                element.removeData('simulate');
            }

            $scope.$on('$destroy', function () {
                element.off('mousedown', onMouseDown);
                element.off('focus', onFocus);
                element.off('click', onClick);
            });
        }
    };
}]);
