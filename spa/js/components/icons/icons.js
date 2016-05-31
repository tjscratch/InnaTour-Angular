innaAppDirectives.directive('svgIcon', function () {
    return {
        replace: true,
        templateUrl: function (elem, attr) {
            return 'components/icons/templ/' + attr.type + '.html';
        }
    }
});
