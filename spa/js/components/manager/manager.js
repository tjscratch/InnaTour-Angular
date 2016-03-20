innaAppDirectives.directive('manager', function ($templateCache, $interval, ManagerService) {
    return {
        replace: true,
        template: $templateCache.get("components/manager/templ/index.html"),
        //scope: {
        //    orderId: '=',
        //    price: '=',
        //    uid: '='
        //},
        link: function ($scope, element, attrs) {
            var url = "http://5.200.61.62/";

            $scope.url = url;
            $scope.showChat = false;

            function setManager () {
                ManagerService.getManagerStatus()
                    .success(function (data) {
                        if (data.Data.meetings.meeting) {
                            if (data.Data.meetings.meeting.running) {
                                $scope.showChat = true;
                            } else {
                                $scope.showChat = false;
                            }
                        } else {
                            $scope.showChat = false;
                        }
                    })
            }

            //setManager();


            var stop;
            $scope.fight = function () {
                // Don't start a new fight if we are already fighting
                if (angular.isDefined(stop)) return;

                stop = $interval(function () {
                    setManager();
                }, 4000);
            };

            $scope.stopFight = function () {
                if (angular.isDefined(stop)) {
                    $interval.cancel(stop);
                    stop = undefined;
                }
            };

            $scope.fight();

            $scope.$on('$destroy', function () {
                // Make sure that the interval is destroyed too
                $scope.stopFight();
            });

            //fullWidth
            $scope.fullView = false;
            $scope.toggleFullWidth = function () {
                console.log(44444)
                $scope.fullView = true;
                var managerContainer = $(".b-manager__container");
                $("body").append(managerContainer);
            };

            $scope.toggleFullWidthclose = function () {
                console.log(55555)
                $scope.fullView = false;
                var managerContainer = $(".b-manager__container");
                $(".b-manager").append(managerContainer);
            };

        }
    }
});
