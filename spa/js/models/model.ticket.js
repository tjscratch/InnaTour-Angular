innaAppServices.factory('ModelTicket', [
    '$timeout',
    'ModelTicketsCollection',
    'ModelRecommendedPair',
    function ($timeout, ModelTicketsCollection, ModelRecommendedPair) {

        var Avia = ModelTicketsCollection;
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
            // var airlines = [];
            // var transportersList = [];
            //
            // this.everyEtap(function(etap){
            //     airlines.push([etap.data.TransporterCode, etap.data.TransporterName]);
            //     transportersList.push({
            //         code : etap.data.TransporterCode,
            //         name : etap.data.TransporterName
            //     });
            // });
            //
            // // TODO: deprecated
            // var collected = _.object(airlines);
            //
            // var transportersListUniq = _.uniq(angular.copy(transportersList), false, function (tr) {
            //     return tr.code
            // });
            //
            // return {
            //     airlines : transportersListUniq,
            //     size: transportersListUniq.length,
            //     // TODO: deprecated
            //     etap: collected
            // }

            return {
                codeTo: this.getToOutTransporterName().code,
                nameToTransporter: this.getToOutTransporterName().name,
                codeBack: this.getBackOutTransporterName().code,
                nameBackTransporter: this.getBackOutTransporterName().name
            }
        };

        Avia.Ticket.prototype.getToOutTransporterName = function () {
            var etapsTo = this.getEtaps('To');
            var oneEtap = etapsTo[0];

            // return oneEtap.data.TransporterCode;
            return {
                code: oneEtap.data.TransporterCode,
                name: oneEtap.data.TransporterName
            }
        }

        Avia.Ticket.prototype.getBackOutTransporterName = function () {
            var etapsBack = this.getEtaps('Back');
            var oneEtap = etapsBack[0];

            // return oneEtap.data.TransporterCode;
            return {
                code: oneEtap.data.TransporterCode,
                name: oneEtap.data.TransporterName
            }
        }

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

        Avia.Ticket.prototype.airLogo = function(logo){
            var groupLogo = "/spa/img/group.png";
            var statickLogo = app_main.staticHost + "/Files/logo/" + logo + ".png";
            var imageUrl = (logo == 'many') ? groupLogo : statickLogo;
            return  imageUrl;
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