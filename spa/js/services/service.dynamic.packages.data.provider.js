innaAppServices.factory('DynamicPackagesDataProvider', [
    'innaApp.API.const',
    '$timeout',
    'AjaxHelper',
    function (api, $timeout, AjaxHelper) {
        return {
            getFromListByTerm: function (term, callback) {
                AjaxHelper.getDebounced({
                    url : api.DYNAMIC_FROM_SUGGEST,
                    data : {term: term},
                    success : callback
                });
            },
            getToListByTerm: function (term, callback) {
                AjaxHelper.getDebounced({
                    url : api.DYNAMIC_TO_SUGGEST,
                    data : {term: term},
                    success : callback
                });
            },
            getObjectById: function (id, callback) {
                AjaxHelper.get({
                    url: api.DYNAMIC_GET_OBJECT_BY_ID,
                    data: {id: id},
                    success: callback
                });
            },
            getUserLocation: function (callback) {
                AjaxHelper.get({
                    url: api.DYNAMIC_GET_DIRECTORY_BY_IP,
                    data: null,
                    success: callback
                });

                return null;
            },
            search: function (params) {
                params.url = api.DYNAMIC_SEARCH;
                AjaxHelper.getDebounced(params);
            },
            getHotelsByCombination: function (params, callback) {
                AjaxHelper.getDebounced({
                    url : api.DYNAMIC_SEARCH_HOTELS,
                    data : params,
                    success : callback
                });
            },
            getTicketsByCombination: function (params, callback) {
                AjaxHelper.getDebounced({
                    url : api.DYNAMIC_SEARCH_TICKETS,
                    data : params,
                    success : callback
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
                AjaxHelper.get({
                    url: api.DYNAMIC_HOTEL_DETAILS,
                    data: {
                        HotelId: params.HotelId,
                        HotelProviderId: params.HotelProviderId,
                        TicketToId: params.TicketToId,
                        TicketBackId: params.TicketBackId,
                        Filter: params.Filter,
                        Rooms: params.Rooms
                    },
                    success: params.success,
                    error: params.error
                });
            },
            displayOrder: function (params) {
                AjaxHelper.get({
                    url: api.B2B_DISPLAY_ORDER,
                    data: {
                        orderNum: params.orderId
                    },
                    success: params.success,
                    error: params.error
                });
            }
        }
    }
]);