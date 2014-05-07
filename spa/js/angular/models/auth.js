_.provide('inna.Models.Auth');

inna.Models.Auth.User = function(data){
    this.raw = {
        Email: data.Email,
        LastName: data.LastName,
        FirstName: data.FirstName,
        Phone: data.FirstName
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