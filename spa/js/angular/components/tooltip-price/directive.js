angular.module('innaApp.directives')
    .directive('toolTipPrice', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/tooltip-price/templ/index.html'),
            scope: {
                "item" : "=item",
                "icon" : "=iconWhite",
                "isHotel" : "=isHotel",
                "isTicket" : "=isTicket",
                "isBundle" : "=isBundle"
            },
            controller: [
                '$scope',
                '$element',
                'innaApp.API.events',
                function($scope, $element, Events){
                    var hotelDataPrice = {};
                    var ticketDataPrice = {};

                    if(!angular.isUndefined($scope.item.hotel.data.PriceObject)){
                        $scope.isPriceObject = true;
                    }

                    if($scope.isHotel && $scope.isPriceObject){
                        $scope.item.PriceObject = $scope.item.hotel.data.PriceObject;
                        hotelDataPrice = $scope.item.ticket.data.PriceObject;
                    }

                    if($scope.isTicket && $scope.isPriceObject){
                        $scope.item.PriceObject = $scope.item.ticket.data.PriceObject;
                        ticketDataPrice = $scope.item.ticket.data.PriceObject;
                    }


                    if($scope.isBundle && $scope.isPriceObject){
                        $scope.item.PriceObject = $scope.item.getFullTotalPrice();
                        $scope.$root.$on(Events.DYNAMIC_SERP_CHOOSE_HOTEL, function(evt, data){
                            $scope.item.PriceObject = $scope.item.getFullTotalPrice();
                        })
                    }


                    var isVisible = false;


                    var getIsVisible = function () {
                        return isVisible;
                    }

                    var setIsVisible = function (data) {
                        isVisible = data;
                    }

                    var showToolTip = function (evt) {
                        evt.stopPropagation();

                        var tooltip = $element.find('.JS-tooltip-price');

                        $(document).on('tooltip:hide', function () {
                            setIsVisible(false);
                            tooltip.hide();
                        });

                        $(document).trigger('tooltip:hide');

                        if (!getIsVisible()) {
                            tooltip.show();
                            setIsVisible(true);
                        }
                        else {
                            tooltip.hide();
                            setIsVisible(false);
                        }

                        $(document).on('click', function bodyClick() {
                            tooltip.hide();
                            setIsVisible(false);
                            $(document).off('click', bodyClick);
                        });
                    };

                    $element.on('click', '.js-show-tooltip', showToolTip);
                }
            ]
        }
    }]);
