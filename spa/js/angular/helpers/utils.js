var utils = {
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
                    var allLoaded = _.all(self.fnList, function (item) { return item.isLoaded == true; });
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

    normalize: function(data){
        var normData = {};
        _.each(_.keys(data), function (key) {
            normData[key] = '' + data[key];
        });
        data = normData;
        return data;
    },

    getScrollTop: function(){
        return document.body.scrollTop || document.documentElement.scrollTop;
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
        var bottom = box.bottom + scrollTop - clientTop;

        // (5)
        return {
            top: Math.round(top),
            left: Math.round(left),
            bottom: Math.round(bottom)
        };
    },

    eof: null
};