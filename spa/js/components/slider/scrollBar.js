/**
 * jQuery slider
 * @link http://jqueryui.com/slider/#side-scroll
 */
angular.module('innaApp.components')
    .directive('scrollBar', [
        function () {
            return {
                replace: true,
                link: function ($scope, $element, $attr) {
                    $scope.hideBar = true;
                    function initialize() {


                        var scrollPane = $element,
                            scrollContent = $element.find(".scroll-content"),
                            scrollBarElement = $element.find(".scroll-bar");

                        // init scrollBar
                        scrollBar();


                        var handleHelper = scrollBarElement.find(".ui-slider-handle")
                            .mousedown(function () {
                                scrollBarElement.width(handleHelper.width());
                            })
                            .mouseup(function () {
                                scrollBarElement.width("100%");
                            })
                            .wrap("<div class='ui-handle-helper-parent'></div>").parent();


                        //init scrollbar size
                        setTimeout(sizeScrollbar, 10);


                        function sizeScrollbar() {

                            if (scrollContent.width() < $element.width()) {
                                $scope.hideBar = false;
                            }

                            var remainder = scrollContent.width() - scrollPane.width();
                            var proportion = remainder / scrollContent.width();
                            var handleSize = scrollPane.width() - ( proportion * scrollPane.width() );

                            scrollBarElement.find(".ui-slider-handle").css({
                                width: handleSize,
                                "margin-left": -handleSize / 2
                            });

                            handleHelper.width("").width(scrollBarElement.width() - handleSize);
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

                        function scrollBar() {
                            scrollBarElement.slider({
                                step: 0.1,
                                slide: function (event, ui) {
                                    if (scrollContent.width() > scrollPane.width()) {
                                        scrollContent.css("left", Math.round(
                                            ui.value / 100 * ( scrollPane.width() - scrollContent.width() )
                                        ) + "px");
                                    } else {
                                        scrollContent.css("left", 0);
                                    }
                                }
                            });
                        }

                        function onResize() {
                            resetValue();
                            sizeScrollbar();
                            reflowContent();
                        }


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
