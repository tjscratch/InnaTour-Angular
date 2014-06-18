angular.module('innaApp.directives')
    .directive('innaTicket', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/ticket/templ/index.html'),
            scope: false,
            transclude: true,
            controller: [
                '$scope',
                '$element',
                'aviaHelper',
                'innaApp.API.events',
                function($scope, $element, aviaHelper, Events){

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                    $scope.dateHelper = dateHelper;

                    $scope.setTicket = function () {
                        $scope.$emit(Events.DYNAMIC_SERP_CHOOSE_TICKET, $scope.ticket);
                    }

                    $scope.showWarning = function(){
                        var n = parseInt($scope.ticket.data.NumSeats);

                        if(!n) return false;

                        switch($scope.passengerCount) {
                            case 1: return (n < 4);
                            case 2: return (n < 7);
                            default: return (n < 10);
                        }

                        return false;
                    };

                    $scope.virtualBundle = new inna.Models.Dynamic.Combination();
                    $scope.virtualBundle.hotel = $scope.combination.hotel;
                    $scope.virtualBundle.ticket = $scope.ticket;
                }
            ]
        }
    }]);