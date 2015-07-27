innaAppDirectives.directive('citizenshipSelect', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
    return {
        replace: true,
        template: function(element, attrs) {
            if (attrs.type == 'phonePrefix'){
                return $templateCache.get('components/citizenship-select/templ/phonePrefix.hbs.html')
            }
            else {
                return $templateCache.get('components/citizenship-select/templ/index.hbs.html')
            }
        },
        scope: {
            value: '=',
            list: '=',
            result: '=',
            resultSet: '&',
            ngValidationModel: '=',
            validateType: '=',
            validate: '&',
            changeEvent: '='
        },
        controller: function ($scope) {
            /*Props*/
            $scope.isOpen = false;
            $scope.listContainer = null;

            //$scope.shortName = function (name) {
            //    if (name) {
            //        return name.substring(name.length - 15, name.length);
            //    }
            //    else {
            //        return name;
            //    }
            //};

            /*Events*/
            $scope.$watch('value', function (newVal, oldVal) {
                //$scope.setSelectedItem(newVal);
                $scope.selectionControl.setSelected(newVal);
            });

            function selectionControl() {
                var self = this;
                self.selectedIndex = 0;
                self.selectedItem = null;
                self.list = $scope.list;

                self.selectItem = function () {
                    $scope.itemClick(self.selectedItem);
                };

                self.setSelected = function (id) {
                    for (var i = 0; i < self.list.length; i++) {
                        var item = self.list[i];
                        if (item.Id == id) {
                            item.isSelected = true;
                            self.selectedIndex = i;
                            self.selectedItem = item;

                            if ($scope.changeEvent) {
                                $scope.$emit("PHONE_CODE_CHANGED",
                                    {
                                        source: $scope.changeEvent,
                                        code: item.Id
                                    });
                            }
                        }
                        else {
                            item.isSelected = false;
                        }
                    }
                };

                self.selectNext = function () {
                    if (self.list.length > 0) {
                        if ((self.selectedIndex + 1) < self.list.length) {
                            self.list[self.selectedIndex].isSelected = false;
                            self.selectedIndex++;
                            self.list[self.selectedIndex].isSelected = true;
                            self.selectedItem = self.list[self.selectedIndex];
                            self.scrollToItem();
                        }
                    }
                };
                self.selectPrev = function () {
                    if (self.list.length > 0) {
                        if ((self.selectedIndex - 1) >= 0) {
                            self.list[self.selectedIndex].isSelected = false;
                            self.selectedIndex--;
                            self.list[self.selectedIndex].isSelected = true;
                            self.selectedItem = self.list[self.selectedIndex];
                            self.scrollToItem();
                        }
                    }
                };
                self.scrollToItem = function () {
                    var ind = self.selectedIndex;
                    //скролим где-то в середину (во всю высоту влезает где-то 10 итемов)
                    ind = ind - 5;
                    if (ind >= 0) {
                        var container = $scope.listContainer;
                        var scrollTo = $(".cit-item:eq(" + ind + ")", $scope.listContainer);
                        if (scrollTo.length > 0) {
                            var scrollToVal = scrollTo.offset().top - container.offset().top + container.scrollTop();

                            container.animate({
                                scrollTop: scrollToVal
                            }, 50);
                        }
                        //log('scrollToItem: ' + ind);
                    }
                };
            }

            $scope.selectionControl = new selectionControl();

            $scope.showCitList = function ($event) {
                eventsHelper.preventBubbling($event);
                $scope.isOpen = !$scope.isOpen;
            };

            $scope.itemClick = function (option) {
                var item = { id: option.Id, name: option.Name };

                if ($scope.result == null && $scope.resultSet) {
                    //console.log('resultSet: ', item);
                    $scope.resultSet({ item: item });
                }
                else {
                    //console.log('$scope.result: ', item);
                    $scope.result = item;
                }

                validate(true);

                if ($scope.changeEvent){
                    $scope.$emit("PHONE_CODE_CHANGED",
                        {
                            source: $scope.changeEvent,
                            code: item.id
                        });
                }
            };

            function validate(isUserAction) {
                $scope.ngValidationModel.validationType = $scope.validateType;
                var type = null;
                if (isUserAction)
                    type = 'userAction';

                //console.log('validate; ngValidationModel.value: %s', $scope.ngValidationModel.value);

                $scope.validate({ item: $scope.ngValidationModel, type: type });
            }
        },
        link: function ($scope, $element, attrs) {
            if (attrs.type == 'phonePrefix'){
                $scope.isPhoneControl = true;
            }

            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest($element).length;

                if (!isInsideComponent) {
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen != undefined)
                            $scope.isOpen = false;
                    });
                } else {
                    $scope.$apply(function ($scope) {
                        if ($scope.isOpen != undefined)
                            $scope.isOpen = !$scope.isOpen;
                    });
                }
            });

            $scope.listContainer = $('.cit-cont__inner', $element);

            $('input', $element).on('keydown', function (event) {
                var theEvent = event || window.event;
                var key = theEvent.keyCode || theEvent.which;

                //console.log('keydown, key:', key);

                switch (key) {
                    case 13:
                        {//up
                            $scope.$apply(function ($scope) {
                                if ($scope.isOpen) {
                                    $scope.isOpen = false;
                                    $scope.selectionControl.selectItem();
                                }
                                else {
                                    $scope.isOpen = true;
                                }
                            });
                            //break;
                            return false;
                        }
                    case 38:
                        {//up
                            $scope.$apply(function ($scope) {
                                if ($scope.isOpen) {
                                    $scope.selectionControl.selectPrev();
                                }
                                else {
                                    $scope.isOpen = true;
                                }
                            });
                            break;
                        }
                    case 40:
                        {//down
                            $scope.$apply(function ($scope) {
                                if ($scope.isOpen) {
                                    $scope.selectionControl.selectNext();
                                }
                                else {
                                    $scope.isOpen = true;
                                }
                            });
                            break;
                        }
                }
            });
        }
    }
}]);