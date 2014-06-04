angular.module('innaApp.directives')
    .filter('innaTicketFilter', function(){

       return function(data1, data2){
            console.log(data1, 'data1');
            console.log(data2, 'data2');
       }
    })
    .directive('innaTicket', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/ticket/templ/index.html'),
            scope: {
                ticket: '=innaTicketTicket',
                getTicketDetails: '&innaTicketGetTicketDetails',
                passengerCount: '=innaTicketPassengerCount'
            },
            transclude: true,
            controller: [
                '$scope',
                'aviaHelper',
                function($scope, aviaHelper){

                    //console.log($scope);
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                    $scope.dateHelper = dateHelper;

                    $scope.showWarning = function(){
                        var n = parseInt($scope.ticket.data.NumSeats);

                        if(!n) return false;

                        switch($scope.passengerCount) {
                            case 1: return (n < 4);
                            case 2: return (n < 7);
                            default: return (n < 10);
                        }

                        return false;
                    }
                }
            ]
        }
    }]);