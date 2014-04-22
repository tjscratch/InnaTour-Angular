innaAppServices.factory('DynamicPackagesDataProvider', [
    'innaApp.API.const', '$timeout',
    function(api, $timeout){
        function http(url, send, callback, allowMultiple) {
            var key = allowMultiple ? ('_' + Math.random()) : url;

            if(http.running[key]) {
                http.running[key].abort();
            }

            http.running[key] = $.ajax({
                type: 'GET',
                data: send,
                url: url,
                dataType: 'JSON',
                traditional: true
            }).success(function(resp){
                delete http.running[key];

                callback(resp);
            });
        }

        http.running = {};

        return {
            getFromListByTerm: function(term, callback) {
                http(api.DYNAMIC_FROM_SUGGEST, {term: term}, callback);
            },
            getToListByTerm: function(term, callback) {
                http(api.DYNAMIC_TO_SUGGEST, {term: term}, callback);
            },
            getObjectById: function(id, callback){
                http(api.DYNAMIC_GET_OBJECT_BY_ID, {id: id}, callback, true);
            },
            getUserLocation: function(callback){
                //TODO

                $timeout(function(){ callback(25); }, 500); // 25 is the fish! it's not a "magic" number

                return null;
            },
            search: function(o, callback){
                http(api.DYNAMIC_SEARCH, o, callback);
            },
            getHotelsByCombination: function(ticketId, params, callback){
                http(api.DYNAMIC_SEARCH_HOTELS, _.extend({Id: ticketId}, params), callback);
            },
            getTicketsByCombination: function(hotelId, params, callback){
                http(api.DYNAMIC_SEARCH_TICKETS, _.extend({Id: hotelId}, params), callback);
            },
            hotelDetails: function(hotelId, providerId, ticketToId, ticketBackId, searchId, callback){
                http(api.DYNAMIC_HOTEL_DETAILS, {
                    HotelId: hotelId,
                    HotelProviderId: providerId,
                    TicketToId: ticketToId,
                    TicketBackId: ticketBackId,
                    SearchId: searchId
                    //ExtendRoomInfo: true
                }, callback, true);
            }
        }
    }
]);