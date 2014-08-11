
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
    },
    getBits: function (path) {
        path = path.split('/');
        path = path[path.length - 1] || path[path.length - 2];
        return path.split('?')[0].split('-');
    }
};

//console.log(UrlHelper.UrlToHotelDetail(1, 1));
//console.log(UrlHelper.UrlToSearch({
//	FromCity: 1, ToCountry: 1, ToRegion: 1, StartMinString: 1, StartDateVariance: 1,
//	AdultNumber: 1, ChildAgesString: 1, DurationMin: 1, HotelStarsMin: 2, HotelStarsMax: 3
//}));