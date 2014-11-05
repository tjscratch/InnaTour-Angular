innaAppServices.factory('modelTickets', [
    '$timeout',
    'modelCollection',
    'modelRecommendedPair',
    function ($timeout, modelCollection, modelRecommendedPair) {

        var Avia = {};
        Avia.TicketCollection = modelCollection();

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

        Avia.Ticket = function (opt_data) {
            this.data = null;
            this.raw = null;
            this.hidden = false;

            if(opt_data){
                this.setData(opt_data);
            }
        };

        Avia.Ticket.prototype.setData = function (data) {
            this.raw = angular.copy(data);
            this.data = angular.copy(data);

            if (this.data) {
                for (var i = 0, dir = ''; dir = ['To', 'Back'][i++];) {
                    var etaps = this.data['Etaps' + dir];

                    for (var j = 0, len = etaps.length; j < len; j++) {
                        etaps[j] = new Avia.Ticket.Etap(etaps[j]);
                    }
                }
                this.data.ArrivalDate = dateHelper.apiDateToJsDate(this.data.ArrivalDate);
                this.data.BackArrivalDate = dateHelper.apiDateToJsDate(this.data.BackArrivalDate);
                this.data.DepartureDate = dateHelper.apiDateToJsDate(this.data.DepartureDate);
                this.data.BackDepartureDate = dateHelper.apiDateToJsDate(this.data.BackDepartureDate);
            }
        };

        Avia.Ticket.__getDuration = function (raw, hoursIndicator, minutesIndicator) {
            if(!raw) return '';

            var hours = Math.floor(raw / 60);
            var mins = raw % 60;

            return hours + ' ' + hoursIndicator + (
                mins ? (' ' + mins + ' ' + minutesIndicator) : ''
                );
        };

        Avia.Ticket.prototype.getDuration = function (dir) {
            return Avia.Ticket.__getDuration(this.data['Time' + dir], 'ч.', 'мин.');
        };

        Avia.Ticket.prototype.getDate = function (dir, type) {
            dir = {'To': '', 'Back': 'Back'}[dir]
            type = [dir, type, 'Date'].join('');

            return this.data[type];
        }

        Avia.Ticket.prototype.getEtaps = function (dir) {
            return this.data['Etaps' + dir];
        };

        Avia.Ticket.prototype.everyEtap = function (cb) {
            for (var i = 0, dir = '', etaps = null; (dir = ['To', 'Back'][i++]) && (etaps = this.getEtaps(dir));) {
                for (var j = 0, etap = null; etap = etaps[j++];) {
                    cb.call(this, etap);
                }
            }
        }

        Avia.Ticket.prototype.getNextEtap = function (dir, current) {
            var etaps = this.getEtaps(dir);
            var i = etaps.indexOf(current);

            return etaps[++i];
        };

        Avia.Ticket.prototype.collectAirlines = function () {
            var airlines = [];
            var transportersList = [];

            this.everyEtap(function(etap){
                airlines.push([etap.data.TransporterCode, etap.data.TransporterName]);
                transportersList.push({
                    code : etap.data.TransporterCode,
                    name : etap.data.TransporterName
                });
            });

            // TODO: deprecated
            var collected = _.object(airlines);

            var transportersListUniq = _.uniq(angular.copy(transportersList), false, function (tr) {
                return tr.code
            });

            return {
                airlines : transportersListUniq,
                size: transportersListUniq.length,

                // TODO: deprecated
                etap: collected
            }
        };

        Avia.Ticket.prototype.getBackOutCode = function(){
            var etapsBack = this.getEtaps('Back');
            var lastEtap = etapsBack[0];

            return lastEtap.data.OutCode;
        }

        Avia.Ticket.prototype.getBackInCode = function(){
            var etapsBack = this.getEtaps('Back');
            var lastEtap = etapsBack[etapsBack.length - 1];

            return lastEtap.data.InCode;
        };

        Avia.Ticket.Etap = function (data) {
            this.data = data;
        };

        Avia.Ticket.Etap.prototype.getDateTime = function (dir) {
            return dateHelper.apiDateToJsDate(this.data[dir + 'Time']);
        };

        Avia.Ticket.Etap.prototype.getDuration = function () {
            return Avia.Ticket.__getDuration(this.data.WayTime, 'ч.', 'м');
        };

        Avia.Ticket.Etap.prototype.getLegDuration = function () {
            var a = dateHelper.apiDateToJsDate(this.data.InTime);
            var b = dateHelper.apiDateToJsDate(this.data.NextTime);
            var diffMSec = b - a;
            var diffMin = Math.floor(diffMSec / 60000);

            return Avia.Ticket.__getDuration(diffMin, 'ч.', 'мин.');
        };

        return Avia.Ticket;
    }
]);