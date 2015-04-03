innaAppConponents.
    factory('ShareLink', [
        'innaAppApiEvents',
        '$templateCache',
        'TooltipBase',
        function (Events, $templateCache, TooltipBase) {

            /**
             * Компонент ShareLink
             * @constructor
             * @inherits TooltipBase
             */
            var ShareLink = TooltipBase.extend({
                template: $templateCache.get('components/share-link/templ/index.html'),
                data: {
                    tooltipKlass: '',
                    contentHtml: '',
                    condition: null,
                    position: 'left',
                    locationHref: '',
                    location: null
                },
                onrender: function (options) {
                    this._super(options);

                    this.set('locationHref', this.get('location'));

                    var that = this;
                    this._input = this.find('.b-tooltip-share__input');

                    this.observe('isVisible', function (newValue, oldValue) {
                        if (newValue) {

                            var locationData = window.partners && window.partners.isFullWL() ?
                                window.partners.getParentLocationWithHash() :
                                this.get('location');

                            this.set('locationHref', locationData)
                            $(this._input).select();
                        }
                    }, {defer: true});
                }
            });

            return ShareLink;
        }
    ])
    .directive('shareLinkDirective', [
        '$templateCache',
        'EventManager',
        '$filter',
        'ShareLink',
        function ($templateCache, EventManager, $filter, ShareLink) {
            return {
                replace: true,
                template: '',
                scope: {
                    tooltipKlass: '@',
                    contentHtml: '@',
                    condition: '&',
                    position: '@',
                    location: '@'
                },
                link: function ($scope, $element, attrs) {

                    var _shareLink = new ShareLink({
                        el: $element[0],
                        data: {
                            tooltipKlass: $scope.tooltipKlass,
                            contentHtml: $scope.contentHtml,
                            condition: $scope.condition,
                            position: $scope.position,
                            location: $scope.location || angular.copy(document.location.href)
                        }
                    });

                    $scope.$watch('location', function (value) {
                        _shareLink.set('location', value);
                    })


                    $scope.$on('$destroy', function () {
                        _shareLink.teardown();
                    })
                }
            }
        }])


