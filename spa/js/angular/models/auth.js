_.provide('inna.Models.Auth');

inna.Models.Auth.User = function(data){
    this.raw = data;
};

inna.Models.Auth.User.prototype.displayName = function(){
    var bits = [], name = '';

    if(this.raw.FirstName) bits.push(this.raw.FirstName);
    if(this.raw.LastName) bits.push(this.raw.LastName);

    name = bits.join(' ');

    if(name) return name;

    return this.raw.Email;
}