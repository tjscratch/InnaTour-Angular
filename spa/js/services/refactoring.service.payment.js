innaAppServices.service('Payment', function ($http, appApi, AppRouteUrls) {
    return {
        getPaymentData: function (params) {
            return $http({
                url   : appApi.GET_PAYMENT,
                method: 'GET',
                params: params,
                cache : false
            });
        },
        getPaymentDataNSPK: function (params) {
            return $http({
                url   : appApi.GET_PAYMENT_NSPK,
                method: 'GET',
                params: params,
                cache : false
            });
        },
        getRepricing  : function (orderNumber) {
            return $http({
                url   : appApi.GET_PAYMENT_REPRICING,
                method: 'GET',
                params: {OrderNumber: orderNumber, ReturnType: 1},
                cache : false
            });
        },
        qiwiMakeBill  : function (orderNum) {
            return $http({
                url   : appApi.QIWI_MAKE_BILL,
                method: 'POST',
                data  : {orderNum: orderNum},
                cache : false
            });
        },
        
        getSearchUrl: function (data) {
            var filter = angular.fromJson(data.Filter);
            var url;
            // data.ProductType
            // Avia = 1
            // Динамический пакет = 2
            // Сервисный сбор = 3
            // Отели = 4
            // Не определен = 0
            switch (data.ProductType) {
                case 1:
                    url = AppRouteUrls.URL_AVIA_SEARCH + [
                            filter.FromUrl,
                            filter.ToUrl,
                            filter.BeginDate,
                            filter.EndDate,
                            filter.AdultCount,
                            filter.ChildCount,
                            filter.InfantsCount,
                            filter.CabinClass,
                            filter.IsToFlexible,
                            filter.IsBackFlexible,
                            filter.PathType
                        ].join('-');
                    break;
                case 2:
                    url = AppRouteUrls.URL_DYNAMIC_PACKAGES_SEARCH + [
                            filter.DepartureId,
                            filter.ArrivalId,
                            filter.StartVoyageDateString,
                            filter.EndVoyageDateString,
                            filter.TicketClass,
                            filter.Adult,
                            filter.Children
                        ].join('-');
                    break;
                case 3:
                    null;
                    break;
                case 4:
                    null;
                    break;
                default:
                    null;
            }
            
            return url;
        }
    }
});