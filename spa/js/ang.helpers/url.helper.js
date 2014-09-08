angular.module('innaApp.Url', [])
    .factory('urlHelper', ['innaApp.Urls', function (appUrls) {

        var helper = {
            //ver: app_main.version,
            Prefix: '#',
            Delimiter: '-',
            DelimiterReplace: '_',

            getInnerTemplate: function () {
                return 'grid/_item_inner.html';
            },
            getTemplateUrlByBlockType: function (type) {
                var bType = tours.grid.blockType;

                //шаблоны тянутся из templateCache
                switch (type) {
                    case bType.bXL: return 'grid/item_XL.html';
                    case bType.b2SL: return 'grid/item_2SL.html';
                    case bType.bL2S: return 'grid/item_L2S.html';
                    case bType.b2M: return 'grid/item_2M.html';
                    case bType.bLSS: return 'grid/item_LSS.html';
                    case bType.bSSL: return 'grid/item_SSL.html';
                    case bType.bL3L3L3: return 'grid/item_L3L3L3.html';
                    case bType.bP2P1P1: return 'grid/item_P2P1P1.html';
                    case bType.bP1P2P1: return 'grid/item_P1P2P1.html';
                    case bType.bP1P1P2: return 'grid/item_P1P1P2.html';
                    default: return 'grid/item_XL.html';
                }
            },

            getUrlFromData: function (data) {
                if (data != null) {
                    if (data.CodeIata != null && data.CodeIata.length > 0)
                        return data.CodeIata;
                    else if (data.NameEn != null && data.NameEn.length > 0)
                        return data.NameEn;
                }

                return '';
            },

            changeNullsToAny: function (obj) {
                var dl = this.Delimiter;
                var dlReplace = this.DelimiterReplace;

                for (var prop in obj) {
                    var val = obj[prop];
                    if (val == undefined || val === '')
                        obj[prop] = 'any';

                    //меняем '-' на '.'
                    if (angular.isString(val)) {
                        while (val.indexOf(dl) > -1) {
                            val = val.replace(dl, dlReplace);
                        }
                    }
                    obj[prop] = val;
                    //console.log(prop + ': ' + obj[prop]);
                }
                return obj;
            },

            restoreAnyToNulls: function (obj) {
                var dl = this.Delimiter;
                var dlReplace = this.DelimiterReplace;

                for (var prop in obj) {
                    var val = obj[prop];
                    if (val == 'any')
                        obj[prop] = null;

                    //меняем '.' на '-'
                    if (angular.isString(val)) {
                        while (val.indexOf(dlReplace) > -1) {
                            val = val.replace(dlReplace, dl);
                        }
                    }
                    obj[prop] = val;
                    //console.log(prop + ': ' + obj[prop]);
                }
                return obj;
            },

            UrlToHotelDetails: function (hotelId, searchId) {
                //если открываем в новом окне - то нужен префикс #
                return this.Prefix + '/hotel/' + hotelId + '/' + searchId;
            },

            UrlToTourDetails: function (hotelId, searchId, tourId) {
                //открываем в том же окне - префикс # не нужен
                return '/hotel/' + hotelId + '/' + searchId + '/tour/' + tourId;
            },

            UrlToPaymentPage: function (orderId) {
                //открываем в том же окне - префикс # не нужен
                return '/payment/' + orderId;
            },

            UrlToSearch: function (criteria) {

                criteria = this.changeNullsToAny(criteria);

                var dl = this.Delimiter;
                return '/hotels/search/' + criteria.FromCityUrl + dl + criteria.ToCountryUrl + dl + criteria.ToRegionUrl + dl + criteria.StartMinString
                    + dl + criteria.StartDateVariance + dl + criteria.AdultNumber + dl + criteria.ChildAgesString + dl + criteria.DurationMin;

                //return '/search/' + criteria.FromCityUrl + dl + criteria.ToCountryUrl + dl + criteria.ToRegionUrl + dl + criteria.StartMinString
                //	+ dl + criteria.StartDateVariance + dl + criteria.AdultNumber + dl + criteria.ChildAgesString + dl + criteria.DurationMin
                //	+ dl + criteria.HotelStarsMin + dl + criteria.HotelStarsMax;
            },

            UrlToAvia: function (criteria) {
                criteria = this.changeNullsToAny(criteria);
                //console.log('UrlToAvia changeNullsToAny: ' + angular.toJson(criteria));

                var dl = this.Delimiter;
                var res = '' + criteria.FromUrl + dl + criteria.ToUrl + dl + criteria.BeginDate + dl;
                if (criteria.EndDate) {
                    res += criteria.EndDate;
                }
                    
                res += dl + criteria.AdultCount + dl + criteria.ChildCount + dl + criteria.InfantsCount + dl + criteria.CabinClass
                + dl + criteria.IsToFlexible + dl + criteria.IsBackFlexible + dl + criteria.PathType;

                return res;
            },

            UrlToAviaAddBuy: function (criteria) {
                var dl = this.Delimiter;
                var res = url;
                if (criteria.OrderNum > 0) {
                    res += dl + criteria.OrderNum;
                }
                return res;
            },
            UrlToAviaMain: function (criteria) {
                return appUrls.URL_AVIA + helper.UrlToAvia(criteria);
            },
            UrlToAviaSearch: function (criteria) {
                return appUrls.URL_AVIA_SEARCH + helper.UrlToAvia(criteria);
            },
            UrlToAviaTicketsReservation: function (criteria) {
                var dl = this.Delimiter;
                var res = appUrls.URL_AVIA_RESERVATION + helper.UrlToAvia(criteria);
                res += dl + criteria.QueryId + dl + criteria.VariantId1 + dl + criteria.VariantId2;
                return res;
            },
            //UrlToAviaTicketsBuy: function (criteria) {
            //    var dl = this.Delimiter;
            //    var res = appUrls.URL_AVIA_BUY + helper.UrlToAvia(criteria);
            //    res += dl + criteria.QueryId + dl + criteria.VariantId1 + dl + criteria.VariantId2;
            //    res += dl + criteria.OrderNum;

            //    return res;
            //},

            UrlToAviaTicketsBuy: function (orderNum) {
                return appUrls.URL_AVIA_BUY + orderNum;
            },

            UrlToSletatTours: function (city, country, resort, hotel, date, nightsMin, nightsMax, adults, kids, kids_ages) {
                return "/tours/?sta=on&city=" + city + "&country=" + country + "&resorts=" + resort + "&hotels=" + hotel + "&stars=&meals=&currency=RUB&adults=" + adults + "&kids=" + kids + "&kids_ages=" + kids_ages + "&priceMin=0&priceMax=0&nightsMin=" + nightsMin + "&nightsMax=" + nightsMax + "&date=" + date;
            },
            UrlToSletatToursDatesInterval: function (city, country, resort, hotel, dateFrom, dateTo, nightsMin, nightsMax, adults, kids, kids_ages) {
                return "/tours/?sta=on&city=" + city + "&country=" + country + "&resorts=" + resort + "&hotels=" + hotel + "&stars=&meals=&currency=RUB&adults=" + adults + "&kids=" + kids + "&kids_ages=" + kids_ages + "&priceMin=0&priceMax=0&nightsMin=" + nightsMin + "&nightsMax=" + nightsMax + "&date1=" + dateFrom + "&date2=" + dateTo;
            },

            eof: null
        };
        return helper;
    }])