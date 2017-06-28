module.exports = {
    init: function () {
        global.reqCount = 0;
        global.reqStart = Date.now();
        wasInited = true;
    },
    trace: function (req, res, next) {
        global.reqCount += 1;
        req.startTime = Date.now();
        next();
    },
    print: function (req, res) {
        //время выполнения
        var duration = Date.now() - req.startTime;

        //подсчитываем каждые n запросов
        //if (global.reqCount % 1000 == 0) {
        //    var reqCountTime = Date.now() - global.reqStart;
        //    var reqPerSec = global.reqCount / (reqCountTime / 1000);
        //    global.reqCount = 0;
        //    global.reqStart = Date.now();
        //    console.log('time:', reqCountTime, 'ms', 'reqPerSec:', reqPerSec);
        //}

        // console.log('req', req.originalUrl, '-', duration + 'ms');
        res.setHeader('X-Response-Time', duration + 'ms');
    },
    eof: null
};
