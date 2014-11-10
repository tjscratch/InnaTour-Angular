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
                data : {
                    locationHref : '',
                    location : null
                },
                onrender: function (options) {
                    this._super(options);
                    this.set('locationHref', this.get('location'));

                    var that = this;
                    this._input = this.find('.b-tooltip-share__input');

                    /*this.on('change', function(data){

                    });*/

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
    ]);


