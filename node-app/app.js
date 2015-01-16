var express = require('express')
    , counters = require('./counters')
    //, path = require('path')
    //, morgan = require('morgan')
    , nconf = require("nconf")
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , exphbs  = require('express-handlebars');

/**
 *  Модуль nconf - для удобного доступа к настройкам
 *  file settings - config/config.json
 */
nconf.argv().env().file({ file: __dirname + '/config/config.json' });
global.__templDir__ = __dirname + "/templates";

var app = express();
app.set('port', process.env.PORT || nconf.get('port'));
app.set('views', __templDir__);

app.engine('hbs', exphbs({
    extname:'hbs',
    defaultLayout:'index',
    layoutsDir : __templDir__ + "/layouts/",
    partialsDir : __templDir__ + "/partials/"
}));

app.enable('view cache');
app.set('view engine', 'hbs');

//замер времени выполнения запросов
counters.init();
app.use(counters.trace);
//app.use(morgan('dev', { immediate: true }));


//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(methodOverride());

//app.use(cookieParser(nconf.get('cookie:secret')));

require(__dirname + '/routes')(app);

var server = app.listen(app.get('port'));

