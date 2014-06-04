angular.module('innaApp.directives')
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