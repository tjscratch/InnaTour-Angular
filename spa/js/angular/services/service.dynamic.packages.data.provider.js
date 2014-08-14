innaAppServices.factory('DynamicPackagesDataProvider', [
    'innaApp.API.const', '$timeout', 'AjaxHelper',
    function(api, $timeout, AjaxHelper){
        return {
            getFromListByTerm: function(term, callback) {
                AjaxHelper.getDebounced(api.DYNAMIC_FROM_SUGGEST, {term: term}, callback);
            },
            getToListByTerm: function(term, callback) {
                AjaxHelper.getDebounced(api.DYNAMIC_TO_SUGGEST, {term: term}, callback);
            },
            getObjectById: function(id, callback){
                AjaxHelper.get(api.DYNAMIC_GET_OBJECT_BY_ID, {id: id}, callback);
            },
            getUserLocation: function(callback){
                AjaxHelper.get(api.DYNAMIC_GET_DIRECTORY_BY_IP, null, callback);

                return null;
            },
            search: function(o, callback, error){
                AjaxHelper.getDebounced(api.DYNAMIC_SEARCH, o, callback, error);
            },
            getHotelsByCombination: function(ticketId, params, callback){
                AjaxHelper.getDebounced(api.DYNAMIC_SEARCH_HOTELS, _.extend({Id: ticketId}, params), callback);
            },
            getTicketsByCombination: function(hotelId, params, callback){
                AjaxHelper.getDebounced(api.DYNAMIC_SEARCH_TICKETS, _.extend({Id: hotelId}, params), callback);
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
            hotelDetails: function(params){
                AjaxHelper.get(api.DYNAMIC_HOTEL_DETAILS, {
                    HotelId: params.HotelId,
                    HotelProviderId: params.HotelProviderId,
                    TicketToId: params.TicketToId,
                    TicketBackId: params.TicketBackId,
                    Filter: params.Filter
                }, params.success, params.error);
            },
            displayOrder: function(params){
                AjaxHelper.get(api.B2B_DISPLAY_ORDER, {
                    orderNum: params.orderId
                }, params.success, params.error);
            }
        }
    }
]);