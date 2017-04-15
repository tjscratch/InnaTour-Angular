innaAppDirectives.directive('datePickerWidget', [
    '$templateCache',
    'eventsHelper',
    '$filter',
    function ($templateCache, eventsHelper, $location, $filter) {


        /**
         * Позиционирование календаря
         * @param opt_data
         */
        function setPosition(opt_data) {
            console.log('yo', location.href.indexOf("/packages/search"))
            var coords = null;

            var inpFrom = $(".js-field-from-inp");
            var enpTo = $(".js-field-to-inp");

            var fromWidth = inpFrom.outerWidth();
            var toWidth = enpTo.outerWidth();
            var pickerWidth = 0;
            if (opt_data && opt_data.picker) {
                if (opt_data.picker.width) {
                    pickerWidth = opt_data.picker.width();
                }
                else {
                    pickerWidth = $(opt_data.picker).width();
                }
            }
            if (pickerWidth <= 0) {
                pickerWidth = 582;//ширина по-умолчанию
            }

            function getLeftFrom() {
                if (location.href.indexOf("/packages/search") > -1 || location.href.indexOf("/packages/details") > -1) {
                    return (coords.left + 867);
                }
                console.log($location.$$path);
                return (coords.left + fromWidth - (pickerWidth / 2) - (fromWidth / 5));
            }

            function getLeftTo() {
                return (coords.left - (pickerWidth / 2) + (toWidth / 5));
            }
            if (opt_data.from && location.href.indexOf("/packages/search") > -1 || opt_data.from && location.href.indexOf("/packages/details") > -1) {
                coords = utils.getCoords(inpFrom[0]);
                opt_data.picker.css({
                    left: getLeftFrom() + 'px',
                    top : coords.top + 64 + 'px'
                });
            }else if (opt_data.from) {
                coords = utils.getCoords(inpFrom[0]);
                opt_data.picker.css({
                    left: getLeftFrom() + 'px',
                    top : (coords.top + $(inpFrom[0]).height()) + 'px'
                });
            }
            else if (opt_data.to || opt_data.slide) {
                coords = utils.getCoords(enpTo[0]);

                if (opt_data.slide) {
                    $(opt_data.picker).animate({ left: getLeftTo() }, 300);
                }
                else {
                    opt_data.picker.css({
                        left: getLeftTo() + 'px',
                        top : (coords.top + $(enpTo[0]).height()) + 'px'
                    });
                }
            }
        }


        return {
            replace   : true,
            template  : function (el, attr) {
                if (attr.templ) {
                    return $templateCache.get(attr.templ);
                }
                return $templateCache.get('components/date_picker_widget.html');
            },
            scope     : {
                date1     : '=',
                date2     : '=',
                minDate   : '=',
                addButtons: '=',
                data      : '=',
                maxDate   : '=',
                typePage  : '=',
                tabIndexFrom: '=',
                tabIndexTo: '='
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
                        items   : "[data-title]",
                        content : function () {
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
                };

                /**
                 * кусок говнокода для валидаторов на билетиксе
                 */
                if (window.partners && window.partners.isFullWL()) {
                    var partner = window.partners.getPartner().name;
                }

                /*Watchers*/
                $scope.$watch('date1', function (newValue, oldValue) {
                    if (newValue instanceof Error) {
                        $scope.date1 = oldValue;
                        if (partner) {
                            $scope.Error1 = "Выберите дату отправления туда";
                        }else{
                            $scope.input1.tooltip(getPopupOptions($scope.input1)).tooltip('open');
                        }
                    }
                    else {
                        if(newValue && newValue != oldValue) {
                                    var dataLayerObj = {
                                        'event': 'UM.Event',
                                        'Data': {
                                            'Category': $scope.typePage == 'DP' ? 'Packages' : 'Avia',
                                            'Action': 'SelectDateFrom',
                                            'Label': dateHelper.ddmmyyyy2yyyymmdd(newValue),
                                            'Content': '[no data]',
                                            'Context': '[no data]',
                                            'Text': '[no data]'
                                        }
                                    };
                                    console.table(dataLayerObj);
                                    if (window.dataLayer) {
                                        window.dataLayer.push(dataLayerObj);
                                    }
                        }
                        if ($scope.datePicker) {
                            updateThrottled();
                        }
                    }
                });

                $scope.$watch('date2', function (newValue, oldValue) {
                    if (newValue instanceof Error) {
                        $scope.date2 = oldValue;
                        if (partner) {
                            $scope.Error2 = "Выберите дату отправления обратно";
                        } else {
                            $scope.input2.tooltip(getPopupOptions($scope.input2)).tooltip('open');
                        }
                    }
                    else {
                        if(newValue && newValue != oldValue) {
                                    var dataLayerObj = {
                                        'event': 'UM.Event',
                                        'Data': {
                                            'Category': $scope.typePage == 'DP' ? 'Packages' : 'Avia',
                                            'Action': 'SelectDateTo',
                                            'Label': dateHelper.ddmmyyyy2yyyymmdd(newValue),
                                            'Content': '[no data]',
                                            'Context': '[no data]',
                                            'Text': '[no data]'
                                        }
                                    };
                                    console.table(dataLayerObj);
                                    if (window.dataLayer) {
                                        window.dataLayer.push(dataLayerObj);
                                    }
                        }
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
                    if (!date || date == '01.01.1970') {
                        return '';
                    }

                    var jsDate = dateHelper.dateToJsDate(date);
                    var formattedDate = moment(jsDate).format("D MMMM");
                    //console.log('inp:', date, 'out:', jsDate, 'form:', formattedDate);
                    return formattedDate;
                    //return $filter('date')(jsDate, 'd MMMM');//работает не правильно
                };

                $scope.headClicked = false;

                $scope.setLastSel = function (lastSel) {
                    if ($scope.datePicker) {
                        //при клике будет выбрана дата от
                        $scope.datePicker.SetLastSel(lastSel);
                    }
                };

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
                        $scope.showPicker();
                        setPosition({
                            elemFromPosition: $event.currentTarget,
                            picker: $scope.datePicker,
                            from: true
                        });
                };

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
                    $scope.showPicker();
                    setPosition({
                        elemFromPosition: $event.currentTarget,
                        picker          : $scope.datePicker,
                        to              : true
                    });
                };

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
                };

                $scope.getPickerDates = function () {
                    var defaultDates = [];
                    if ($scope.date1) defaultDates.push(Date.fromDDMMYY($scope.date1));
                    else defaultDates.push(new Date());

                    if ($scope.date2) defaultDates.push(Date.fromDDMMYY($scope.date2));
                    else defaultDates.push(new Date(1));
                    return defaultDates;
                };

                //обновляем раз в 100мс
                var updateThrottled = _.debounce(function () {
                    updateDelayed();
                }, 100);
                var updateDelayed = function () {
                    if ($scope.datePicker) {
                        $scope.datePicker.DatePickerSetDate($scope.getPickerDates(), true);
                    }
                };
            }],
            link      : function ($scope, element) {
                var defaultDates = $scope.getPickerDates();

                $scope.input1 = $('.search-date-block', element).eq(0);
                $scope.input2 = $('.search-date-block', element).eq(1);

                var options = {
                    flat             : true,
                    date             : defaultDates,
                    initDateToIsSet  : ($scope.date1 != null),
                    initDateFromIsSet: ($scope.date2 != null),
                    calendars        : 2,
                    mode             : 'range',
                    format           : 'd.m.Y',
                    starts           : 1,
                    onShow           : function () {
                        return true;
                    },
                    onHide           : function () {
                        return true;
                    },
                    onChange         : function (formated, dates, el, lastSel, initDateFromIsSet) {

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

                                setPosition({ slide: true, picker: $(el) });


                                //если выбираем дату туда, и стоит галка в одну сторону
                                if ($scope.data != null && $scope.data.isOneWaySelected) {
                                    $scope.setLastSel(true);
                                    $scope.isFromSelecting = true;
                                    $scope.isOpen = false;
                                }
                            }
                        });

                        $scope.input1.val($scope.long($scope.date1));
                        $scope.input2.val($scope.long($scope.date2));

                        try {
                            $scope.input1.tooltip('destroy');
                            $scope.Error1 = false;
                        } catch (e) {
                        }
                        try {
                            $scope.input2.tooltip('destroy');
                            $scope.Error2 = false;
                        } catch (e) {
                        }
                    }
                };

                //console.log('FORM::MAX_DATE', $scope.maxDate);

                if ($scope.maxDate) {
                    var today = new Date();
                    var leftLimit = new Date(+today);

                    leftLimit.setDate(1);

                    options.limits = [leftLimit, $scope.maxDate];
                }

                $scope.datePicker = $('.js-datepicker', element).DatePicker(options);

                // Вставляем календарь в body
                document.body.appendChild($scope.datePicker[0]);

                $(document).click(function (event) {
                    var isInsideComponent = $.contains(element.get(0), event.target);

                    $scope.$apply(function ($scope) {
                        if (isInsideComponent && $scope.headClicked) {
                            $scope.headClicked = false;
                            //ничего не делаем, уже кликнули по шапке
                        } else {
                            $scope.isOpen = isInsideComponent;
                        }
                    });
                });

                $scope.hidePicker = function (evt) {
                    //console.log('$scope.hidePicker');
                    if ($scope.datePicker) {
                        setPosition({
                            picker: $scope.datePicker
                        });
                        if ($(window).scrollTop() >= 100) {
                            $scope.datePicker.hide();
                            $(document).off('scroll', $scope.hidePicker);
                        }
                    }
                };

                $scope.showPicker = function () {
                    //фикс выбора даты - для WL-full скролим страницу вниз
                    //при открытии
                    if ($scope.isOpen && window.partners && window.partners.isFullWL()) {
                        window.partners.scrollToChildSelector();
                    }

                    $scope.datePicker.show();
                    $(document).on('scroll', $scope.hidePicker);
                };

                $(document).on('scroll', $scope.hidePicker);

                $scope.$on('$destroy', function () {
                    $(document).off('scroll', $scope.hidePicker);
                    $scope.datePicker.remove();
                    $scope.datePicker = null;
                });
            }
        }
    }]);