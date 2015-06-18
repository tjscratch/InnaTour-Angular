innaAppServices.factory('appApi', function () {
    function url(s) {
        var host = '';
        host = host || '';
        return host + '/api/v1' + s;
    }

    return {
        DYNAMIC_SEARCH_HOTELS: url('/Packages/SearchHotels'),
        DYNAMIC_SEARCH_TICKETS: url('/Packages/SearchTickets')
    }
});