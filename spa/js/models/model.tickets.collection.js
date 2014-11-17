innaAppServices.factory('ModelTicketsCollection', [
    '$timeout',
    'ModelCollection',
    'ModelRecommendedPair',
    function ($timeout, ModelCollection, ModelRecommendedPair) {

        var Avia = {};
        Avia.TicketCollection = ModelCollection();

        Avia.TicketCollection.prototype.search = function (id1, id2) {
            return this.advancedSearch(function (ticket) {
                return ((ticket.data.VariantId1 == id1) && (ticket.data.VariantId2 == id2));
            });
        };

        Avia.TicketCollection.prototype.searchId = function(id){
            var L = this.list.length;
            var ticket = null;
            for (var i = 0; i < L ;i++) {
                if(this.list[i].data.VariantId1 == id){
                    ticket = this.list[i];
                }
            }
            return ticket;
        }

        Avia.TicketCollection.prototype.advancedSearch = function (criteria) {
            var DEFAULT = null;
            var ticket = DEFAULT;

            for (var i = 0; ticket = this.list[i++];) {
                if (criteria(ticket)) break;
            }

            return ticket || DEFAULT;
        }

        Avia.TicketCollection.prototype.getMinPrice = function (bundle) {
            var min = Number.MAX_VALUE;

            this.each(function(ticket){
                var price;

                if(bundle) {
                    var vBundle = new modelRecommendedPair();
                    vBundle.hotel = bundle.hotel;
                    vBundle.ticket = ticket;

                    price = vBundle.getFullPackagePrice();
                } else {
                    price = ticket.data.Price;
                }

                if (price < min) min = price;
            });

            return min;
        };

        Avia.TicketCollection.prototype.getMaxPrice = function () {
            var max = 0;

            for (var i = 0, ticket = null; ticket = this.list[i++];) {
                if (ticket.data.Price > max) max = ticket.data.Price;
            }

            return max;
        };

        Avia.TicketCollection.prototype.getVisibilityInfo = function () {
            var o = {}
            o.total = this.list.length
            o.visible = o.total;

            this.each(function (ticket) {
                if (ticket.hidden) o.visible--;
            });

            return o;
        };

        Avia.TicketCollection.prototype.sort = function (sortingFn) {
            this.list.sort(sortingFn);
        }

        Avia.TicketCollection.prototype.hideBundled = function(bundle){
            var v1 = bundle.ticket.data.VariantId1;
            var v2 = bundle.ticket.data.VariantId2;

            var ticket = this.search(v1, v2);

            ticket && (ticket.hidden = true);
        }

        return Avia.TicketCollection;
    }
]);