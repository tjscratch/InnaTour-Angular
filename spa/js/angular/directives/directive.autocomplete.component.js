innaAppDirectives.directive('dropdownInput', [
    '$templateCache',
    'eventsHelper',
    '$timeout',
    function ($templateCache, eventsHelper, $timeout) {
        return {
            replace: true,
            template: $templateCache.get('components/dropdown_input.html'),
            scope: {
                provideSuggestCallback: '=', //callback for ngChange
                suggest: '=', //list of suggested objects
                result: '=',
                setResultCallback: '&',
                setResultItem: '=',
                theme: '@',
                askForData: '=',
                placeholder: '@'
            },
            controller: ['$scope', function ($scope) {
                /*Properties*/
                $scope.fulfilled = false;

                $scope.getPlaceholder = function () {
                    if ($scope.placeholder == null || $scope.placeholder.length == 0)
                        return 'Откуда';
                    else
                        return $scope.placeholder;
                }

                $scope.doResultCallback = function (item) {
                    if ($scope.setResultCallback) {
                        $scope.setResultCallback({ 'item': item });
                    }
                }

                //эта хуйня нужна чтобы можно было присвоить и id и name сразу, без доп запросов
                var unwatch = $scope.$watch('setResultItem', function (item) {
                    if (item != null) {
                        init(item);
                        //unwatch();
                    }
                }, true);

                function init(item) {
                    //console.log('init');
                    if ($scope.input) {
                        $scope.input.val(item.Name);
                    }
                    $scope.result = item.Id;
                }

                $scope.supressBlur = false;

                /*Events*/
                $scope.setCurrent = function ($event, option, airport) {
                    $timeout.cancel($scope.timeoutId);

                    //запрещаем баблинг
                    $event && eventsHelper.preventBubbling($event);

                    if (option != null) {
                        if (airport != null) {
                            $scope.input.val(airport.Name);
                            $scope.result = airport.Id;
                            $scope.doResultCallback(airport);
                        }
                        else {
                            $scope.input.val(option.Name);
                            $scope.result = option.Id;
                            $scope.doResultCallback(option);
                        }
                    }
                    $scope.fulfilled = true;
                }

                $scope.unfulfill = function () {
                    //console.log('keypress unfulfill');
                    //$scope.fulfilled = false;
                    //$scope.result = null;
                }

                /*Watchers*/
                $scope.$watch('result', function (newValue, oldValue) {
                    //console.log('$scope.$watch(result: %s', newValue);
                    if (newValue instanceof Error) {
                        $scope.result = oldValue;

                        $scope.input.tooltip({
                            position: {
                                my: 'center top+22',
                                at: 'center bottom'
                            },
                            items: "[data-title]",
                            content: function () {
                                return $scope.input.data("title");
                            }
                        }).tooltip('open');
                    } else if (!$scope.input.val()) {
                        if (newValue != null && newValue != 'null' && $scope.askForData) {
                            $scope.askForData(newValue, function (data) {
                                $scope.setCurrent(null, data);
                            });
                        }
                    }
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
                            item: item,
                            option: option,
                            airport: airport
                        }
                        return res;
                    }
                    self.init = function () {
                        //console.log('selectionControl.init');
                        self.list = [];
                        self.selectedIndex = 0;

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
                    }
                    self.isItemSelected = function (item) {
                        return (item.isSelected == true);
                    }
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
                    }
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
                    }
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
                    }
                    self.setSelected = function () {
                        var i = self.list[self.selectedIndex];
                        if (i) {
                            $scope.setCurrent(null, i.option, i.airport);
                        }
                        
                        //var inputs = $('.search-field', $scope.input.parent().parent());
                        //console.log(inputs);
                        //var ind = inputs.index($scope.input);
                        //console.log(ind);
                        //ind++;
                        //inputs[ind].focus();
                    }
                }

                $scope.selectionControl = new selectionControl();

                $scope.$watch('suggest', function (newValue, oldValue) {
                    if (newValue != null && newValue !== oldValue) {
                        $scope.selectionControl.init();
                        $scope.fulfilled = false;
                    }
                }, false);

                //обновляем раз в 300мс
                var getThrottled = _.debounce(function (preparedText, value) {
                    getDelayed(preparedText, value);
                }, 300);

                var getDelayed = function (preparedText, value) {
                    $scope.$apply(function ($scope) {
                        //console.log('getDelayed: prepText: %s, value: %s', preparedText, value);
                        $scope.provideSuggestCallback(preparedText, value);
                    });
                };

                /*Events*/
                $scope.input.on('focus', function () {
                    //$scope.$apply(function ($scope) {
                    //    $scope.fulfilled = false;
                    //});

                    try {
                        $scope.input.tooltip('destroy');
                    } catch (e) {
                    }

                    goSearch();
                }).on('blur', function () {
                    $scope.timeoutId = $timeout(function () {
                        $scope.$apply(function ($scope) {
                            $scope.fulfilled = true;
                        });

                        try {
                            $scope.input.tooltip('destroy');
                        } catch (e) {
                        }
                    }, 200);
                }).on('keydown', function (event) {
                    var theEvent = event || window.event;
                    var key = theEvent.keyCode || theEvent.which;
                    //console.log('key: %d', key);
                    switch (key) {
                        case 13: {
                            $scope.$apply(function ($scope) {
                                $scope.selectionControl.setSelected();
                            });

                            return false;
                            break;
                        }
                        case 9://tab
                            {
                                break;
                            }
                        case 13:
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
                        case 38: {//up
                            $scope.$apply(function ($scope) {
                                $scope.selectionControl.selectPrev();
                            });
                            break;
                        }
                        case 40: {//down
                            $scope.$apply(function ($scope) {
                                $scope.selectionControl.selectNext();
                            });
                            break;
                        }
                        default: {
                            goSearch();
                            break;
                        }
                    }
                });

                function goSearch() {
                    var value = $scope.input.val();
                    var preparedText = value.split(', ')[0].trim();

                    if (preparedText.length) {
                        //делаем 1 запрос раз в 300мс, вместо 2-3-4-х пока пользак набирает
                        getThrottled(preparedText, value);
                    }
                }

                $(document).click(function (event) {
                    var isInsideComponent = !!$(event.target).closest(elem).length;

                    if (!isInsideComponent) {
                        $scope.$apply(function ($scope) {
                            $scope.fulfilled = true;
                            //select all
                            $(event.target).select();
                        });
                    }
                });

                $scope.$on('$destroy', function () {
                    $scope.input.off();
                    $(document).off('focus');
                    $timeout.cancel($scope.timeoutId);
                });
            }
        }
    }]);