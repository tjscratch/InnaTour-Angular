var request = require('request');


module.exports = function () {

    var getHotelParams = {
        hotel: 358469,
        ticket: 777660207,
        DepartureId: 6733,
        ArrivalId: 1735,
        StartVoyageDate: '2015-01-21',
        EndVoyageDate: '2015-01-23',
        TicketClass: 0,
        Adult: 2,
        HotelId: 358469,
        TicketId: 777660207,
        AddFilter: true
    };

    request({
            method: 'GET',
            url: 'https://inna.ru/api/v1/Packages/SearchHotels',
            qs: getHotelParams,
            json: true,
            gzip: true
        },
        function (error, response, body) {
            console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'))
            console.log(body.Hotels.length);
        })
}
