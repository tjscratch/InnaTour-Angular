innaAppConponents
    .factory('NeedVisa', [
        'innaAppApiEvents',
        '$templateCache',
        'aviaHelper',
        function (Events, $templateCache, aviaHelper) {

            var NeedVisa = Ractive.extend({
                template: $templateCache.get('components/need-visa/templ/index.nbs.html'),
                append: true,
                data: {
                    visaControl: new aviaHelper.visaControl()
                },
                onrender: function (options) {
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
    ])
    .directive('needVisa', [
        'innaAppApiEvents',
        '$templateCache',
        'aviaHelper',
        function (Events, $templateCache, aviaHelper) {
            return {
                template: $templateCache.get('components/need-visa/templ/index.html'),
                replace: true,
                scope: {
                    aviaInfo: "=",
                    passengers: "="
                },
                controller: ['$scope', function ($scope, $element, $attr) {

                    $scope.visaControl = new aviaHelper.visaControl();

                    function visaCheck (aviaInfo) {
                        var passengers = $scope.passengers;

                        if (passengers != null) {
                            var passengersCitizenshipIds = _.uniq(_.map(passengers, function (pas) {
                                return pas.Citizen;
                            }));

                            $scope.visaControl.check(passengersCitizenshipIds, aviaInfo);
                        }
                    }

                    $scope.$watch('aviaInfo', function (value) {
                        if (value) {
                            visaCheck(value);
                        }
                    })

                    $scope.$on('$destroy', function () {

                    })
                }]
            }
        }])
;
