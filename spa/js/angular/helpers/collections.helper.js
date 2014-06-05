_.generateRange = function(start, end){
    var list = [start];
    if (start < end) {
        while (start !== end) {
            start++;
            list.push(start);
        }
    }
    return list;
}

_.dropEmptyKeys = function(obj, supposeEmpty) {
    for(var p in obj) if(obj.hasOwnProperty(p)) {
        if(!obj[p]) delete obj[p];
    }

    return obj;
}

_.flattenObject = function(obj, _prefix, _result) {
    _result = _result || {}
    _prefix = _prefix || '';

    for(var p in obj) if(obj.hasOwnProperty(p)) {
        var key = _prefix && [_prefix, p].join('.') || p;

        if(_.isObject(obj[p]) && !_.isArray(obj[p])) {
            _.flattenObject(obj[p], key, _result);
        } else {
            _result[key] = obj[p];
        }
    }

    return _result;
};

_.dropByJPath = function(object, jPath){
    var dropper = new Function('obj', 'delete obj.' + jPath);

    dropper(object);

    return object;
}

_.provide = function(jPath){
    var bits = jPath.split('.');
    var bit, o = window;

    while(bit = bits.shift()) {
        o = o[bit] || (o[bit] = {});
    }

    return o;
}