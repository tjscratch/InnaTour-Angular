innaAppConponents.
    factory('ShareLink', [
        'innaApp.API.events',
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
                debug: true,
                init: function (options) {
                    this._super(options);

                    var that = this;
                    this._input = this.find('.b-tooltip-share__input');

                    /*this.on('change', function(data){

                    });*/

                    this.observe('isVisible', function (newValue, oldValue) {
                        if (newValue) {
                            $(this._input).select();
                        }
                    }, {defer: true});
                }
            });

            return ShareLink;
        }
    ]);

