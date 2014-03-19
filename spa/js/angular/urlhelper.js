
QueryString = {
    getByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    getFromUrlByName: function (url, name) {
        function cutBeforeQestion(url) {
            var ind = url.indexOf('?');
            if (ind > -1) {
                url = url.substring(ind + 1, url.length);
            }
            return url;
        }
        //отрезаем все, что слева от ?, берем только параметры
        url = cutBeforeQestion(url);
        var query = url;
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == name) {
                return decodeURIComponent(pair[1]);
            }
        }
        return null;
    }
};

UrlHelper = {
    self: this,
    ver: appVersion,
	Prefix: '#',
	Delimiter: '-',
	DelimiterReplace: '_',

	addPathAndVersion: function (url) {
	    //версия нужна чтобы обновлялись шаблоны
	    return appPath + url + '?v=' + UrlHelper.ver;
    },
	getInnerTemplate: function () {
	    return UrlHelper.addPathAndVersion('templates/grid/_item_inner.html');
	},
	getTemplateUrlByBlockType: function (type) {
	    var bType = tours.grid.blockType;
	    //switch (type) {
	    //    case bType.bXL: return UrlHelper.addPathAndVersion('templates/grid/item_XL.html');
	    //    case bType.b2SL: return UrlHelper.addPathAndVersion('templates/grid/item_2SL.html');
	    //    case bType.bL2S: return UrlHelper.addPathAndVersion('templates/grid/item_L2S.html');
	    //    case bType.b2M: return UrlHelper.addPathAndVersion('templates/grid/item_2M.html');
	    //    case bType.bLSS: return UrlHelper.addPathAndVersion('templates/grid/item_LSS.html');
	    //    case bType.bSSL: return UrlHelper.addPathAndVersion('templates/grid/item_SSL.html');
	    //    case bType.bL3L3L3: return UrlHelper.addPathAndVersion('templates/grid/item_L3L3L3.html');
	    //    case bType.bP2P1P1: return UrlHelper.addPathAndVersion('templates/grid/item_P2P1P1.html');
	    //    case bType.bP1P2P1: return UrlHelper.addPathAndVersion('templates/grid/item_P1P2P1.html');
	    //    case bType.bP1P1P2: return UrlHelper.addPathAndVersion('templates/grid/item_P1P1P2.html');
	    //    default: return UrlHelper.addPathAndVersion('templates/grid/item_XL.html');
	    //}

        //шаблоны тянутся с главной, чтобы не было проблем с кэшированием
	    switch (type) {
	        case bType.bXL: return '/grid/item_XL.html';
	        case bType.b2SL: return '/grid/item_2SL.html';
	        case bType.bL2S: return '/grid/item_L2S.html';
	        case bType.b2M: return '/grid/item_2M.html';
	        case bType.bLSS: return '/grid/item_LSS.html';
	        case bType.bSSL: return '/grid/item_SSL.html';
	        case bType.bL3L3L3: return '/grid/item_L3L3L3.html';
	        case bType.bP2P1P1: return '/grid/item_P2P1P1.html';
	        case bType.bP1P2P1: return '/grid/item_P1P2P1.html';
	        case bType.bP1P1P2: return '/grid/item_P1P1P2.html';
	        default: return '/grid/item_XL.html';
	    }
	},

	getUrlFromData: function(data){
	    if (data != null)
	    {
	        if (data.code_iata != null && data.code_iata.length > 0)
	            return data.code_iata;
	        else if (data.name_en != null && data.name_en.length > 0)
	            return data.code_iata;
	    }

	    return '';
	},

	changeNullsToAny: function(obj){
	    var dl = this.Delimiter;
	    var dlReplace = this.DelimiterReplace;

	    for (var prop in obj) {
	        var val = obj[prop];
	        if (val == undefined || val === '')
	            obj[prop] = 'any';

            //меняем '-' на '.'
	        while (angular.isString(val) && val.indexOf(dl) > -1) {
	            obj[prop] = val.replace(dl, dlReplace);
			}
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
			while (angular.isString(val) && val.indexOf(dlReplace) > -1) {
			    obj[prop] = val.replace(dlReplace, dl);
			}
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

    UrlToAviaMain: function (criteria) {

        criteria = this.changeNullsToAny(criteria);

        var dl = this.Delimiter;
        return '/avia/' + criteria.FromUrl + dl + criteria.ToUrl + dl + criteria.BeginDate + dl + criteria.EndDate
			+ dl + criteria.AdultCount + dl + criteria.ChildCount + dl + criteria.InfantsCount + dl + criteria.CabinClass + dl + criteria.IsFlexible;
    }, 

	UrlToAviaSearch: function (criteria) {

	    criteria = this.changeNullsToAny(criteria);
	    console.log('UrlToAviaSearch changeNullsToAny: ' + angular.toJson(criteria));

	    var dl = this.Delimiter;
	    return '/avia/search/' + criteria.FromUrl + dl + criteria.ToUrl + dl + criteria.BeginDate + dl + criteria.EndDate
			+ dl + criteria.AdultCount + dl + criteria.ChildCount + dl + criteria.InfantsCount + dl + criteria.CabinClass + dl + criteria.IsFlexible;
	},

	UrlToSletatTours: function (city, country, resort, hotel, date, nightsMin, nightsMax, adults, kids, kids_ages) {
	    return "/tours/?sta=on&city=" + city + "&country=" + country + "&resorts=" + resort + "&hotels=" + hotel + "&stars=&meals=&currency=RUB&adults=" + adults + "&kids=" + kids + "&kids_ages=" + kids_ages + "&priceMin=0&priceMax=0&nightsMin=" + nightsMin + "&nightsMax=" + nightsMax + "&date=" + date;
	},
	UrlToSletatToursDatesInterval: function (city, country, resort, hotel, dateFrom, dateTo, nightsMin, nightsMax, adults, kids, kids_ages) {
	    return "/tours/?sta=on&city=" + city + "&country=" + country + "&resorts=" + resort + "&hotels=" + hotel + "&stars=&meals=&currency=RUB&adults=" + adults + "&kids=" + kids + "&kids_ages=" + kids_ages + "&priceMin=0&priceMax=0&nightsMin=" + nightsMin + "&nightsMax=" + nightsMax + "&date1=" + dateFrom + "&date2=" + dateTo;
	}
};

//console.log(UrlHelper.UrlToHotelDetail(1, 1));
//console.log(UrlHelper.UrlToSearch({
//	FromCity: 1, ToCountry: 1, ToRegion: 1, StartMinString: 1, StartDateVariance: 1,
//	AdultNumber: 1, ChildAgesString: 1, DurationMin: 1, HotelStarsMin: 2, HotelStarsMax: 3
//}));