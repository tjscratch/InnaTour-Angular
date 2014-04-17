angular.module('innaApp.directives')
    .directive('innaTicket', function(){
        return {
            templateUrl: '/spa/templates/components/ticket.html',
            scope: {
                'ticket': '=innaTicketTicket'
            },
            transclude: true,
            controller: function($scope){
                var daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
                var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

                $scope.collectCompanies = function(){
                    return [1, 2, 3];
                }

                $scope.isoDateTimeString2time = function(isoDateTimeString) {
                    var bits = isoDateTimeString.split('T')[1].split(':');
                    return [bits[0], bits[1]].join(':');
                }

                $scope.isoDateTimeString2date = function(isoDateTimeString){
                    var date = new Date(isoDateTimeString);
                    return [date.getDate(), months[date.getMonth()]]. join(' ');
                }

                $scope.isoDateTimeString2day = function(isoDateTimeString){
                    var date = new Date(isoDateTimeString);
                    return daysOfWeek[date.getDay()];
                }
            }
        }
    })