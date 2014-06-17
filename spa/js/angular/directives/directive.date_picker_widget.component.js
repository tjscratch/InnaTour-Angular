innaAppDirectives.directive('datePickerWidget', [
    '$templateCache',
    'eventsHelper',
    '$filter',
    function ($templateCache, eventsHelper, $filter) {
        return {
            replace: true,
            template: $templateCache.get('components/date_picker_widget.html'),
            scope: {
                date1: '=',
                date2: '=',
                minDate: '=',
                addButtons: '=',
                data: '='
            },
            controller: ['$scope', function ($scope) {
                /*Properties*/
                $scope.isOpen = false;
                //флаг - выбираем дату туда, или дату обратно
                $scope.isFromSelecting = true;//дата туда

                function getPopupOptions($element) {
                    var popupOptions = {
                        position: {
                            my: 'center top+22',
                            at: 'center bottom'
                        },
                        items: "[data-title]",
                        content: function () {
                            return $element.data("title");
                        }
                    };
                    return popupOptions;
                }

                //direction: 'to' 'back'
                $scope.roamingChanged = function (direction) {
                    if ($scope.data != null && $scope.data.isBackRoamingSelected != null && $scope.data.isToRoamingSelected != null) {
                        if (direction == 'to') {
                            $scope.data.isBackRoamingSelected = $scope.data.isToRoamingSelected;
                        }
                        else {
                            $scope.data.isToRoamingSelected = $scope.data.isBackRoamingSelected;
                        }
                    }
                }

                /*Watchers*/
                $scope.$watch('date1', function (newValue, oldValue) {
                    if (newValue instanceof Error) {
                        $scope.date1 = oldValue;

                        $scope.input1.tooltip(getPopupOptions($scope.input1)).tooltip('open');
                    }
                    else {
                        if ($scope.datePicker) {
                            updateThrottled();
                        }
                    }
                });

                $scope.$watch('date2', function (newValue, oldValue) {
                    if (newValue instanceof Error) {
                        $scope.date2 = oldValue;

                        $scope.input2.tooltip(getPopupOptions($scope.input2)).tooltip('open');
                    }
                    else {
                        if ($scope.datePicker) {
                            updateThrottled();
                        }
                    }
                });

                /*Methods*/
                $scope.short = function (date) {
                    if (!date || date == '01.01.1970') return '';

                    var bits = date.split('.');
                    return [bits[0], bits[1]].join('.');
                };

                $scope.long = function (date) {
                    if (!date || date == '01.01.1970') return '';

                    var jsDate = dateHelper.dateToJsDate(date);

                    return $filter('date')(jsDate, 'd MMMM');
                };

                $scope.headClicked = false;

                function datepickerPosition(evt){
                    var coords =  utils.getCoords(evt.currentTarget);

                    $scope.datePicker.css({
                        left : (coords.left - 250)+'px',
                        top : (coords.bottom)+'px'
                        /*"-webkit-transform": "translate3d(" + (coords.left - 250) + "px, 0px, 0px)",
                        "-moz-transform": "translate3d(" + (coords.left - 250) + "px, 0px, 0px)",
                        "-ms-transform": "translate3d(" + (coords.left - 250) + "px, 0px, 0px)",
                        "transform": "translate3d(" + (coords.left - 250) + "px, 0px, 0px)"*/
                    });
                }

                $scope.setLastSel = function (lastSel) {
                    if ($scope.datePicker) {
                        //при клике будет выбрана дата от
                        $scope.datePicker.SetLastSel(lastSel);
                    }
                }

                $scope.toggleFrom = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;

                    if ($scope.isFromSelecting) {
                        $scope.isOpen = !$scope.isOpen;
                    }
                    else {
                        $scope.isOpen = true;
                    }
                    $scope.isFromSelecting = true;
                    //при клике будет выбрана дата от
                    $scope.setLastSel(false);
                    datepickerPosition($event);
                }

                $scope.toggleTo = function ($event) {
                    eventsHelper.preventDefault($event);
                    $scope.headClicked = true;

                    if (!$scope.isFromSelecting) {
                        $scope.isOpen = !$scope.isOpen;
                    } else {
                        $scope.isOpen = true;
                    }
                    $scope.isFromSelecting = false;
                    //при клике будет выбрана дата до
                    $scope.setLastSel(true);
                    datepickerPosition($event);
                }

                $scope.oneWayChanged = function () {
                    //console.log($scope.data.isOneWaySelected);
                    if ($scope.data.isOneWaySelected) {
                        //сбрасываем дату обратно
                        $scope.date2 = '';

                        //убираем тултип
                        try {
                            $scope.input2.tooltip('destroy');
                        } catch (e) {
                        }
                    }
                }

                $scope.getPickerDates = function () {
                    var defaultDates = [];
                    if ($scope.date1) defaultDates.push(Date.fromDDMMYY($scope.date1));
                    else defaultDates.push(new Date());

                    if ($scope.date2) defaultDates.push(Date.fromDDMMYY($scope.date2));
                    else defaultDates.push(new Date(1));
                    return defaultDates;
                }

                //обновляем раз в 100мс
                var updateThrottled = _.debounce(function () {
                    updateDelayed();
                }, 100);
                var updateDelayed = function () {
                    $scope.datePicker.DatePickerSetDate($scope.getPickerDates(), true);
                };
            }],
            link: function ($scope, element) {
                var defaultDates = $scope.getPickerDates();


                $scope.input1 = $('.search-date-block', element).eq(0);
                $scope.input2 = $('.search-date-block', element).eq(1);

                $scope.datePicker = $('.js-datepicker', element).DatePicker({
                    flat: true,
                    date: defaultDates,
                    initDateToIsSet: ($scope.date1 != null),
                    initDateFromIsSet: ($scope.date2 != null),
                    calendars: 2,
                    mode: 'range',
                    format: 'd.m.Y',
                    starts: 1,
                    onChange: function (formated, dates, el, lastSel, initDateFromIsSet) {
                        $scope.$apply(function ($scope) {
                            $scope.date1 = formated[0];

                            if (initDateFromIsSet) {
                                //проставляем, только если руками выбрали дату до
                                $scope.date2 = formated[1];
                            }

                            $scope.isFromSelecting = lastSel;
                            if (lastSel) {
                                $scope.isOpen = false;

                                //если выбираем дату обратно, и установлена галка в одну сторону - снимаем ее
                                if ($scope.data != null && $scope.data.isOneWaySelected) {
                                    $scope.data.isOneWaySelected = false;
                                }
                            }
                            else {
                                //если выбираем дату туда, и стоит галка в одну сторону
                                if ($scope.data != null && $scope.data.isOneWaySelected) {
                                    $scope.setLastSel(true);
                                    $scope.isFromSelecting = true;
                                    $scope.isOpen = false;
                                }
                            }
                        });

                        try {
                            $scope.input1.tooltip('destroy');
                        } catch (e) {
                        }
                        try {
                            $scope.input2.tooltip('destroy');
                        } catch (e) {
                        }
                    }
                });

                // Вставляем календарь в body
                document.body.appendChild($scope.datePicker[0]);

                $(document).click(function (event) {
                    var isInsideComponent = $.contains(element.get(0), event.target);

                    //console.log('click', isInsideComponent);

                    //$scope.$apply(function($scope){
                    //    $scope.isOpen = isInsideComponent;
                    //});

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });
            }
        }
    }])