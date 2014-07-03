innaAppConponents.
    factory('DynamicBlock', [
        'innaApp.API.events',
        '$templateCache',
        function (Events, $templateCache) {

            var DynamicBlock = Ractive.extend({
                debug: true,
                template: $templateCache.get('components/dynamic-block/templ/base-dynamic.html'),
                init: function (options) {

                }
            });

            return DynamicBlock;
        }
    ]);