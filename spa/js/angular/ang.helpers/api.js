angular.module('innaApp.API', [])
    .factory('innaApp.API.const', function () {
        function url(s) {
            var host = app_main.host || 'http://api.test.inna.ru';
            if (window.DEV) host = 'http://api.lh.inna.ru:8077';
            if (window.DEV2) host = 'http://api.lh.inna.ru';

            return host + '/api/v1' + s;
        }

        return {
            DYNAMIC_FROM_SUGGEST: url('/Packages/From'),
            DYNAMIC_TO_SUGGEST: url('/Packages/To'),
            DYNAMIC_GET_OBJECT_BY_ID: url('/Packages/DirectoryById'),
            DYNAMIC_SEARCH: window.DEV_DYNAMIC_SEARCH_PACKAGE_STUB || url('/Packages/Search'),
            DYNAMIC_SEARCH_HOTELS: url('/Packages/SearchHotels'),
            DYNAMIC_SEARCH_TICKETS: window.DEV_DYNAMIC_SEARCH_TICKETS_STUB || url('/Packages/SearchTickets'),
            DYNAMIC_HOTEL_DETAILS: url('/Packages/SearchHotel'),

            AUTH_SIGN_UP: url('/Account/Register/Post'),
            AUTH_SIGN_IN: url('/Account/Login/Post'),
            AUTH_RESTORE_A: url('/Account/ForgotPassword/Post'),
            AUTH_RESTORE_B: url('/Account/ResetPassword/Post'),
            AUTH_SOCIAL_BROKER: app_main.host + '/Account/ExternalLogin',

            PURCHASE_TRANSPORTER_GET_ALLIANCE: url('/Transporter/GetAllianceByName'),
            DICTIONARY_ALL_COUNTRIES: url('/Dictionary/Country'),
            AVIA_RESERVATION: url('/AviaOrder/Reservation'),
            AVIA_RESERVATION_GET_VARIANT: url('/AviaOrder/GetVariant'),
            AVIA_RESERVATION_GET_PAY_DATA: url('/Payment/Index'),
            AVIA_PAY: url('/Psb/Pay'),
            AVIA_PAY_CHECK: url('/AviaOrder/CheckOrder'),
            AVIA_TARIFS: url('/Avia/GetRule'),

            "*_PAGE_CONTENT": url('/Section/Get/'),

            eof: null
        }
    })
    .factory('innaApp.API.events', function(){
        return {
            build: function(eventName, subs){
                return eventName.split('*').join(subs);
            },

            DYNAMIC_SERP_FILTER_HOTEL: 'inna.Dynamic.SERP.Hotel.Filter',
            DYNAMIC_SERP_FILTER_TICKET: 'inna.Dynamic.SERP.Ticket.Filter',
            DYNAMIC_SERP_FILTER_ANY_CHANGE: 'inna.Dynamic.SERP.*.Filter',
            DYNAMIC_SERP_FILTER_ANY_DROP: 'inna.Dynamic.SERP.*.Filter.Drop',
            DYNAMIC_SERP_TICKET_DETAILED_REQUESTED: 'inna.Dynamic.SERP.Tickets.Detailed',
            DYNAMIC_SERP_TICKET_SET_CURRENT_BY_IDS: 'inna.Dynamic.SERP.Tickets.SetCurrentById',

            AUTH_FORGOTTEN_LINK_CLICKED: 'inna.Auth.Forgotten-link-clicked'
        }
    })
    .constant('innaApp.API.pageContent.DYNAMIC', 4)
    .constant('innaApp.API.pageContent.AVIA', 3);