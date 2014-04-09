if(!_.isFunction(String.prototype.trim)) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

if(!_.isFunction(String.prototype.startsWith)) {
    String.prototype.startsWith = function(s){
        return (this.indexOf(s) != -1);
    }
}