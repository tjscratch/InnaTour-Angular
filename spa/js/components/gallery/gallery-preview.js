/**
 * Показываем preview фотографии
 *
 * для этого нужно определить в шаблонах блок
 * В родительском контроллере определяем общий объект для связывания
 *
 * @param {Object} hoverImageObject
 *
 * <div class="gallery__list-item_hover"
 ng-style="hoverImageObject.hoverImage"
 ng-if="hoverImageObject.hoverImageShow"></div>

 */

angular.module('innaApp.directives')
    .directive('galleryPreview', [
        '$templateCache',
        '$timeout',
        function ($templateCache, $timeout) {
            return {
                template: $templateCache.get('components/gallery/templ/gallery-preview.html'),
                scope: {
                    photo: '=',
                    width: '@',
                    height: '@',
                    widthPreview: '@',
                    heightPreview: '@',
                    hover: '=hoverImageObject',
                    full: '@'
                },
                controller: ['$scope', function ($scope) {

                    $scope.picsListLoaded = false;
                    $scope.emptyPhoto = false;
                    $scope.isHover = false;

                    var widthPreview = parseInt($scope.widthPreview, 10) || 500;
                    var heightPreview = parseInt($scope.heightPreview, 10) || 373;

                    $scope.hover.hoverImageStyle["width"] = widthPreview;
                    $scope.hover.hoverImageStyle["height"] = heightPreview;

                    $scope.setStylePreview = function () {
                        return {
                            "background-image": "url(" + $scope.photo + ")",
                            "width": $scope.width,
                            "height": $scope.height
                        }
                    };

                    $scope.imageMouseOver = function ($event) {
                        if ($event) {
                            if ($scope.hover.timeOutHover) {
                                $timeout.cancel($scope.hover.timeOutHover);
                            }

                            $scope.hover.hoverImageShow = true;
                            $scope.isHover = true;
                            $scope.hover.hoverImageStyle["background-image"] = "url(" + $scope.photo + ")";
                        }
                    };

                    $scope.imageMouseMove = function ($event) {
                        var scrollTop = utils.getScrollTop();
                        var windowHeight = (window.innerHeight + scrollTop);

                        if ($event) {

                            var clientX = parseInt($event.clientX, 10);
                            if (clientX > 600) {
                                $scope.hover.hoverImageStyle["margin-left"] = -(widthPreview + 30);
                            } else {
                                $scope.hover.hoverImageStyle["margin-left"] = 0;
                            }


                            if (($event.pageY + heightPreview) >= windowHeight) {
                                $scope.hover.hoverImageStyle["margin-top"] = -(heightPreview + 30);
                            } else {
                                $scope.hover.hoverImageStyle["margin-top"] = 0;
                            }


                            $scope.hover.hoverImageStyle["top"] = parseInt(($event.clientY + scrollTop) + 20, 10);
                            $scope.hover.hoverImageStyle["left"] = parseInt(($event.clientX) + 20, 10);
                        }
                    };

                    $scope.imageMouseLeave = function () {
                        $scope.isHover = false;
                        $scope.hover.timeOutHover = $timeout(function () {
                            $scope.hover.hoverImageShow = false;
                        }, 200);
                    };
                }]
            }
        }]);