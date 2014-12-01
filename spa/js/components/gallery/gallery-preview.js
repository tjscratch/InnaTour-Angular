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
                    sizePreview: '@',
                    hover : '=hoverImageObject',
                    full: '@'
                },
                controller: ['$scope', function ($scope) {

                    $scope.picsListLoaded = false;
                    $scope.emptyPhoto = false;

                    var sizePreview = parseInt($scope.sizePreview, 10) || 400;

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
                            $scope.hover.hoverImage = {
                                "background-image": "url(" + $scope.photo + ")"
                            };
                        }
                    };

                    $scope.imageMouseMove = function ($event) {
                        var scrollTop = utils.getScrollTop();
                        if ($event) {
                            var clientX = parseInt($event.clientX, 10);

                            if (clientX > 600) {
                                $scope.hover.hoverImage["margin-left"] = -(sizePreview + 30);
                            } else {
                                $scope.hover.hoverImage["margin-left"] = 0;
                            }
                            $scope.hover.hoverImage["top"] = parseInt(($event.clientY + scrollTop) + 20, 10);
                            $scope.hover.hoverImage["left"] = parseInt(($event.clientX) + 20, 10);
                        }
                    };

                    $scope.imageMouseLeave = function () {
                        $scope.hover.timeOutHover = $timeout(function () {
                            $scope.hover.hoverImageShow = false;
                        }, 200);
                    };
                }]
            }
        }]);