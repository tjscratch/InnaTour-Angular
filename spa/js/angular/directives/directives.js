﻿﻿
'use strict';

/* Directives */

innaAppDirectives.
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
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

innaAppDirectives.
    directive('autoComplete', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                var ngModel = $parse(attrs.ngModel);
                //var ngHidModel = $parse(attrs.ngHidModel);
                var ngIdModel = $parse(attrs.ngIdModel);
                var ngUrlModel = $parse(attrs.ngUrlModel);
                var getUrl = eval(attrs.ngGetUrl);

                element.autocomplete({
                    source: getUrl,
                    minLength: 1,
                    select: function (event, ui) {
                        scope.$apply(function (scope) {
                            // Change binded variable
                            ngModel.assign(scope, ui.item.name);
                            //ngHidModel.assign(scope, ui.item.id);
                            ngIdModel.assign(scope, ui.item.id);
                            ngUrlModel.assign(scope, ui.item.url);
                        });

                        return false;
                    }
                })
                .focus(function () {
                    $(this).autocomplete("search", "");
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    return $("<li>")
                        .append("<a>(" + item.id + ")  " + item.name + "</a>")
                        .appendTo(ul);
                };
            }
        };
    }]);

innaAppDirectives.
    directive('autoCompleteDirectory', ['$parse', 'cache', 'urlHelper', function ($parse, cache, urlHelper) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ngModelCtrl) {
                var ngModel = $parse(attrs.ngModel);
                //var ngHidModel = $parse(attrs.ngHidModel);
                var ngIdModel = $parse(attrs.ngIdModel);
                var ngUrlModel = $parse(attrs.ngUrlModel);
                var getUrl = eval(attrs.ngGetUrl);

                element.autocomplete({
                    source: getUrl,
                    minLength: 1,
                    select: function (event, ui) {
                        scope.$apply(function (scope) {
                            //получаем то, что будет ключом в урле
                            var urlKey = urlHelper.getUrlFromData(ui.item);

                            // Change binded variable
                            ngModel.assign(scope, ui.item.Name);
                            //ngHidModel.assign(scope, ui.item.Id);
                            ngIdModel.assign(scope, ui.item.Id);
                            ngUrlModel.assign(scope, urlKey);
                        });

                        return false;
                    }
                })
                .focus(function () {
                    $(this).autocomplete("search", "");
                }).data("ui-autocomplete")._renderItem = function (ul, item) {
                    var code = "";
                    if (item.CodeIata != null && item.CodeIata.length > 0)
                        code = ' ' + item.CodeIata + ' ';
                    return $("<li>")
                        .append("<a>(" + item.Id + ")  " + code + item.Name + "</a>")
                        .appendTo(ul);
                };
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
                    } else {
                        return;
                    }

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
                                    $fromImg.css('width', '100%')

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


                    if (length > 1) {
                        setInterval($.proxy(function () {
                            var next = currentI + 1;

                            if (next === length) {
                                next = 0;
                            }

                            scroll(currentI, next);
                        }, this), 7000);
                    }

                    $(window).on('resize', function () {
                        var w = $(window).width();
                        var h = $('.Offer-card-banners').height();

                        $banners.each(function (i, banner) {
                            var $banner = $(banner);
                            var $img = $banner.find('.img');
                            var naturalWidth = $img[0].naturalWidth;
                            var naturalHeight = $img[0].naturalHeight;

                            var scaleH = w / naturalWidth;
                            var scaleV = h / naturalHeight;
                            var scale = scaleH > scaleV ? scaleH : scaleV;

                            $img.css({
                                width: scale * naturalWidth,
                                height: scale * naturalHeight
                            });

                        })
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
            $to.tooltip({ position: { my: 'center top+22', at: 'center bottom' } });
            //$to.tooltip("open");
            $to.tooltip("disable");            
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
        }
    };
}]);

innaAppDirectives.directive('maskedInput', ['$parse', function ($parse) {
    return {
        link: function (scope, element, attrs) {
            var m = attrs.mask;
            element.mask(m);

            //var ngModel = $parse(attrs.ngModel);

            //element.mask(m, {
            //    completed: function () {
            //        var val = this.val();
            //        console.log('completed, val: ' + val);
            //        scope.$apply(function (scope) {
            //            ngModel.assign(scope, val);
            //        })
            //    }
            //});
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

                //console.log('phoneInput, key: ' + key);
                //48-57 - цифры
                //43 +

                var plusEntered = $elem.val() == '+' || $elem.val().substring(0, 1) == '+';

                //пока не введем первый плюс
                if (!plusEntered) {
                    if (key != 43) {
                        event.preventDefault();
                        return false;
                    }
                }
                else {
                    //введен плюс, даем вводить только цифры
                    if (!(key > 48 && key < 57)) {
                        event.preventDefault();
                        return false;
                    }
                }
            });
        }
    };
}]);

innaAppDirectives.directive('validateEventsDir', ['$rootScope', '$parse', function ($rootScope, $parse) {
    return {
        require: 'ngModel',
        scope: {
            ngValidationModel: '=',
            validateType: '=',
            validate: '&'
        },
        link: function ($scope, element, attrs, ngModel) {
            var $elem = $(element);

            function validate() {
                //$scope.validate({ model: $scope.ngValidationModel, type: $scope.validateType });
                $scope.validate({ item: { model: $scope.ngValidationModel, type: $scope.validateType, $element: $elem } });
            };

            //validate();

            $elem.on('blur', function () {
                validate();
            //}).on('change', function () {
            //    validateThrottled();
            }).on('keypress', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;
                if (key == 13) {//enter
                    validate();
                }
            });


            //обновляем раз в 300мс
            var validateThrottled = _.debounce(function () {
                applyValidateDelayed();
            }, 300);

            var applyValidateDelayed = function () {
                $scope.$apply(function () {
                    validate();
                });

            };

            //мониторим изменения ngModel
            $scope.$watch(function () { return ngModel.$modelValue; }, function (newVal, oldVal) {
                //validateThrottled();
                validate();
            }, true);
        }
    };
}]);

//innaAppDirectives.directive('onTouch', function () {
//    return {
//        restrict: 'A',
//        link: function (scope, elm, attrs) {
//            var ontouchFn = scope.$eval(attrs.onTouch);
//            elm.bind('touchstart', function (evt) {
//                scope.$apply(function () {
//                    ontouchFn.call(scope, evt.which);
//                });
//            });
//            elm.bind('click', function (evt) {
//                scope.$apply(function () {
//                    ontouchFn.call(scope, evt.which);
//                });
//            });
//        }
//    };
//});
