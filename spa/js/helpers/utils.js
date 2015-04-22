_.originalBindAll = _.bindAll;
var utils = {

    bindAll: function (that) {
        var funcs = Array.prototype.slice.call(arguments, 1),
            validKeys = [], fn;
        if (funcs.length == 0) {
            for (var i in that) {
                fn = that[i];
                if (fn && typeof fn == "function" && (!fn.prototype || _.keys(fn.prototype).length == 0))
                    validKeys.push(i);
            }
            _.originalBindAll.apply(_, [that].concat(validKeys));
        }
        else
            _.originalBindAll.apply(_, arguments);
    },

    loader: function () {
        var self = this;
        self = {
            callback: null,
            fnList: null,
            init: function (fnList, fnCallback) {
                var self = this;
                self.callback = fnCallback;

                self.fnList = [];
                _.each(fnList, function (fn) {
                    self.fnList.push({ isLoaded: false, fn: fn });
                });
                return self;
            },
            complete: function (fn) {
                var self = this;
                var fnItem = _.find(self.fnList, function (item) {
                    return item === fn;
                });
                if (fnItem != null) {
                    fnItem.isLoaded = true;
                    var allLoaded = _.all(self.fnList, function (item) {
                        return item.isLoaded == true;
                    });
                    if (allLoaded && self.callback != null) {
                        self.callback();
                    }
                }
            },
            run: function () {
                _.each(this.fnList, function (item) {
                    item.fn();
                });
            }
        };
        return self;
    },

    normalize: function (data) {
        var normData = {};
        _.each(_.keys(data), function (key) {
            normData[key] = '' + data[key];
        });
        data = normData;
        return data;
    },

    getScrollTop: function () {
        var body = document.body;
        var docEl = document.documentElement;
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        return scrollTop;
    },
    getCoords: function (elem) {
        // (1)
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        // (4)
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        var bottom = box.bottom;

        // (5)
        return {
            top: Math.round(top),
            left: Math.round(left),
            bottom: Math.round(bottom)
        };
    },

    /**
     * @param {Number} number, titles
     * @param {Array} titles
     * @return *
     * utils.pluralize(number, ['пересадка', 'пересадки', 'пересадок']);
     */
    pluralize: function (number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    isSafari: function () {
        var ua = navigator.userAgent.toLowerCase();

        if (ua.indexOf('safari') == -1) return false;
        if (ua.indexOf('chrome') > -1) return false;

        return true;
    },

    inIframe: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },

    /**
     * Проходим по всем блокам с классом .scroll-fix
     * и выставляем фиксированную ширину overflow_hidden - убираем скроллинг с страницы
     * Выставляем на body класс
     * @param opt_param
     */
    scrollFix: function (opt_param) {

        function setWidth() {
            var fullWidth = window.innerWidth;
            var clientWidth = document.documentElement.clientWidth;
            fullWidth = Math.max(fullWidth, clientWidth);

            document.querySelectorAll('.scroll-fix').forEach(function (item) {
                item.style.width = (fullWidth + 'px');
            });
            
            document.body.classList.add('overflow_hidden');
        }

        function resetWidth() {
            document.querySelectorAll('.scroll-fix').forEach(function (item) {
                item.style.width = "auto";
            });

            document.body.classList.remove('overflow_hidden');
        }

        if(!opt_param) {
            setWidth();
            $(window).on('resize', setWidth);
        }
        else {
            resetWidth();
            $(window).off('resize');
        }
    },

    eof: null
};