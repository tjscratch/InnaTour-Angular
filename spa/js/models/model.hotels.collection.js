innaAppServices.factory('ModelHotelsCollection', [
    '$timeout',
    'ModelCollection',
    'ModelRecommendedPair',
    function ($timeout, ModelCollection, ModelRecommendedPair) {

        var Hotels = {};
        Hotels.HotelsCollection = ModelCollection();

        Hotels.HotelsCollection.prototype.getMinPrice = function (bundle) {
            var min = Number.MAX_VALUE;

            this.each(function (hotel) {
                var price = hotel.data.PackagePrice;

                if (bundle) {
                    var vBundle = new modelRecommendedPair();
                    vBundle.ticket = bundle.ticket;
                    vBundle.hotel = hotel;

                    price = vBundle.getFullPackagePrice();
                }

                if (price < min) min = price;
            });

            return min;
        };

        Hotels.HotelsCollection.prototype.getMaxPrice = function () {
            var max = 0;

            this.each(function (hotel) {
                var price = hotel.data.PackagePrice;

                if (price > max) max = price;
            });

            return max;
        };

        Hotels.HotelsCollection.prototype.getVisibilityInfo = function () {
            var o = {}
            o.total = this.list.length
            o.visible = o.total;

            this.each(function (hotel) {
                if (hotel.hidden || hotel.data.hidden) o.visible--;
            });

            return o;
        };

        Hotels.HotelsCollection.prototype.sort = function (sortingFn) {
            this.list.sort(sortingFn);
        }

        Hotels.HotelsCollection.prototype.hasNext = function (hotel) {
            return !!this.getNext(hotel);
        }

        Hotels.HotelsCollection.prototype.getNext = function (hotel) {
            var index = this.list.indexOf(hotel);

            while (++index) {
                var next = this.list[index];

                if (!next) return null;

                if (!next.hidden && !next.data.hidden) return next;
            }

            return null;
        }

        Hotels.HotelsCollection.prototype.search = function (id) {
            for (var i = 0, hotel = null; hotel = this.list[i++];) {
                if (hotel.data.HotelId == id) return hotel;
            }

            return null;
        };

        Hotels.HotelsCollection.prototype.drop = function (hotel) {
            var index = this.list.indexOf(hotel);

            if (index !== -1) {
                this.list.splice(index, 1);
            }
        };

        Hotels.HotelsCollection.prototype.hideBundled = function (bundle) {
            var hotelId = bundle.hotel.data.HotelId;

            var hotel = this.search(hotelId);

            hotel && (hotel.hidden = true) && (hotel.data.hidden = true);
        }

        return Hotels.HotelsCollection;
    }
]);