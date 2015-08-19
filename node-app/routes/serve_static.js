path            = require('path');

//отдаем app-main.js из папки с билдами с ноды
var appMainJsRe = /^\/(build.*)\/app-main.js$/;
module.exports = function (req, res, next) {
    if (req.method !== 'GET') {
        next();
        return;
    }

    if (appMainJsRe.test(req.path)){
        var match = appMainJsRe.exec(req.path);
        var folder = match[1];
        var fullPath = path.join(__dirname, '/../../' + folder + '/app-main.js');
        res.sendFile(fullPath);
    }
    else {
        next();
        return;
    }
};
