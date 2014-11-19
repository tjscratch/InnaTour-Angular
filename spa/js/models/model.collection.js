innaAppServices.factory('ModelCollection', [
    '$timeout',
    function ($timeout) {

        var CollectionFactory = function () {
            function Collection() {
                this.list = [];
            };

            Collection.prototype.size = function () {
                return this.list.length;
            };

            Collection.prototype.push = function (smth) {
                this.list.push(smth);
            };

            Collection.prototype.flush = function () {
                this.list = [];
            };

            Collection.prototype.setList = function (list) {
                this.list = list;
            };

            Collection.prototype.getList = function () {
                return this.list;
            };

            Collection.prototype.toJSON = function () {
                var rawData = [];

                this.list.forEach(function (list) {
                    if (list.toJSON) {
                        rawData.push(list.toJSON());
                    } else {
                        rawData.push(list.data);
                    }
                })
                return rawData;
            };

            Collection.prototype.each = function (fn) {
                for (var i = 0, item = null; item = this.list[i++];) {
                    fn.call(this, item);
                }
            };

            Collection.prototype.filter = function (filters) {
                this._doFilter(filters);

                return this.list;
            };

            Collection.prototype._doFilter = _.throttle(function (filters) {
                this.each(function (item) {
                    item.hidden = false;
                    item.data.hidden = false;
                });



                this.each(function (item) {
                    if (item.hidden || item.data.hidden) return; //already hidden;

                    filters.each(function (filter) {
                        if (!filter.options.hasSelected()) return; //nothing selected, filter isn't interesting
                        filter.filterFn(item);
                    });
                });
            }, 250);

            return Collection;
        }
        return CollectionFactory;
    }
]);
