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

    eof: null
};

/* используется когда нужно параллельно выполнить несколько асинхронных действий, и по окончании всех - дернуть определенный метод
//use example
var l = new utils.loader();

function afterLoadCall() {
    console.log('afterLoadCall');
};

function fnload1() {
    var self = this;
    setTimeout(function () {
        console.log('load part 1');
        //оповещаем лоадер, что метод отработал
        l.complete(self);
    }, 1000);
};

function fnload2() {
    var self = this;
    setTimeout(function () {
        console.log('load part 2');
        //оповещаем лоадер, что метод отработал
        l.complete(self);
    }, 2000);
};

l.init([fnload1, fnload2], afterLoadCall).run();
*/