angular.module('innaApp.directives')
    .directive('innaTicket', ['$templateCache', function($templateCache){
        return {
            //template: $templateCache.get('components/ticket.html'),
            templateUrl: '/spa/templates/components/ticket.html',
            scope: {
                'ticket': '=innaTicketTicket',
                'getTicketDetails': '&innaTicketGetTicketDetails'
            },
            transclude: true,
            controller: [
                '$scope', 'aviaHelper',
                function($scope, aviaHelper){
                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                    $scope.dateHelper = dateHelper;
                }
            ]
        }
    }]);