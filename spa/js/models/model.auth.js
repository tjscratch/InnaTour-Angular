innaAppServices.factory('modelHotels', [
    function () {

        var Auth = {};

        Auth.User = function (data) {
            this.raw = {
                Email: data.Email,
                LastName: data.LastName,
                FirstName: data.FirstName,
                Phone: data.Phone,
                MessagesCount: data.MessagesCount,
                AgencyName: data.AgencyName,
                Type: data.Type,
                AgencyActive: data.AgencyActive,
                SupportPhone: data.SupportPhone,
                IsSocial: data.IsSocial
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
    }]);