angular.module('innaApp.components').
    factory('Slider', [
        'EventManager',
        '$filter',
        '$templateCache',
        function (EventManager, $filter, $templateCache) {

            var Slider = Ractive.extend({
                //template: $templateCache.get('components/slider/templ/index.hbs.html'),
                append: true,
                data: {
                    sliderData: null,
                    scrollPane: null,
                    scrollContent: null,
                    scrollBar: false
                },
                onrender: function () {

                    this.observe('sliderData', function (newValue, oldValue, keypath) {

                    });

                    this.scrollPane = this.get("scrollPane");
                    this.scrollContent = this.get("scrollContent");
                    this.scrollbar = null;

                    //build slider


                    //append icon to handle
                    var handleHelper = this.scrollbar.find(".ui-slider-handle")
                        .mousedown(function () {
                            this.scrollbar.width(handleHelper.width());
                        })
                        .mouseup(function () {
                            this.scrollbar.width("100%");
                        })
                        .append("<span class='ui-icon ui-icon-grip-dotted-vertical'></span>")
                        .wrap("<div class='ui-handle-helper-parent'></div>").parent();

                    //change overflow to hidden now that slider handles the scrolling
                    this.scrollbar.css("overflow", "hidden");

                    //size scrollbar and handle proportionally to scroll distance
                },

                sizeScrollbar: function () {
                    var remainder = this.scrollContent.width() - this.scrollPane.width();
                    var proportion = remainder / this.scrollContent.width();
                    var handleSize = this.scrollPane.width() - ( proportion * this.scrollPane.width() );
                    this.scrollbar.find(".ui-slider-handle").css({
                        width: handleSize,
                        "margin-left": -handleSize / 2
                    });
                    this.handleHelper.width("").width(this.scrollbar.width() - handleSize);
                },

                //reset slider value based on scroll content position
                resetValue: function () {
                    var remainder = this.scrollPane.width() - this.scrollContent.width();
                    var leftVal = this.scrollContent.css("margin-left") === "auto" ? 0 :
                        parseInt(this.scrollContent.css("margin-left"));
                    var percentage = Math.round(leftVal / remainder * 100);
                    this.scrollbar.slider("value", percentage);
                },

                //if the slider is 100% and window gets larger, reveal content
                reflowContent: function () {
                    var showing = this.scrollContent.width() + parseInt(this.scrollContent.css("margin-left"), 10);
                    var gap = this.scrollPane.width() - showing;
                    if (gap > 0) {
                        this.scrollContent.css("margin-left", parseInt(this.scrollContent.css("margin-left"), 10) + gap);
                    }
                },

                scrollBar: function () {
                    this.scrollbar = this.el.find(".scroll-bar").slider({
                        slide: function (event, ui) {
                            if (this.scrollContent.width() > this.scrollPane.width()) {
                                this.scrollContent.css("margin-left", Math.round(
                                    ui.value / 100 * ( this.scrollPane.width() - this.scrollContent.width() )
                                ) + "px");
                            } else {
                                this.scrollContent.css("margin-left", 0);
                            }
                        }
                    });
                },

                slide: function (value) {
                    if (typeof this.get('callbackSlider') == 'function') {
                        this.get('callbackSlider')(value);
                    }
                },

                oncomplete: function (data) {
                    var that = this;

                    $(this.el).slider({
                        range: "min",
                        animate: true,
                        /*min: that.get('FilterData.Min'),
                         max: that.get('FilterData.Max'),
                         value: that.get('FilterData.Value'),*/
                        slide: function (event, ui) {
                            that.slide(ui.value)
                        }
                    });
                }
            });

            return Slider;
        }])
    .directive('sliderDirective', [
        'Slider',
        function (Slider) {
            return {
                replace: true,
                template: '',
                scope: {
                    callbackSlider: '=',
                    sliderData: '='
                },
                link: function ($scope, $element, $attr) {

                    var _slider = new Slider({
                        el: $element[0],
                        data: {
                            callbackSlider: $scope.callbackSlider
                        }
                    });

                    $scope.$watch('sliderData', function (value) {
                        _slider.set('sliderData', value);
                    });

                    $scope.$on('$destroy', function () {
                        _slider.teardown();
                        _slider = null;
                    });
                }
            }
        }])
