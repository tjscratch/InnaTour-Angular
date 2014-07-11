innaAppConponents.
    factory('DynamicBlock', [
        'innaApp.API.events',
        '$templateCache',
        function (Events, $templateCache) {

            var DynamicBlock = Ractive.extend({
                debug: true,
                template: $templateCache.get('components/figure-block/templ/base-dynamic.html'),
                data : {
                    transclude : false,
                    transcludeContent : '<div></div>',
                    collOneContent : '<div></div>',
                    collTwoContent : '<div></div>',
                    pluralize : utils.pluralize
                },
                init: function (options) {
                    this._super(options);
                },

                getHotelDetails : function(evt){

                }
            });

            return DynamicBlock;
        }
    ]);