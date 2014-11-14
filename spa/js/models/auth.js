_.provide('inna.Models.Auth');

inna.Models.Auth.User = function(data){
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

inna.Models.Auth.User.prototype.displayName = function(){
    var bits = [], name = '';

    if(this.raw.FirstName) bits.push(this.raw.FirstName);
    if(this.raw.LastName) bits.push(this.raw.LastName);

    name = bits.join(' ');

    if(name) return name;

    return this.raw.Email;
}

inna.Models.Auth.User.prototype.isAgency = function () {
    return this.raw.AgencyName.length > 0;
};

inna.Models.Auth.User.prototype.getName = function () {
    return this.raw.AgencyName;
};

inna.Models.Auth.User.prototype.getAgencyId = function () {
    return this.raw.AgencyId;
};

