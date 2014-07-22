// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


/**
 * @type {Function|forEach|Array.forEach}
 */
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

/**
 * reduce
*/
if ( 'function' !== typeof Array.prototype.reduce ) {
    Array.prototype.reduce = function( callback /*, initialValue*/ ) {
        'use strict';
        if ( null === this || 'undefined' === typeof this ) {
            throw new TypeError(
                'Array.prototype.reduce called on null or undefined' );
        }
        if ( 'function' !== typeof callback ) {
            throw new TypeError( callback + ' is not a function' );
        }
        var t = Object( this ), len = t.length >>> 0, k = 0, value;
        if ( arguments.length >= 2 ) {
            value = arguments[1];
        } else {
            while ( k < len && ! k in t ) k++;
            if ( k >= len )
                throw new TypeError('Reduce of empty array with no initial value');
            value = t[ k++ ];
        }
        for ( ; k < len ; k++ ) {
            if ( k in t ) {
                value = callback( value, t[k], k, t );
            }
        }
        return value;
    };
}


/**
 * Filter
 */

if (!Array.prototype.filter)
{
    Array.prototype.filter = function(fun /*, thisArg */)
    {
        "use strict";

        if (this === void 0 || this === null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();

        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++)
        {
            if (i in t)
            {
                var val = t[i];

                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }

        return res;
    };
}

if (!Array.prototype.every)
{
    Array.prototype.every = function(fun /*, thisp */)
    {
        "use strict";

        if (this == null)
            throw new TypeError();

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in t && !fun.call(thisp, t[i], i, t))
                return false;
        }

        return true;
    };
}


/*if ('localStorage' in window);
else {
    window.localStorage = {
        _data: {},
        setItem: function (id, val) {
            return this._data[id] = String(val);
        },
        getItem: function (id) {
            return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
        },
        removeItem: function (id) {
            return delete this._data[id];
        },
        clear: function () {
            return this._data = {};
        }
    }
}

if ('JSON' in window);
else {
    window.JSON = {
        parse: function (sJSON) {
            return eval("(" + sJSON + ")");
        },
        stringify: function (vContent) {
            if (vContent instanceof Object) {
                var sOutput = "";
                if (vContent.constructor === Array) {
                    for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
                    return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
                }
                if (vContent.toString !== Object.prototype.toString) {
                    return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
                }
                for (var sProp in vContent) {
                    sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ",";
                }
                return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
            }
            return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
        }
    };
}

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement *//*, fromIndex *//*) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;

        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}*/

