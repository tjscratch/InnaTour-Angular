angular.module('innaApp.directives')
    .directive('innaGallery', [
        '$templateCache',
        '$timeout',
        function ($templateCache, $timeout) {
            return {
                template: $templateCache.get('components/gallery/templ/gallery.html'),
                scope: {
                    urls: '=photos'
                },
                controller: [
                    '$scope',
                    function ($scope) {
                        var MAX_WIDTH = 960,
                            MAX_HEIGHT = 480,
                            MIN_WIDTH = 800,
                            MIN_LENGTH = 2,
                            previewWidth = 180,
                            previewHeight = 180,
                            timeOutHover = null;

                        $scope.picsListLoaded = false;
                        $scope.emptyPhoto = false;
                        $scope.hoverImage = {};
                        $scope.hoverImageShow = false;

                        /*Models*/
                        function PicList() {
                            this.list = [];
                            this.current = null;
                            this.plan = null;
                        }

                        PicList.PLAN_Z = 'Z';
                        PicList.PLAN_Y = 'Y';

                        PicList.prototype.setCurrent = function ($index, $event) {

                            if ($event) {
                                $event.stopPropagation();
                            }

                            this.current = this.list[$index];
                        };

                        PicList.prototype.isCurrent = function ($index) {
                            return (this.current == this.list[$index]);
                        };

                        PicList.prototype.next = function ($event) {
                            $event.stopPropagation();

                            var index = this.list.indexOf(this.current) + 1;
                            if (index >= this.list.length) index = 0;
                            this.setCurrent(index, null);
                        };

                        PicList.prototype.prev = function ($event) {
                            $event.stopPropagation();

                            var index = this.list.indexOf(this.current) - 1;
                            if (index < 0) index = this.list.length - 1;
                            this.setCurrent(index, null);
                        };

                        PicList.prototype.setStylePreview = function (src) {
                            return {
                                "background-image": "url(" + src + ")",
                                "width": previewWidth,
                                "height": previewHeight
                            }
                        };

                        PicList.prototype.imageMouseOver = function ($event, src) {
                            if ($event) {
                                if (timeOutHover) $timeout.cancel(timeOutHover);
                                $scope.hoverImageShow = true;
                                $scope.hoverImage = {
                                    "background-image": "url(" + src + ")"
                                };
                            }
                        };

                        PicList.prototype.imageMouseMove = function ($event) {
                            if ($event) {
                                var clientX = parseInt($event.clientX, 10);
                                if (clientX > 600) {
                                    $scope.hoverImage["margin-left"] = -400;
                                } else {
                                    $scope.hoverImage["margin-left"] = 0;
                                }
                                $scope.hoverImage["top"] = parseInt($event.clientY + 20, 10);
                                $scope.hoverImage["left"] = parseInt($event.clientX + 20, 10);
                            }
                        }

                        PicList.prototype.imageMouseLeave = function () {
                            timeOutHover = $timeout(function () {
                                $scope.hoverImageShow = false;
                            }, 200);
                        }

                        PicList.prototype.setHeight = function (is_full) {
                            return {
                                "height": is_full ? 70 : previewHeight
                            }
                        };

                        $scope.pics = new PicList();

                        $scope.isWL = window.partners ? window.partners.isWL() : false;

                        /**
                         *
                         * @returns {*}
                         */
                        $scope.getViewportStyle = function () {
                            if (!$scope.pics.current) return {};

                            var style = {
                                backgroundImage: 'url(~)'.split('~').join($scope.pics.current.src)
                            };

                            if ($scope.pics.plan == PicList.PLAN_Z) {
                                style.width = MAX_WIDTH;
                                style.height = MAX_HEIGHT;
                            } else if ($scope.pics.plan == PicList.PLAN_Y) {
                                style.width = $scope.pics.current.width;
                                style.height = $scope.pics.current.height;
                            } else {
                                return {};
                            }

                            return style;
                        };

                        $scope.showFullGallery = function () {
                            $scope.showGallery = true;
                            document.body.classList.add('overflow_hidden')
                        }

                        $scope.closeGallery = function ($event) {
                            $scope.showGallery = false;
                            document.body.classList.remove('overflow_hidden')
                        }

                        /*Watchers*/
                        $scope.$watch('urls', function (val) {
                            var loaded = new $.Deferred();
                            var BaseUrl = val.BaseUrl;

                            function buildPicList(sizeName, Fn) {
                                var deffereds = [];

                                $scope.pics.list = [];

                                $scope.urls[sizeName].forEach(function (pic, _index) {
                                    var deferred = new $.Deferred();

                                    deffereds.push(deferred.promise());

                                    var newPic = new Image();

                                    newPic.onload = function () {
                                        if (Fn(newPic)) {
                                            $scope.pics.list.push(newPic);
                                        }
                                        deferred.resolve();
                                    };

                                    newPic.onerror = function () {
                                        deferred.resolve();
                                    };

                                    newPic.src = (BaseUrl + pic);

                                    newPic.__order = _index;
                                });

                                return deffereds;
                            }

                            function planZ() {
                                return buildPicList('LargePhotos', function (pic) {
                                    var isHorizontal = (pic.width >= pic.height);
                                    var largeEnough = (pic.width > MIN_WIDTH);

                                    return isHorizontal && largeEnough;
                                });
                            }

                            function planY() {
                                return buildPicList('MediumPhotos', function (pic) {
                                    var isHorizontal = (pic.width > pic.height); // exactly GT, not GE
                                    var smallEnough = pic.height < MAX_HEIGHT;

                                    return isHorizontal && smallEnough;
                                });
                            }

                            function fail() {
                                $scope.$apply(function () {
                                    $scope.emptyPhoto = true;
                                });
                            }

                            $.when.apply($, planZ()).then(function () {
                                if ($scope.pics.list.length >= MIN_LENGTH) {
                                    loaded.resolveWith(null, [PicList.PLAN_Z]);
                                } else {
                                    $.when.apply($, planY()).then(function () {
                                        loaded.resolveWith(null, [PicList.PLAN_Y]);
                                    });
                                }
                            });

                            $.when(loaded).then(function (plan) {
                                if (!$scope.pics.list.length) {
                                    fail();
                                    return false;
                                }

                                $scope.picsListLoaded = true;


                                $scope.pics.list.sort(function (p1, p2) {
                                    return p1.__order - p2.__order;
                                });


                                $scope.$apply(function () {
                                    try {
                                        $scope.pics.setCurrent(0, null);
                                        $scope.pics.plan = plan;
                                    } catch (e) {
                                    }
                                });
                            }, fail);

                        });
                    }
                ]
            }
        }]);