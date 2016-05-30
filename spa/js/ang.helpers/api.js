angular.module('innaApp.API', [])
    .factory('innaApp.API.const', function () {
        function url(s, apiHost) {
            var host = app_main.apiHost;
            host = host || '';

            var result = host + '/api/v1' + s;

            var debugApiHost = localStorage.getItem('debug_api_host');
            if (debugApiHost && debugApiHost.length > 0 && debugApiHost.indexOf('http') > -1) {
                result = debugApiHost + result;
            }

            return result;
        }

        return {
            GET_SLETAT: url('/Dictionary/Sletat/Get'),
            GET_SLETAT_CITY: url('/Dictionary/SletatCity/Get'),
            GET_SLETAT_BY_ID: url('/Dictionary/SletatById/Get'),

            GET_LOCATION_BY_URLS: url('/Dictionary/LocationByUrl'),
            GET_CURRENT_LOCATION_BY_IP: url('/Dictionary/GetCurrentLocation'),

            BEGIN_SEARCH: url('/Search/BeginSearch/Get'),
            CHECK_SEARCH: url('/Search/CheckSearch/Get'),

            HOTEL_DETAIL: url('/HotelDetail/GetPage'),
            TOUR_DETAIL: url('/TourDetail/GetPage'),

            GET_ORDER: url('/Order'),

            PAYMENT_PAGE: url('/Payment'),
            PAY: url('/Payment/Pay'),

            GET_SECTION_TOURS: url('/Section/Get/1'),
            GET_SECTION_INDIVIDUAL_TOURS: url('/Section/Get/2'),
            GET_INDIVIDUAL_TOURS_CATEGORY: url('/IndividualTourCategory/Get'),

            SEND_IT_CATEGORY_REQUEST: url('/RequestsTour/Post'),

            DYNAMIC_FROM_SUGGEST: url('/Dictionary/Directory'),
            DYNAMIC_TO_SUGGEST: url('/Dictionary/Hotel'),
            DYNAMIC_GET_OBJECT_BY_ID: url('/Dictionary/DirectoryById'),
            DYNAMIC_SEARCH: url('/Packages/Search'),
            DYNAMIC_SEARCH_HOTELS: url('/Packages/SearchHotels'),
            DYNAMIC_SEARCH_TICKETS: url('/Packages/SearchTickets'),
            DYNAMIC_HOTEL_DETAILS: url('/Packages/HotelDetails'),
            DYNAMIC_GET_DIRECTORY_BY_IP: url('/Dictionary/GetCurrentCity'),

            B2B_DISPLAY_ORDER: url('/Payment/Index'),

            AUTH_SIGN_UP: url('/Account/Register/Post'),
            AUTH_SIGN_UP_STEP_2: url('/Account/Confirm/Post'),
            AUTH_SIGN_IN: url('/Account/Login/Post'),
            AUTH_SIGN_IN_WL: url('/Account/LoginWL/Post'),
            AUTH_RESTORE_A: url('/Account/ForgotPassword/Post'),
            AUTH_RESTORE_B: url('/Account/ResetPassword/Post'),
            AUTH_SOCIAL_BROKER: app_main.apiHost + '/Account/ExternalLogin',
            AUTH_LOGOUT: url('/Account/Logoff'),
            AUTH_CHANGE_INFO: url('/Account/ChangeInfo/Post'),
            AUTH_RECOGNIZE: url('/Account/Info/Post'),
            AUTH_CHANGE_PASSWORD: url('/Account/ChangePassword/Post'),

            PURCHASE_TRANSPORTER_GET_ALLIANCE: url('/Transporter/GetAllianceByName'),
            DICTIONARY_ALL_COUNTRIES: url('/Dictionary/Country'),
            AVIA_FROM_SUGGEST: url('/Dictionary/Directory/Get'),
            AVIA_RESERVATION: url('/AviaOrder/Reservation'),
            AVIA_RESERVATION_GET_VARIANT: url('/AviaOrder/GetVariant'),
            AVIA_RESERVATION_GET_PAY_DATA: url('/Payment/Index'),
            BUY_REPRICING: url('/Payment/Repricing'),
            DO_PAY: url('/Psb/Pay'),
            AVIA_PAY_CHECK: url('/AviaOrder/CheckOrder'),
            AVIA_TARIFS: url('/Avia/GetRule'),

            AVIA_BEGIN_SEARCH: url('/Avia/Get'),
            AVIA_CHECK_AVAILABILITY: url('/avia/IsActual'),
            PACKAGE_CHECK_AVAILABILITY: url('/Packages/IsPackageAvailable'),
            PACKAGE_RESERVATION: url('/PackagesOrder/Reservation'),
            RESERVATION_DP_REQUEST: url('/PackagesOrder/CreateDpRequest'),
            BUY_COMMENT: url('/PackagesOrder/CreateOrderMessage'),

            "*_PAGE_CONTENT": url('/Section/Get/'),

            HELP_TOPICS: url('/faq/get'),

            PARTNERSHIP_GET_COOKIE: url('/Prt/GetPrtId'),
            
            PARTNER_CREATE: url('/Agency/Add'),

            QIWI_MAKE_BILL: url('/qiwi/MakeBill'),

            eof: null
        }
    })
    .factory('innaAppApiEvents', function(){
        return {
            build: function(eventName, subs){
                return eventName.split('*').join(subs);
            },

            AJAX__RESET : 'ajax_reset',

            DYNAMIC_SERP_FILTER_HOTEL: 'inna.Dynamic.SERP.Hotel.Filter',
            DYNAMIC_SERP_FILTER_TICKET: 'inna.Dynamic.SERP.Ticket.Filter',
            DYNAMIC_SERP_FILTER_ANY_CHANGE: 'inna.Dynamic.SERP.*.Filter',
            DYNAMIC_SERP_FILTER_ANY_DROP: 'inna.Dynamic.SERP.*.Filter.Drop',
            DYNAMIC_SERP_TICKET_DETAILED_REQUESTED: 'inna.Dynamic.SERP.Tickets.Detailed',
            DYNAMIC_SERP_TICKET_SET_CURRENT_BY_IDS: 'inna.Dynamic.SERP.Tickets.SetCurrentById',
            DYNAMIC_SERP_HOTEL_DETAILS_LOADED: 'inna.Dynamic.SERP.Hotel.DetailedInfo.Loaded',
            DYNAMIC_SERP_CHOOSE_HOTEL : 'choose:hotel',
            DYNAMIC_SERP_CHOOSE_TICKET : 'choose:ticket',
            DYNAMIC_SERP_MORE_DETAIL_HOTEL : 'more:detail:hotel',
            DYNAMIC_SERP_BACK_LIST : 'hotels:back:list',
            DYNAMIC_SERP_CLOSE_BUNDLE : 'bundle:hidden',
            DYNAMIC_SERP_OPEN_BUNDLE : 'bundle:full',
            DYNAMIC_SERP_HIDDEN_HOTEL : 'hotel:hidden',

            DYNAMIC_SERP_LOAD_TAB : 'DYNAMIC_SERP_LOAD_TAB',

            FILTER_PANEL_CLOSE_FILTERS : 'filter-panel:close-filters',
            FILTER_PANEL_SORT : 'filter-panel:sort',
            FILTER_PANEL_CHANGE : 'filter-panel:change',
            FILTER_PANEL_RESET : 'filter-panel:reset',
            FILTER_PANEL_RESET_ALL : 'filter-panel:reset_all',
            LIST_PANEL_FILTES_HOTELS_DONE : 'LIST_PANEL_FILTES_HOTELS_DONE',
            LIST_PANEL_FILTES_RESET_DONE : 'LIST_PANEL_FILTES_RESET_DONE',

            DYNAMIC_SERP_TOGGLE_MAP : 'toggle:view:hotels:map',
            DYNAMIC_SERP_GO_TO_MAP : 'hotel:go-to-map',
            DYNAMIC_SERP_TOGGLE_MAP_SINGLE : 'hotel:go-to-map-single',
            DYNAMIC_SERP_MAP_LOAD : 'hotel:map-load',
            DYNAMIC_SERP_MAP_DESTROY : 'hotel:map-destroy',
            DYNAMIC_SERP_BACK_TO_MAP : 'hotel:DYNAMIC_SERP_BACK_TO_MAP',
            MAP_CLOSE : 'map:close',

            HEADER_VISIBLE : 'region-header:show',
            HEADER_HIDDEN: 'region-header:hide',
            HEAD_HIDDEN: 'region-head:hide',

            FOOTER_VISIBLE : 'region-footer:show',
            FOOTER_HIDDEN : 'region-footer:hide',

            AUTH_FORGOTTEN_LINK_CLICKED: 'inna.Auth.Forgotten-link-clicked',
            AUTH_SIGN_IN: 'inna.Auth.SignIn',
            AUTH_SIGN_OUT: 'inna.Auth.SignOut',

            AUTH_USER_SET: 'inna.Auth.UserSet',

            NotificationScrollBar : "NotificationScrollBar",
            NotificationGalleryClose : "NotificationGalleryClose",


            eol: null
        }
    })
    .constant('innaApp.API.pageContent.DYNAMIC', 4)
    .constant('innaApp.API.pageContent.AVIA', 3)
    .directive('innaWith', function(){
        return {
            scope: false,
            link: function($scope, $elem, $attrs){
                var expr = $attrs.innaWith;
                var bits = expr.split(',');

                bits.forEach(function(bit){
                    var keyVal = bit.split('as');
                    var val = keyVal[0].trim();
                    var key = keyVal[1].trim();

                    $scope[key] = $scope.$eval(val);
                });
            }
        }
    });
