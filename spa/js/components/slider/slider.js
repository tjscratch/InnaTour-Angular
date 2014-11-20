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
                    sliderData: null
                },
                onrender: function () {

                    this.observe('sliderData', function (newValue, oldValue, keypath) {

                    });
                },

                slide: function (value) {
                    console.info(value);
                    console.log(this.get('scope'));
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
                    scope: '&',
                    sliderData: '='
                },
                link: function ($scope, $element, $attr) {

                    var _slider = new Slider({
                        el: $element[0],
                        data : {
                            scope : $scope.scope
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
