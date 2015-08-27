innaAppDirectives.directive('citizenshipSelect', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
    return {
        replace: true,
        template: function (element, attrs) {
            if (attrs.type == 'phonePrefix') {
                return $templateCache.get('components/citizenship-select/templ/phonePrefix.hbs.html')
            }
            else if (attrs.type == 'docType') {
                return $templateCache.get('components/citizenship-select/templ/docType.hbs.html')
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
                //console.log('cit control $watch', newVal);
                $scope.selectionControl.setSelected(newVal);
            });

            function selectionControl() {
                var self = this;
                self.selectedIndex = 0;
                self.selectedItem = null;
                self.list = $scope.list;

                self.sortedListById;
                self.sortedListByNameWithLength;
                fillSortedArrays();

                function fillSortedArrays() {
                    self.sortedListById = [];
                    for (var i = 0; i < self.list.length; i++) {
                        var item = self.list[i];
                        self.sortedListById.push({Id: '' + item.Id, Name: item.Name});
                    }
                    self.sortedListById.sort(function (a, b) {
                        if (a.Id.length < b.Id.length) {
                            return -1;
                        }
                        else if (a.Id.length > b.Id.length) {
                            return 1;
                        }
                        else {
                            if (a.Id < b.Id) {
                                return -1;
                            }
                            else if (a.Id > b.Id) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        }
                    });

                    self.sortedListByNameWithLength = [];
                    for (var i = 0; i < self.list.length; i++) {
                        var item = self.list[i];
                        self.sortedListByNameWithLength.push({Id: '' + item.Id, Name: item.Name});
                    }
                    self.sortedListByNameWithLength.sort(function (a, b) {
                        if (a.Name.length < b.Name.length) {
                            return -1;
                        }
                        else if (a.Name.length > b.Name.length) {
                            return 1;
                        }
                        else {
                            if (a.Name < b.Name) {
                                return -1;
                            }
                            else if (a.Name > b.Name) {
                                return 1;
                            }
                            else {
                                return 0;
                            }
                        }
                    });
                }

                self.setNewList = function () {
                    self.list = $scope.list;
                    //console.log('setNewList', JSON.stringify(self.list));
                    if (self.list && self.list.length > 0) {
                        self.selectedIndex = 0;
                        self.selectedItem = self.list[0];
                        //self.selectItem();
                        self.setSelected(self.selectedItem.Id);
                    }
                    else {
                        self.selectedIndex = -1;
                        self.selectedItem = null;
                    }
                    //console.log('setNewList', JSON.stringify(self.list));
                    fillSortedArrays();
                };

                self.selectItem = function () {
                    $scope.itemClick(self.selectedItem);
                };

                self.setSelectedByContains = function (text) {
                    var itemId = null;

                    //starts with in Name
                    for (var i = 0; i < self.list.length; i++) {
                        var item = self.list[i];
                        if (item.Name.toLowerCase().startsWith(text.toLowerCase())) {
                            //console.log('setSelectedByContains', 'starts with in Name', text);
                            itemId = item.Id;
                            break;
                        }
                    }

                    //contains in Id
                    if (!itemId) {
                        for (var i = 0; i < self.sortedListById.length; i++) {
                            var item = self.sortedListById[i];
                            if (item.Id.toLowerCase().indexOf(text.toLowerCase()) > -1) {
                                //console.log('setSelectedByContains', 'contains in Id', text);
                                itemId = item.Id;
                                break;
                            }
                        }


                        //contains in Name
                        if (!itemId) {
                            for (var i = 0; i < self.sortedListByNameWithLength.length; i++) {
                                var item = self.sortedListByNameWithLength[i];
                                if (item.Name.toLowerCase().indexOf(text.toLowerCase()) > -1) {
                                    //console.log('setSelectedByContains', 'contains in Name', text);
                                    itemId = item.Id;
                                    break;
                                }
                            }
                        }
                    }

                    if (itemId) {
                        //console.log('setSelected', 'text', text, 'itemId', itemId);
                        self.setSelected(itemId);
                        self.scrollToItem();
                    }
                };

                self.setSelected = function (id) {
                    //if ($scope.attrsType == 'docType'){
                    //    console.log('cit ctrl setSelected', id, JSON.stringify(self.list));
                    //}

                    for (var i = 0; i < self.list.length; i++) {
                        var item = self.list[i];
                        if (item.Id == id) {
                            item.isSelected = true;
                            self.selectedIndex = i;
                            self.selectedItem = item;

                            emitEvents(item);
                        }
                        else {
                            item.isSelected = false;
                        }
                    }

                    //console.log('setSelected, id:', id, 'ind', self.selectedIndex, 'selItem', self.selectedItem);
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
                        //console.log('scrollToItem: ' + ind, self.selectedItem);
                    }
                };
            }

            function emitEvents(item) {
                if ($scope.changeEvent) {
                    //console.log('$scope emit event', $scope.changeEvent);
                    $scope.$emit($scope.changeEvent,
                        {
                            source: $scope.changeEvent,
                            value: item.Id
                        });
                }
            }

            $scope.selectionControl = new selectionControl();

            $scope.showCitList = function ($event) {
                eventsHelper.preventBubbling($event);
                $scope.isOpen = !$scope.isOpen;

                if ($scope.isOpen) {
                    setTimeout(function () {
                        //console.log('showCitList');
                        $scope.selectionControl.scrollToItem();
                    }, 0);
                }
            };

            $scope.itemClick = function (option) {
                var item = {id: option.Id, name: option.Name};

                if ($scope.result == null && $scope.resultSet) {
                    //console.log('resultSet: ', item);
                    $scope.resultSet({item: item});
                }
                else {
                    //console.log('$scope.result: ', item);
                    $scope.result = item;
                }

                validate(true);

                //emitEvents(item);
            };

            function validate(isUserAction) {
                $scope.ngValidationModel.validationType = $scope.validateType;
                var type = null;
                if (isUserAction)
                    type = 'userAction';

                //console.log('validate; ngValidationModel.value: %s', $scope.ngValidationModel.value);

                $scope.validate({item: $scope.ngValidationModel, type: type});
            }
        },
        link: function ($scope, $element, attrs) {
            if (attrs.type == 'phonePrefix') {
                $scope.isPhoneControl = true;
            }

            $scope.attrsType = attrs.type;
            if (attrs.type == 'docType') {
                $scope.$watch('list', function (newVal, oldVal) {
                    if (newVal) {
                        //console.log('$watch list', newVal);
                        $scope.selectionControl.setNewList();
                    }
                });
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

            $('input', $element).on('keydown', keyDown);

            function keyDown(event) {
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
                        return false;
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
                        return false;
                    }
                }
            }

            //
            function findItemByString(text) {

            }

            //логика обработки поиска по строке
            function searchByStringLogic(element) {
                var self = this;
                self.searchString = '';

                self.keyPress = function (event) {
                    var theEvent = event || window.event;
                    var key = theEvent.keyCode || theEvent.which;

                    var char = self.getChar(event);
                    //console.log('keypress, key:', key, 'char', char);

                    self.addCharToSearch(char);
                    self.debounceSearch();
                };
                element.on('keypress', self.keyPress);

                self.search = function () {
                    //console.log('search', self.searchString);
                    $scope.selectionControl.setSelectedByContains(self.searchString);
                    self.searchString = '';
                };

                self.debounceSearch = _.debounce(self.search, 300);

                self.addCharToSearch = function (char) {
                    self.searchString += char;
                };

                self.getChar = function (event) {
                    if (event.which == null) { // IE
                        if (event.keyCode < 32) return null; // спец. символ
                        return String.fromCharCode(event.keyCode)
                    }

                    if (event.which != 0 && event.charCode != 0) { // все кроме IE
                        if (event.which < 32) return null; // спец. символ
                        return String.fromCharCode(event.which); // остальные
                    }

                    return null; // спец. символ
                };

                self.destroy = function () {
                    element.off('keypress', self.keypress);
                }
            }

            var searchByString = new searchByStringLogic($('input', $element));

            $scope.$on('$destroy', function () {
                $('input', $element).off('keydown', keyDown);
                searchByString.destroy();
            });
        }
    }
}]);