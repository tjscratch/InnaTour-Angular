var fs = require('fs');

var result = '';

fs.readdir('img/flags', function (err, files) {
    files.forEach(function (file) {
        if (file.indexOf('png') != -1) {
            result += '\n.icon-flag-' + file.match(/(\w+)/)[0] + ' {\n' +
                '\t' + 'background: url(/img/flags/' + file + ');\n' +
                '\t' + 'height: 20px;\n' +
                '\t' + 'width: 30px;\n' +
                '}';
        }
    });


});