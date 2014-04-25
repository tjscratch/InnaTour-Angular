﻿'use strict';

/* Directives */

innaAppDirectives.
    directive('baloon', ['aviaHelper', 'eventsHelper', function (aviaHelper, eventsHelper) {
        return {
            replace: true,
            templateUrl: '/spa/templates/components/baloon.html',
            scope: {
                isShow: '=',
                caption: '=',
                text: '=',
                type: '=',
                closeFn: '=',
                data: '='
            },
            controller: function ($scope) {
                $scope.isVisible = false;

                updateDisplay();

                function updateDisplay() {
                    //console.log('updateDisplay, isVisible: ' + $scope.isVisible);
                    if ($scope.isVisible) {
                        $scope.display = 'block';
                    }
                    else {
                        $scope.display = 'none';
                    }
                }

                $scope.$watch('data', function (newVal, oldVal) {
                    //console.log('$scope.data: ' + angular.toJson($scope.data));
                    //доп данные для названий нкопок и т.д.
                    if ($scope.data != null && _.has($scope.data, 'buttonCaption')) {
                        $scope.buttonCaption = $scope.data.buttonCaption;
                    }
                });

                $scope.baloonType = aviaHelper.baloonType;

                if ($scope.isShow != null) {
                    $scope.isVisible = $scope.isShow;
                    updateDisplay();
                }

                //$scope.$on('baloon.show', function (e, data) {
                //    //console.log('baloon.show, c: %s, t: %s', data.caption, data.text);
                //    $scope.caption = data.caption;
                //    $scope.text = data.text;
                //    show();
                //});

                //$scope.$on('baloon.hide', function () {
                //    $scope.isVisible = false;
                //    updateDisplay();
                //});

                function show() {
                    if ($scope.caption != null && $scope.caption.length > 0 &&
                        $scope.text != null && $scope.text.length > 0) {

                        //доп данные для названий нкопок и т.д.
                        if ($scope.data != null && data.hasOwnProperty('buttonCaption')) {
                            $scope.buttonCaption = data.buttonCaption;
                        }

                        $scope.isVisible = true;
                        updateDisplay();
                    }
                }

                $scope.$watch('isShow', function (newVal, oldVal) {
                    $scope.isVisible = $scope.isShow;
                    updateDisplay();
                });

                $scope.close = function ($event) {
                    //console.log('baloon dir close');
                    eventsHelper.preventBubbling($event);
                    if ($scope.closeFn != null) {
                        $scope.closeFn();
                    }
                    else {
                        $scope.isShow = false;
                        $scope.isVisible = false;
                        updateDisplay();
                    }
                };

                $scope.clickFn = function ($event) {
                    eventsHelper.preventBubbling($event);
                    if ($scope.closeFn != null) {
                        $scope.closeFn();
                    }
                };
            },
            link: function ($scope, element, attrs) {
                
            }
        };
    }]);