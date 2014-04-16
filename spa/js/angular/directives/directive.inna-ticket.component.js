angular.module('innaApp.directives')
    .directive('innaTicket', function(){
        return {
            templateUrl: '/spa/templates/components/ticket.html',
            scope: {
                'ticket': '=innaTicketTicket'
            },
            transclude: true,
            controller: function($scope){
                console.log($scope);
            }
        }
    })