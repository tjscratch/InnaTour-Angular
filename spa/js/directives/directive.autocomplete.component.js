innaAppDirectives.directive('dropdownInput', [
    '$templateCache',
    'eventsHelper',
    '$timeout',
    function ($templateCache, eventsHelper, $timeout) {
        return {
            replace   : true,
            template  : $templateCache.get('components/dropdown_input.html'),
            scope     : {
                provideSuggestCallback: '=', //callback for ngChange
                suggest               : '=', //list of suggested objects
                result                : '=',
                setResultCallback     : '&',
                setResultItem         : '=',
                theme                 : '@',
                askForData            : '=',
                placeholder           : '@',
                onError               : '@',
                withCountry           : '=',
                event                 : '@',
                tabIndex              : '='
            },
            controller: ['$scope', '$timeout', function ($scope, $timeout) {
                /*Properties*/
                $scope.isOpened = false;
                $scope.needClose = false;

                $scope.getPlaceholder = function () {
                    if ($scope.placeholder == null || $scope.placeholder.length == 0)
                        return 'Откуда';
                    else
                        return $scope.placeholder;
                };

                $scope.doResultCallback = function (item) {
                    if ($scope.setResultCallback) {
                        $scope.setResultCallback({ 'item': item });
                    }
                };

                function init(item) {
                    //console.log('init');
                    if ($scope.input) {
                        $scope.input.val(item.Name);
                    }
                    $scope.result = item.Id;
                }

                if ($scope.event) {
                    $scope.$on($scope.event, function (event, id) {
                        //console.log('dropdownInput event, id:', id);
                        if (id != null) {
                            if (id instanceof Error) {
                                // console.log(id)
                                $scope.input.tooltip({
                                    position: {
                                        my: 'center top+22',
                                        at: 'center bottom'
                                    },
                                    items   : "[data-title]",
                                    content : function () {
                                        return $scope.input.data("title");
                                    }
                                }).tooltip('open');
                            } else {
                                if (id != null && id != 'null' && $scope.askForData) {
                                    //console.log('askForDataByID', id);
                                    askForDataByID(id);
                                }
                            }
                        }
                    });
                }

                //$scope.supressBlur = false;

                /*Events*/
                //doNotUpdateInputText - сделано, чтобы визуально элемент еще можно было выбирать, а фактически значение прокидывается сразу, при индикации выбранного в саджесте
                $scope.setCurrent = function ($event, option, airport, doNotUpdateInputText) {
                    //console.log('$scope.setCurrent');
                    $timeout.cancel($scope.timeoutId);

                    if(option.CodeIata) {
                        $scope.cityCode = option.CodeIata;
                    }

                    //запрещаем баблинг
                    $event && eventsHelper.preventBubbling($event);

                    if (option != null) {
                        if (airport != null) {
                            if (!doNotUpdateInputText) {
                                $scope.input.val(airport.Name);
                            }

                            $scope.result = airport.Id;
                            $scope.doResultCallback(airport);
                        }
                        else {
                            var valueBits = [option.Name];
                            if ($scope.withCountry) {
                                valueBits.push(option.CountryName);
                            }

                            if (!doNotUpdateInputText) {
                                $scope.input.val(valueBits.join(', '));
                            }

                            $scope.result = option.Id;
                            $scope.doResultCallback(option);
                        }
                    }

                    if (!doNotUpdateInputText) {
                        $scope.isOpened = false;
                    }
                };

                function askForDataByID(newValue) {
                    $scope.askForData(newValue, function (data) {
                        $scope.setCurrent(null, data);
                    });
                }


                if (window.partners && window.partners.getPartner()) {
                    var partner = window.partners.getPartner().name;
                }

                $scope.isEnableClearIcon = false;

                /*Watchers*/

                $scope.$watch('currentCity', function (newValue) {
                    if(newValue) {
                        $scope.isEnableClearIcon = true;
                    } else {
                        $scope.isEnableClearIcon = false;
                    }
                });

                $scope.clearCityField = function () {
                    var action = '';

                    if($scope.placeholder == 'Откуда') {
                        action = 'RemoveCityFrom';
                    } else if ($scope.placeholder == 'Куда') {
                        action = 'RemoveCityTo';
                    }
                    var dataLayerObj = {
                        'event': 'UM.Event',
                        'Data': {
                            'Category': 'Avia',
                            'Action': action ? action : '[no data]',
                            'Label':  $scope.cityCode ? $scope.cityCode : '[no data]',
                            'Content': '[no data]',
                            'Context': '[no data]',
                            'Text': '[no data]'
                        }
                    }
                    console.table(dataLayerObj);
                    if (window.dataLayer) {
                        window.dataLayer.push(dataLayerObj);
                    }

                    $scope.result = null;
                    $scope.selectionControl.selectedIndex = null;
                    $scope.currentCity = null;
                    $scope.cityCode = null;
                    if($scope.isEnableClearIcon == true) {
                        $scope.isEnableClearIcon = false;
                    } else {
                        $scope.isEnableClearIcon = true
                    }
                };

                $scope.$watch('result', function (newValue, oldValue) {
                    if (newValue instanceof Error) {
                        $scope.result = oldValue;
                        if (partner === 'biletix') {
                            $scope.Error = $scope.input.data("title");
                        } else {
                            $scope.input.tooltip({
                                position: {
                                    my: 'center top+22',
                                    at: 'center bottom'
                                },
                                items   : "[data-title]",
                                content : function () {
                                    return $scope.input.data("title");
                                }
                            }).tooltip('open');
                        }
                    } else if (!$scope.input.val()) {
                        if (newValue != null && newValue != 'null' && $scope.askForData) {
                            //console.log('askForDataByID', newValue);
                            askForDataByID(newValue);
                            $scope.isEnableClearIcon = true;
                        }
                    }
                });

                $scope.$on('DYNAMIC.locationChange', function (event, routeParams) {
                    $scope.$root._dynamicSearchFormInvisible = true;

                    $timeout(function () {
                        $scope.$root._dynamicSearchFormInvisible = false;
                    }, 1);
                });
            }],

            link: function ($scope, elem, attrs) {
                $scope.input = $('input[type="text"]', elem);



                function selectionControl() {
                    var self = this;
                    self.selectedIndex = 0;
                    self.list = [];
                    self.item = function (item, option, airport) {
                        var res = {
                            item   : item,
                            option : option,
                            airport: airport
                        };
                        return res;
                    };
                    self.init = function () {
                        //console.log('selectionControl.init');
                        self.list = [];
                        self.selectedIndex = 0;

                        //console.log('init, suggest', $scope.suggest);
                        if ($scope.suggest != null) {
                            //items
                            for (var i = 0; i < $scope.suggest.length; i++) {
                                var item = $scope.suggest[i];
                                //self.list.push(item);
                                self.list.push(new self.item(item, item, null));
                                if (item.Airport != null) {
                                    //airports
                                    for (var j = 0; j < item.Airport.length; j++) {
                                        var airPort = item.Airport[j];
                                        //self.list.push(airPort);
                                        self.list.push(new self.item(airPort, item, airPort));
                                    }
                                }
                            }
                        }

                        //проставляем первый выбранный
                        if (self.list.length > 0) {
                            self.list[0].item.isSelected = true;
                            self.scrollToFirstItem();
                            self.updateInputText();
                            //console.log(self.list);
                        }
                    };
                    self.isItemSelected = function (item) {
                        return (item.isSelected == true);
                    };
                    self.selectNext = function () {
                        if (self.list.length > 0) {
                            if ((self.selectedIndex + 1) < self.list.length) {
                                self.list[self.selectedIndex].item.isSelected = false;
                                self.selectedIndex++;
                                self.list[self.selectedIndex].item.isSelected = true;
                                self.scrollToItem();
                                self.updateInputText();
                            }
                        }
                    };
                    self.selectPrev = function () {
                        if (self.list.length > 0) {
                            if ((self.selectedIndex - 1) >= 0) {
                                self.list[self.selectedIndex].item.isSelected = false;
                                self.selectedIndex--;
                                self.list[self.selectedIndex].item.isSelected = true;
                                self.scrollToItem();
                                self.updateInputText();
                            }
                        }
                    };
                    self.scrollToItem = function () {
                        var ind = self.selectedIndex;
                        //скролим где-то в середину (во всю высоту влезает где-то 10 итемов)
                        ind = ind - 5;
                        if (ind >= 0) {
                            var container = $(".search-autocomplete:eq('0')", $scope.input.parent());
                            var scrollTo = $(".search-autocomplete-block:eq(" + ind + ")", container);
                            if (scrollTo.length > 0) {
                                var scrollToVal = scrollTo.offset().top - container.offset().top + container.scrollTop();

                                container.animate({
                                    scrollTop: scrollToVal
                                }, 50);
                            }
                            //log('scrollToItem: ' + ind);
                        }
                    };
                    self.scrollToFirstItem = function () {
                        var container = $(".search-autocomplete:eq('0')", $scope.input.parent());
                        container.animate({
                            scrollTop: 0
                        }, 50);
                    };
                    self.updateInputText = function () {
                        //$scope.input.val(self.list[self.selectedIndex].item.Name);
                        self.setSelected(true);
                    };
                    self.setSelected = function (doNotUpdateInputText) {
                        var i = self.list[self.selectedIndex];

                        //console.log('setSelected::i', i);

                        if (i) {
                            $scope.setCurrent(null, i.option, i.airport, doNotUpdateInputText);
                        }
                    }
                }

                $scope.selectionControl = new selectionControl();

                $scope.$watch('suggest', function (newValue, oldValue) {
                    if (newValue.length > 0 && newValue !== oldValue) {
                        $scope.selectionControl.init();
                        $scope.isOpened = true;
                    }else{
                        $scope.isOpened = false;
                    }
                }, false);

                //обновляем раз в 300мс
                var getThrottled = _.debounce(function (preparedText, value) {
                    getDelayed(preparedText, value);
                }, 300);

                var getDelayed = function (preparedText, value) {
                    $scope.$apply(function ($scope) {
                        if (preparedText != null && preparedText.length >= 2) {
                            //console.log('getDelayed: prepText: %s, value: %s', preparedText, value);
                            $scope.provideSuggestCallback(preparedText, value);
                        }
                    });
                };

                /*Events*/
                function select() {
                    //console.log('SELECT');
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpened) {
                            $scope.selectionControl.setSelected();
                        }
                        else {
                            $scope.isOpened = true;
                        }
                    });
                }

                if (window.partners && window.partners.getPartner()) {
                    var partner = window.partners.getPartner().name;
                }
                $scope.input.on('focus', function () {
                    //$scope.$apply(function ($scope) {
                    //    $scope.isOpened = true;
                    //});

                    try {
                        if (partner === 'biletix') {
                            $scope.Error = false;
                        } else {
                            $scope.input.tooltip('destroy');
                        }
                    } catch (e) {
                    }

                    goSearch();
                }).on('blur', function () {
                    //console.log('input blur');
                    $scope.timeoutId = $timeout(function () {
                        $scope.$apply(function ($scope) {
                            $scope.selectionControl.setSelected();
                            $scope.isOpened = false;
                        });

                    }, 200);
                }).on('keyup', function (event) {
                    var theEvent = event || window.event;
                    var key = theEvent.keyCode || theEvent.which;
                    //console.log('key: %d', key);
                    switch (key) {
                        case 13:
                        {
                            select();
                            //return false;
                            break;
                        }
                        case 9://tab
                        {
                            break;
                        }
                        case 16:
                        case 17:
                        case 18:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 45:
                        case 46://del
                        {
                            break;
                        }
                        case 37://left
                        case 39://right
                        {
                            //return false;
                            break;
                        }
                        case 38:
                        {//up
                            $scope.$apply(function ($scope) {
                                if ($scope.isOpened) {
                                    $scope.selectionControl.selectPrev();
                                }
                                else {
                                    $scope.isOpened = true;
                                }
                            });
                            break;
                        }
                        case 40:
                        {//down
                            $scope.$apply(function ($scope) {
                                if ($scope.isOpened) {
                                    $scope.selectionControl.selectNext();
                                }
                                else {
                                    $scope.isOpened = true;
                                }
                            });
                            break;
                        }
                        default:
                        {
                            goSearch();
                            break;
                        }
                    }
                });

                function goSearch() {
                    var value = $scope.input.val();
                    var preparedText = value.split(', ')[0].trim();

                    //console.log('goSearch, text: %s, val: %s', preparedText, value);

                    //if (preparedText.length) {
                    //    //делаем 1 запрос раз в 300мс, вместо 2-3-4-х пока пользак набирает
                    //    getThrottled(preparedText, value);
                    //}
                    getThrottled(preparedText, value);
                }

                function clickHanlder(event) {

                    var isInsideComponent = !!$(event.target).closest(elem).length;

                    if (!isInsideComponent) {
                        //console.log('clickHanlder outside');
                        $scope.$apply(function ($scope) {
                            $scope.isOpened = false;
                        });
                    }
                    else {
                        //console.log('clickHanlder inside');
                        //select all
                        $(event.target).select();
                    }
                }

                $(document).click(clickHanlder);

                $scope.$on('$destroy', function () {
                    $(".ui-tooltip").remove();
                    $scope.input.off();
                    $(document).off('focus');
                    $(document).off('click', clickHanlder);
                    $timeout.cancel($scope.timeoutId);
                });
            }
        }
    }]);