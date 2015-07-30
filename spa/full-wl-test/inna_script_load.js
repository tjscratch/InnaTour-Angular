var scriptScheme = 'http://';
var scriptHost = 'beta.';
var scriptPath = 'inna.ru/spa/js/partners/v1/module.js';

var hostName = location.hostname;
var reLocal = /\.lh\.inna\.ru/i;
var reTest = /\.test\.inna\.ru/i;
var reBeta = /\.beta\.inna\.ru/i;
var reRelease = /\.inna\.ru/i;

if (reLocal.test(hostName)){
    scriptHost = 'lh.';
    scriptPath = 'inna.ru/spa/js/partners/module.js';
}
else if (reTest.test(hostName)){
    scriptHost = 'test.';
}
else if (reBeta.test(hostName)){
    scriptHost = 'beta.';
}
else if (reRelease.test(hostName)){
    scriptScheme = 'https://';
    scriptHost = '';
}

//scriptHost = 'lh.';

var scriptUrl = scriptScheme + scriptHost + scriptPath;
document.write('<script type="text/javascript" src="' + scriptUrl + '"><\/script>');
console.log('loaded inna script:', scriptUrl);