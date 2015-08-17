var http            = require('http'),
    //debug           = require('debug')('Express-seed:server'),
    express         = require('express'),
    //counters        = require('./counters'),
    path            = require('path'),
    logger          = require('morgan'),
    nconf           = require("nconf"),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    exphbs          = require('express-handlebars'),
    cookieParser    = require('cookie-parser');

/**
 *  Модуль nconf - для удобного доступа к настройкам
 *  file settings - config/config.json
 */
nconf.argv().env().file({ file: __dirname + '/config/config.json' });
global.__templDir__ = __dirname + "/templates";

var app = express();
var port = normalizePort(process.env.PORT || nconf.get('port'));
app.set('port', port);
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
//counters.init();
//app.use(counters.trace);

app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/build', express.static(path.join(__dirname, '../build')));


//app.use(cookieParser(nconf.get('cookie:secret')));

var routes = require('./routes/index');

app.use('/', routes);


/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(app.get('port'));

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    //debug('Listening on ' + bind);
    console.log('node app started');
}
