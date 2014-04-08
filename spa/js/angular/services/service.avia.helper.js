innaAppServices.
    factory('aviaHelper', ['$rootScope', '$http', '$log', function ($rootScope, $http, $log) {
        function log(msg) {
            $log.log(msg);
        }

        return {
            getTransferCountText: function (count) {
                switch (count) {
                    case 0: return "пересадок";
                    case 1: return "пересадка";
                    case 2: return "пересадки";
                    case 3: return "пересадки";
                    case 4: return "пересадки";
                    case 5: return "пересадок";
                    case 6: return "пересадок";
                    case 7: return "пересадок";
                    case 8: return "пересадок";
                    case 9: return "пересадок";
                    case 10: return "пересадок";
                    default: return "пересадок";
                }
            }
        }
    }]);