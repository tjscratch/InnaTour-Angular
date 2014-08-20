innaAppConponents.
    factory('NeedVisa', [
        'innaApp.API.events',
        '$templateCache',
        'aviaHelper',
        function (Events, $templateCache, aviaHelper) {
            var NeedVisa = Ractive.extend({
                template: $templateCache.get('components/need-visa/templ/index.html'),
                debug: true,
                append: true,
                data: {
                    visaControl: new aviaHelper.visaControl(),
                    citizenshipIds: null,
                    aviaInfo: null
                },
                init: function (options) {
                    this._super(options);

                    this.on({
                        visaCheck: this.visaCheck
                    });

                    this.observe('AviaInfo', function (value) {
                        console.log('observe');
                        if (value) {
                            this.visaCheck();
                        }
                    }, { init: false });
                },
                visaCheck: function (evt) {
                    console.log('visaCheck');
                    this.data.visaControl.check(this.data.citizenshipIds, this.data.aviaInfo);
                }
            });

            return NeedVisa;
        }
    ]);
