innaAppServices.factory('modelAuth', [
    function () {

        var Auth = {};

        Auth.User = function (data) {
            this.raw = {
                AgencyId: data.AgencyId,
                Email: data.Email,
                LastName: data.LastName,
                FirstName: data.FirstName,
                Phone: data.Phone,
                MessagesCount: data.MessagesCount,
                AgencyName: data.AgencyName,
                Type: data.Type,
                AgencyActive: data.AgencyActive,
                SupportPhone: data.SupportPhone,
                IsSocial: data.IsSocial,
                AgencyPaymentWithBankCard: data.AgencyPaymentWithBankCard,
                AgencyPaymentWithSvyaznoy: data.AgencyPaymentWithSvyaznoy,
                AgencyPaymentWithTourPay: data.AgencyPaymentWithTourPay
            };
        };

        Auth.User.prototype.displayName = function () {
            var bits = [], name = '';

            if (this.raw.FirstName) bits.push(this.raw.FirstName);
            if (this.raw.LastName) bits.push(this.raw.LastName);

            name = bits.join(' ');

            if (name) return name;

            return this.raw.Email;
        }

        Auth.User.prototype.isAgency = function () {
            return this.raw.AgencyName.length > 0;
        };

        Auth.User.prototype.getType = function () {
            if (this.raw)
            {
                var res = null;
                try {
                    res = parseInt(this.raw.Type);
                }
                catch (e) { }
                return res;
            }
            return null;
        };

        Auth.User.prototype.getName = function () {
            return this.raw.AgencyName;
        };

        Auth.User.prototype.getAgencyId = function () {
            return this.raw.AgencyId;
        };

        Auth.User.prototype.isPayWithBankCardEnabled = function () {
            return this.raw.AgencyPaymentWithBankCard;
        };

        Auth.User.prototype.isPayWithSvyaznoyEnabled = function () {
            return this.raw.AgencyPaymentWithSvyaznoy;
        };

        Auth.User.prototype.isPayWithTourPayEnabled = function () {
            return this.raw.AgencyPaymentWithTourPay;
        };

        return Auth.User;
    }]);
