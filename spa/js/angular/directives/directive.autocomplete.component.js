innaAppDirectives.directive('dropdownInput', ['$templateCache', 'eventsHelper', function ($templateCache, eventsHelper) {
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
        controller: ['$scope', function($scope){
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
                    $scope.setResultCallback({ item : item });
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
                if ($scope.input) {
                    $scope.input.val(item.Name);
                }
                $scope.result = item.Id;
            }

            /*Events*/
            $scope.setCurrent = function ($event, option, airport) {
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
            $scope.unfulfill = function(){
                $scope.fulfilled = false;
                $scope.result = null;
            }

            /*Watchers*/
            $scope.$watch('result', function (newValue, oldValue) {
                //console.log('$scope.$watch(result: %s', newValue);
                if(newValue instanceof Error) {
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
                } else if(!$scope.input.val()) {
                    if(newValue != null && newValue != 'null' && $scope.askForData) {
                        $scope.askForData(newValue, function (data) {
                            $scope.setCurrent(null, data);
                        });
                    }
                }
            });
        }],
        link: function(scope, elem, attrs){
            scope.input = $('input[type="text"]', elem);

            /*Events*/
            scope.input.keyup(function(event){
                var value = scope.input.val();
                var preparedText = value.split(', ')[0].trim();

                if(preparedText.length) {
                    scope.provideSuggestCallback(preparedText, value);
                }

                if(event.which === 38) { //up
                    //todo
                } else if(event.which == 40) { //down
                    //todo
                }
            });

            scope.input.focus(function () {
                scope.$apply(function($scope){
                    $scope.fulfilled = false;
                });

                try{
                    scope.input.tooltip('destroy');
                } catch(e) {}
            });

            $(document).click(function (event) {
                var isInsideComponent = !!$(event.target).closest(elem).length;

                if (!isInsideComponent) {
                    scope.$apply(function ($scope) {
                        scope.fulfilled = true;
                        //select all
                        $(event.target).select();
                    });
                }
            });
        }
    }
}]);