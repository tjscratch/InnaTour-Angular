angular.module('innaApp.components').
    factory('PriceGeneric', [
        '$filter',
        '$templateCache',
        'TooltipBase',
        function ($filter, $templateCache, TooltipBase) {

            /**
             * Компонент priceGeneric
             * @constructor
             * @inherits TooltipBase
             */
            var priceGeneric = TooltipBase.extend({
                template: '{{>element}}',
                //template: $templateCache.get('components/tooltip/templ/price-generic.hbs.html'),
                isolated: true,
                append: true,
                partials : {
                    ruble : $templateCache.get('components/ruble.html')
                },
                data: {
                    isVisible: false,
                    priceFilter: function (text) {
                        return $filter('price')(text);
                    }
                },

                // dynamic template
                setTemplate: function (options) {
                    var templ = '';

                    if (options.data.template) {
                        templ = $templateCache.get('components/tooltip/templ/' + options.data.template);
                    } else {
                        templ = $templateCache.get('components/tooltip/templ/price-generic.hbs.html');
                    }
                    options.partials.element = templ;
                },

                beforeInit: function (options) {
                    this.setTemplate(options)
                },
                init: function (options) {
                    this._super(options);
                }

                /*riceObject : function(){
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
                },*/
            });

            return priceGeneric;
        }]);
