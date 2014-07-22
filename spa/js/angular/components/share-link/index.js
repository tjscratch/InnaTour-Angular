innaAppConponents.
    factory('ShareLink', [
        'innaApp.API.events',
        '$templateCache',
        'TooltipBase',
        function (Events, $templateCache, TooltipBase) {

            var ShareLink = TooltipBase.extend({
                template: $templateCache.get('components/share-link/templ/index.html'),
                debug: true,
                init: function (options) {
                    this._super(options);

                    var that = this;
                    this._input = this.find('.b-tooltip-share__input');

                    this.observe(
                        'isVisible',
                        function (newValue, oldValue) {
                            if (newValue) {
                                this.set({location: document.location});
                                $(this._input).select();
                            }
                        },
                        {defer: true}
                    );
                }
            });

            return ShareLink;
        }
    ]);

