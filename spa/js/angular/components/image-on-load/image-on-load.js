angular.module('innaApp.directives')
    .directive('imageonload', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                element[0].classList.add('image-wait-load');

                element.on('load', function () {
                    console.log('image is loaded');
                    element[0].classList.remove('image-wait-load')
                });
            }
        };
    });
