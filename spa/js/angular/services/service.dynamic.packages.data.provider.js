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
                //TODO

                $timeout(function(){ callback(25); }, 500); // 25 is the fish! it's not a "magic" number

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
            hotelDetails: function(hotelId, providerId, ticketToId, ticketBackId, searchId, callback){
                AjaxHelper.get(api.DYNAMIC_HOTEL_DETAILS, {
                    HotelId: hotelId,
                    HotelProviderId: providerId,
                    TicketToId: ticketToId,
                    TicketBackId: ticketBackId,
                    SearchId: searchId
                    //ExtendRoomInfo: true
                }, callback);
            }
        }
    }
]);