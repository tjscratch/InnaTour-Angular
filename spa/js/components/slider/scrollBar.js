/**
 * jQuery slider
 * @link http://jqueryui.com/slider/#side-scroll
 */
angular.module('innaApp.components')
    .directive('scrollBar', [
        '$timeout',
        'innaAppApiEvents',
        function ($timeout, Events) {
            return {
                replace: true,
                link: function ($scope, $element, $attr) {

                    $scope.hideBar = {
                        visible : false
                    };


                    function initialize() {


                        var scrollPane = $element,
                            scrollContent = $element.find(".scroll-content"),
                            scrollBarElement = $element.find(".scroll-bar"),
                            scrollBarWidget = null;

                        // init scrollBar
                        scrollBar();


                        var handleHelper = scrollBarElement.find(".ui-slider-handle")
                            .mousedown(function (evt) {

                                scrollBarElement.width(handleHelper.width());
                            })
                            .mouseup(function (evt) {

                                scrollBarElement.width("100%");
                            })
                            .wrap("<div class='ui-handle-helper-parent'></div>").parent();


                        //init scrollbar size
                        setTimeout(sizeScrollbar, 10);


                        function sizeScrollbar() {

                            if (scrollContent.width() < $element.width()) {
                                $scope.$apply(function(){
                                    $scope.hideBar.visible = false;
                                })
                            } else {

                                $scope.$apply(function(){
                                    $scope.hideBar.visible = true;
                                })

                                var remainder = scrollContent.width() - scrollPane.width();
                                var proportion = remainder / scrollContent.width();
                                var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );

                                scrollBarElement.find(".ui-slider-handle").css({
                                    width: handleSize,
                                    "margin-left": -handleSize / 2
                                }).off('keydown');

                                handleHelper.width("").width(scrollBarElement.width() - handleSize);
                            }
                        }

                        //reset slider value based on scroll content position
                        function resetValue() {
                            var remainder = scrollPane.width() - scrollContent.width();

                            var leftVal = scrollContent.css("left") === "auto" ? 0 :
                                parseInt(scrollContent.css("left"));

                            var percentage = Math.round(leftVal / remainder * 100);

                            scrollBarElement.slider("value", percentage);
                        }

                        //if the slider is 100% and window gets larger, reveal content
                        function reflowContent() {
                            var showing = scrollContent.width() + parseInt(scrollContent.css("left"), 10);

                            var gap = scrollPane.width() - showing;

                            if (gap > 0) {
                                scrollContent.css("left", parseInt(scrollContent.css("left"), 10) + gap);
                            }
                        }

                        function scrollContentPosition(value) {
                            if (scrollContent.width() > scrollPane.width()) {
                                scrollContent.css("left", Math.round(
                                    value / 100 * ( scrollPane.width() - scrollContent.width() )
                                ) + "px");
                            } else {
                                scrollContent.css("left", 0);
                            }
                        }


                        function setPosition(position) {
                            scrollBarWidget.slider("value", position);
                            scrollContentPosition(position);
                        }


                        function scrollBar() {
                            scrollBarWidget = scrollBarElement.slider({
                                step: 0.1,
                                slide: function (event, ui) {
                                    event.stopPropagation();
                                    scrollContentPosition(ui.value);
                                }
                            });
                        }

                        $scope.slideBar = function ($event) {
                            if ($event) $event.stopPropagation();
                        }

                        function onResize() {
                            resetValue();
                            sizeScrollbar();
                            reflowContent();
                        }


                        $scope.$on(Events.NotificationScrollBar, function (evt, $index) {
                            if($scope.hideBar.visible) {
                                var per = ($index * 100) / ($scope.pics.list.length - 1);
                                setPosition(parseFloat(per));
                            }
                        });

                        $scope.$on(Events.NotificationGalleryClose, function () {
                            //sizeScrollbar();
                        });


                        $(window).on('resize', onResize);

                        $scope.$on('$destroy', function () {
                            scrollBarElement.slider("destroy");
                            $(window).off('resize', onResize);
                        });
                    }


                    $scope.$watch('picsListLoaded', function (value) {
                        if (value) {
                            initialize();
                        }
                    })
                }
            }
        }])
