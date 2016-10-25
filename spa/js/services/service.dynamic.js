innaAppServices.factory('DynamicPackagesDataProvider', [
    'innaApp.API.const',
    '$timeout',
    'AjaxHelper',
    function (api, $timeout, AjaxHelper) {
        return {
            getFromListByTerm: function (term, callback) {
                AjaxHelper.getDebounced({
                    url    : api.DYNAMIC_FROM_SUGGEST,
                    data   : {term: term},
                    success: callback
                });
            },
            getToListByTerm  : function (term, callback) {
                AjaxHelper.getDebounced({
                    url    : api.DYNAMIC_TO_SUGGEST,
                    data   : {term: term},
                    success: callback
                });
            },
            getObjectById    : function (id, callback) {
                AjaxHelper.get({
                    url    : api.DYNAMIC_GET_OBJECT_BY_ID,
                    data   : {id: id},
                    success: callback
                });
            },
            getUserLocation  : function (callback) {
                AjaxHelper.get({
                    url    : api.DYNAMIC_GET_DIRECTORY_BY_IP,
                    data   : null,
                    success: callback
                });
                
                return null;
            },
            search           : function (params) {
                params.url = api.DYNAMIC_SEARCH;
                AjaxHelper.getDebounced(params);
            },
            
            /**
             * @param {params.data}
             *        HotelId: int
             *        TicketId: int
             *        AddFilter: boolean
             *
             * @param {Object} params
             */
            getHotelsByCombination: function (params) {
                AjaxHelper.getDebounced({
                    url    : api.DYNAMIC_SEARCH_HOTELS,
                    data   : params.data,
                    success: params.success,
                    error  : params.error
                });
            },
            
            /**
             *
             * @param {params.data}
             *        HotelId: int
             *        TicketId: int
             *        AddFilter: boolean
             *
             * @param {Object} params
             */
            getTicketsByCombination: function (params) {
                AjaxHelper.getDebounced({
                    url    : api.DYNAMIC_SEARCH_TICKETS,
                    data   : params.data,
                    success: params.success,
                    error  : params.error
                });
            },
            
            /**
             *
             * @param {Object} params
             * hotelId =
             * providerId =
             * ticketToId =
             * ticketBackId =
             * searchParams =
             * success =
             * error =
             */
            hotelDetails: function (params) {
                if (params.data.departureSlug && params.data.SearchDate) {
                    return AjaxHelper.get({
                        // url    : "http://localhost:3000/offers/" + params.data.departureSlug + "/" + params.data.SearchDate,
                        url    : "https://pages.inna.ru/offers/" + params.data.departureSlug + "/" + params.data.SearchDate,
                        success: params.success,
                        error  : params.error
                    });
                } else {
                    return AjaxHelper.get({
                        url    : api.DYNAMIC_HOTEL_DETAILS,
                        data   : params.data,
                        success: params.success,
                        error  : params.error
                    });
                }
            },
            displayOrder: function (params) {
                return AjaxHelper.get({
                    url    : api.B2B_DISPLAY_ORDER,
                    data   : {
                        orderNum: params.orderId
                    },
                    success: params.success,
                    error  : params.error
                });
            }
        }
    }
]);