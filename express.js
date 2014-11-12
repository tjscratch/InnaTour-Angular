var express = require('express')
    , path = require('path')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , cookieParser = require('cookie-parser')
    , cookieSession = require('cookie-session')
    , session = require('express-session');


var app = express();
app.set('port', process.env.PORT || 8077);
app.set('views', __dirname);
/*app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);*/


/**
 * Перехватываем все GET запросы и проверяем:
 * Если req.xhr, то передаем управление на след. роутер
 * Иначе рендерим шаблон (index.html)
 */
app.route('*/?')
    .get(function (req, res, next) {
        if (req.xhr) {
            next();
        }
        else {
            res.sendFile(__dirname + '/index.html');
        }
    })

var server = app.listen(app.get('port'));
