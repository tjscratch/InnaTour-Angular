innaAppServices.factory('appApi', function () {
    function url(s) {
        var host = '';
        host = host || '';
        return host + '/api/v1' + s;
    }

    return {
        DYNAMIC_SEARCH_HOTELS: url('/Packages/SearchHotels'),
        DYNAMIC_SEARCH_TICKETS: url('/Packages/SearchTickets'),
        GET_CURRENT_LOCATION_BY_IP: url('/Dictionary/GetCurrentLocation'),
        GET_AGENCY_LIST: url('/agency/AgencyList'),
        DYNAMIC_TO_SUGGEST: url('/Dictionary/Hotel'),
        PACKAGES_EMPTY_SEARCH: url('/Packages/EmptySearch'),

        GET_SMS_CODE: url('/Verification/SendCode'),
        CHECK_SMS_CODE: url('/Verification/CheckCode'),


        PACKAGES_DISCOUNTED_PRICE: url('/PackagesOrder/DiscountedPrice'),
        AVIA_DISCOUNTED_PRICE: url('/AviaOrder/DiscountedPrice'),

        HOTELS_GET_SUGGEST: url('/Hotels/SuggestionList'),
        HOTELS_GET_LIST: url('/Hotels/SearchHotelList'),
    }
});
