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
                    visaControl: new aviaHelper.visaControl()
                },
                init: function (options) {
                    this._super(options);

                    var self = this;

                    this.on({
                        visaCheck: this.visaCheck
                    });

                    this.observe({
                        'AviaInfo': function (value) {
                            if (value) {
                                self.visaCheck(value);
                            }
                        }
                    });
                },
                visaCheck: function (aviaInfo) {
                    var passengers = this.get('Passengers');
                    if (passengers != null) {
                        var passengersCitizenshipIds = _.uniq(_.map(passengers, function (pas) {
                            return pas.Citizen;
                        }));
                        this.data.visaControl.check(passengersCitizenshipIds, aviaInfo);
                        //console.log('visaNeeded', this.data.visaControl.visaNeeded);
                        //console.log('visaRulesNeeded', this.data.visaControl.visaRulesNeeded);
                        //заставляем обновиться
                        this.set('visaControl', this.data.visaControl);
                    }
                }
            });

            return NeedVisa;
        }
    ]);
