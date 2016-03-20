innaAppDirectives.directive('manager', function ($templateCache, $http, $interval, Balloon) {
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

            //var managerOnline = url + "http://5.200.61.62/bigbluebutton/api/getMeetings?checksum=38cd5a4d4dacf75df8d10b65ddfeb8665cf38080";

            var managerOnline = "/manager/defined";
            $scope.url = url;
            $scope.showChat = true;

            function setManager () {
                $http({
                    url: managerOnline,
                    method: 'GET'
                }).success(function (data) {
                    //console.log(data.response.meetings);
                    if (data.response.meetings.meeting) {
                        if (data.response.meetings.meeting.running == "true") {
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

            //$scope.fight();

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
