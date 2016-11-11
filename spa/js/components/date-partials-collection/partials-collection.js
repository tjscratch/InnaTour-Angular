angular.module('innaApp.components').
    factory('DatePartialsCollection', [
        '$filter',
        '$templateCache',
        function ($filter, $templateCache) {

            function getTempl(templName){
                return $templateCache.get('components/date-partials-collection/templ/'+ templName +'.html');
            }

            var PartialsCollection = Ractive.extend({
                template: "{{#if partialName}} {{>partialName}} {{/if}}",
                append: true,
                data: {},
                partials: {
                    weekDateTime : getTempl('weekDateTime'),
                    weekDateTimeCode : getTempl('weekDateTimeCode'),
                    flightTimeArrow : getTempl('flightTimeArrow'),
                    flightTime : getTempl('flightTime'),
                    logoAvia : getTempl('logoAvia')
                }
            });

            return PartialsCollection;
        }])

    .directive('datePartialsCollectionDirective', [
        'DatePartialsCollection',
        function (DatePartialsCollection) {
            return {
                replace: true,
                template: '',
                scope: {
                    date: '=',
                    direction: '@',
                    partialName: '@',
                    aviaInfo: "=",
                    hotel: "=",
                    ticketModel : "=",
                    toOrBack: "="
                },
                link: function ($scope, $element, $attr) {

                    var _datePartialsCollection = new DatePartialsCollection({
                        el: $element[0],
                        data: {
                            partialName : $scope.partialName,
                            direction : $scope.direction
                        }
                    });

                    $scope.$watch('aviaInfo', function (value) {
                        if(value) {
                            _datePartialsCollection.set({
                                AviaInfo: $scope.aviaInfo
                            });
                        }
                    });

                    $scope.$watch('hotel', function (value) {
                        _datePartialsCollection.set({
                            Hotel: $scope.hotel
                        });
                    });

                    $scope.$watch('ticketModel', function (value) {
                        _datePartialsCollection.set({
                            ticketModel: $scope.ticketModel
                        });
                    });

                    $scope.$watch('date', function (value) {
                        _datePartialsCollection.set({
                            date: $scope.date
                        });
                    });


                    $scope.$on('$destroy', function () {
                        _datePartialsCollection.teardown();
                        _datePartialsCollection = null;
                    });
                }
            }
        }])
