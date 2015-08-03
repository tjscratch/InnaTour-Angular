'use strict';

/* Directives */

innaAppDirectives.
    directive('baloon', [
        '$templateCache',
        'aviaHelper',
        'eventsHelper',
        function ($templateCache, aviaHelper, eventsHelper) {
            return {
                replace: true,
                template: $templateCache.get('components/balloon/balloon.html'),
                scope: {
                    isShow: '=',
                    caption: '=',
                    text: '=',
                    type: '=',
                    closeFn: '=',
                    data: '='
                },
                controller: function ($scope, $rootScope) {
                    //$scope.isShow = false;
                    //updateDisplay();

                    setPartnerData($scope);

                    function setPartnerData(data) {
                        var partner = window.partners ? window.partners.getPartner() : null;
                        if (partner != null && partner.realType == window.partners.WLType.b2b) {
                            if (partner.name == 'sputnik') {
                                data.partnerData = {
                                    title: partner.title,
                                    phone: partner.phone,
                                    skype: partner.skype,
                                    email: partner.email
                                }

                            }
                        }
                    }

                    function updateDisplay() {
                        //console.log('updateDisplay, $scope.isShow: ' + $scope.isShow);

                        //позиционирование во фрейме
                        if (window.partners && window.partners.parentScrollTop > 0) {
                            $scope.popupStyles = {'top': window.partners.parentScrollTop + 100 + 'px'};//100px сверху
                        }
                        else {
                            $scope.popupStyles = null;
                        }

                        if ($scope.isShow) {
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
                        if ($scope.data != null && _.has($scope.data, 'successFn')) {
                            $scope.successFn = $scope.data.successFn;
                        }
                        if ($scope.data != null && _.has($scope.data, 'email')) {
                            $scope.email = $scope.data.email;
                        }
                    });

                    $scope.baloonType = aviaHelper.baloonType;

                    //if ($scope.isShow != null) {
                    //    //$scope.isVisible = $scope.isShow;
                    //    updateDisplay();
                    //}

                    //$scope.$on('baloon.show', function () {
                    //    console.log('$scope.$on baloon.show');
                    //    //$scope.caption = data.caption;
                    //    //$scope.text = data.text;
                    //    show();
                    //});

                    //$scope.$on('baloon.hide', function () {
                    //    console.log('$scope.$on baloon.hide');
                    //    $scope.isShow = false;
                    //    updateDisplay();
                    //});

                    //function show() {
                    //    if ($scope.caption != null && $scope.caption.length > 0 &&
                    //        $scope.text != null && $scope.text.length > 0) {

                    //        //доп данные для названий нкопок и т.д.
                    //        if ($scope.data != null && data.hasOwnProperty('buttonCaption')) {
                    //            $scope.buttonCaption = data.buttonCaption;
                    //        }
                    //    }

                    //    $scope.isShow = true;
                    //    updateDisplay();
                    //}

                    $scope.$watch('isShow', function (newVal, oldVal) {
                        updateDisplay();
                    });

                    $scope.close = function ($event) {
                        //console.log('baloon dir close');
                        eventsHelper.preventBubbling($event);
                        if ($scope.closeFn != null) {
                            $scope.closeFn();
                        }

                        $scope.isShow = false;
                        updateDisplay();
                    };

                    $scope.agencyRegSuccessRedirectHome = function ($event) {
                        $rootScope.$broadcast('open-auth-form');
                        eventsHelper.preventBubbling($event);
                        if ($scope.closeFn != null) {
                            $scope.closeFn();
                        }
                        $scope.isShow = false;
                        updateDisplay();
                    };

                    $scope.clickFn = function ($event) {
                        eventsHelper.preventBubbling($event);
                        if ($scope.successFn != null) {
                            $scope.successFn();
                        }
                    };

                    //$scope.$on('$destroy', function () {
                    //    console.log("destroy");
                    //    $scope.isShow = false;
                    //});
                },
                link: function ($scope, $element, attrs) {
                    //Dirty DOM hack
                    //$(function(){
                    //    $element.appendTo(document.body);
                    //});
                }
            };
        }]);