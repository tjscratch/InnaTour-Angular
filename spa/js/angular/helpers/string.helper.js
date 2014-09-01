if(!_.isFunction(String.prototype.trim)) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

if(!_.isFunction(String.prototype.startsWith)) {
    String.prototype.startsWith = function(s){
        return (this.indexOf(s) == 0);
    }
}

var StringHelper = {
    splitToTwoColumns: function (text) {
        if (text != null) {
            var len = text.length;
            if (len > 2) {
                var index = Math.floor(len / 2);//середина текста
                var splitIndex = -1;
                for (var i = index; i < len; i++) {//ищем пробел, запяту или точку
                    if (text[i] == ' ' || text[i] == ',' || text[i] == '.') {
                        splitIndex = i;
                        break;
                    }
                }

                if (splitIndex > -1 && splitIndex < len - 1) {//делим текст на 2 части
                    return [text.substring(0, splitIndex), text.substring(splitIndex + 1, len)]
                }
            }
        }
        return [text, ''];
    },
    splitToTwoColumnsByBrDelimiter: function (text) {
        var delimiter = '[br]';
        if (text != null) {
            var len = text.length;
            if (len > 0) {
                var delimIndex = text.indexOf(delimiter);
                if (delimIndex > -1) {
                    return [text.substring(0, delimIndex), text.substring(delimIndex + delimiter.length, len)]
                }
            }
        }
        return [text, ''];
    }
};