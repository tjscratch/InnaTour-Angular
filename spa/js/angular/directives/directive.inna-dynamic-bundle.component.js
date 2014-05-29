angular.module('innaApp.directives')
    .directive('innaDynamicBundle', ['$templateCache', function($templateCache){        
        return {
            template: $templateCache.get('components/bundle.html'),
            scope: {
                bundle: '=innaDynamicBundleBundle',
                state: '=innaDynamicBundleState',
                getTicketDetails: '=innaDynamicBundleTicketDetails',
                getHotelDetails: '=innaDynamicBundleHotelDetails',
                goReservation: '=innaDynamicBundleGoReservation'
            },
            controller: [
                '$scope',
                'aviaHelper',
                '$element',
                function($scope, aviaHelper, $element){
                    $scope.infoPopup = new inna.Models.Aux.AttachedPopup();
                    $scope.linkPopup = new inna.Models.Aux.AttachedPopup();


                    $scope.$watch('linkPopup.isOpen', function(){
                        $scope.location = document.location;
                    });

                    $scope.$on('change:hotel', function(evt, data){
                        //console.log($scope, '$scope bandle');
                        //console.log(data);

                        //$scope.bundle = data;
                    })

                    $scope.$watchCollection('bundle', function (selectedType) {
                        console.log('watcH - innaDynamicBundle');
                        //$scope.$render();
                    })

                    $scope.location = document.location;

                    /*Proxy*/
                    $scope.dateHelper = dateHelper;

                    $scope.airLogo = aviaHelper.setEtapsTransporterCodeUrl;
                }
            ]
        }
    }]);