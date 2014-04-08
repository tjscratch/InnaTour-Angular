innaAppServices.
    factory('eventsHelper', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
        function log(msg) {
            $log.log(msg);
        }

        return {
            preventBubbling: function ($event) {
                if ($event.stopPropagation) $event.stopPropagation();
                if ($event.preventDefault) $event.preventDefault();
                $event.cancelBubble = true;
                $event.returnValue = false;
            }
        }
    }]);