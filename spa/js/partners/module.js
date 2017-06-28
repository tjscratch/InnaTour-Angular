var innaModule = {
    frameId: 'innaFrame1',
    init: function (partner, options) {
        setTimeout(function () {
            innaModule.init_internal(partner, options);
        }, 0);
            
    },
    commands: {
        processScrollTop: 'processScrollTop',
        clientSizeChange: 'clientSizeChange',
        frameSaveLocationUrl: 'frameSaveLocationUrl',
        frameSetLocationUrl: 'frameSetLocationUrl',
        setParentLocationHref: 'setParentLocationHref',
        setOptions: 'setOptions',
        loaded: 'loaded'
    },
    containerTopPosition: null,
    init_internal: function (partner, options) {
        var self = innaModule;

        var frameCont = document.getElementById('inna-frame');

        var wrapper = self.frameManager.createWrapper();
        var fr = self.frameManager.createFrame();

        var src = getFrameUrl(partner);
        src = processHashParams(src);
        fr.src = src;

        frameCont.appendChild(wrapper);
        wrapper.appendChild(fr);

        self.frameManager.setStyles();
        //self.frameManager.repositionFrame();

        self.cmdManager.init(self.frameManager, self.urlManager);
        self.cmdManager.options = options;

        //слушаем скролл
        self.cmdManager.addCommonEventListener(window, 'scroll', trackScroll);

        //слушаем hashchange
        //self.urlManager.listenLocationChangeEvents(function () {
        //    //прокидываем location.href во фрейм
        //    self.cmdManager.sendCommandToInnaFrame(self.commands.frameSaveLocationUrl, { 'href': location.href });
            
        //    //смена урла
        //    //if (location.hash != null && location.hash.length > 0) {
        //    //    //
        //    //    if (location.href != self.urlManager.lastSettedFromFrameUrl) {
        //    //        //console.log('listenLocationChangeEvents');
        //    //        self.cmdManager.sendCommandToInnaFrame(self.commands.frameSetLocationUrl, { 'urlHash': location.hash });
        //    //    }
        //    //    else {//если url тот же, что проставляли из фрейма
        //    //        //то просто не шлем его обратно во фрейм, и сбрасываем
        //    //        self.urlManager.lastSettedFromFrameUrl = null;
        //    //    }
        //    //}
        //});

        if (partner == 'biletix') {
            (function documentWidthFixForBiletix() {
                var el = document.querySelector("#content > .container");
                if (el) {
                    el.style.padding = '0';
                    el.style.width = '100%';
                }
            })();
        }
        else if (partner == 'ulixes') {
            //(function documentWidthFixForUlixes() {
            //    var el = document.querySelector(".page");
            //    if (el) {
            //        el.style.width = '955px';
            //    }
            //
            //    el = document.querySelector(".h-card");
            //    if (el) {
            //        el.style.paddingLeft = '0px';
            //        el.style.paddingRight = '0px';
            //    }
            //})();
        }

        function processHashParams(url) {
            //если передаются урлы типа #/packages/buy/QWA5KX
            //прокидываем их к нам
            if (location.hash != null && location.hash.length > 0) {
                url += location.hash;
            }
            return url;
        }

        function getFrameUrl(partner) {
            if (innaModule.host == ('@' + '@' + 'partnersHost')) {
                innaModule.host = 'http://{0}.lh.inna.ru'
            }
            var url = innaModule.host.replace("{0}", partner) + '/?v=1';
            return url;
        }

        function trackScroll(e) {
            if (!self.containerTopPosition) {
                self.containerTopPosition = self.frameManager.getElementPosition(frameCont).y;
            }

            var doc = document.documentElement, body = document.body;
            var top = (doc && doc.scrollTop || body && body.scrollTop || 0);
            
            var scrollTop = top - self.containerTopPosition;
            if (scrollTop < 0) {
                scrollTop = 0;
            }
            //console.log('trackScroll, scrollTop: ', scrollTop);
            self.cmdManager.sendCommandToInnaFrame(self.commands.processScrollTop, { 'top': scrollTop });
        }
    },

    cmdManager: new CommandManager(),
    frameManager: new FrameManager(),
    urlManager: new UrlManager()
};

innaModule.host = '@@partnersHost';

// innaModule.host = 'http://finam.lh.inna.ru/';

function FrameManager() {
    var self = this;

    self.frame = {
        lastTop: null
    };

    self.createWrapper = function () {
        var wrapper = document.createElement("div");
        wrapper.id = "inna-frame-wrapper";
        return wrapper;
    };

    self.createFrame = function () {
        var fr = document.createElement("iframe");
        fr.id = innaModule.frameId;
        //fr.onload = frameLoaded();
        return fr;
    };

    self.setStyles = function () {
        var docSize = getDocumentSize();

        var wrapper = document.getElementById('inna-frame-wrapper');

        //wrapper.setAttribute("style", "-webkit-overflow-scrolling: touch;");
        //wrapper.style.position = 'fixed';
        //wrapper.style.overflowY = 'auto';
        //wrapper.style.width = docSize.x + 'px';
        //wrapper.style.height = "600px";
        
        //wrapper.style.right = '0px';
        //wrapper.style.bottom = '0px';
        //wrapper.style.left = '0px';
        //wrapper.style.top = '0px';
        
        var frameCont = document.getElementById('inna-frame');
        //frameCont.style.position = 'relative';
        frameCont.style.visibility = 'hidden';

        var frame = document.getElementById(innaModule.frameId);
        frame.style.overflowX = 'hidden';
        //frame.style.overflowY = 'hidden';
        frame.style.width = "100%";
        frame.style.height = "850px";
        //frame.style.height = "99%";
        frame.style.border = "0";
        frame.style.verticalAlign = "top";
        frame.border = 0;
        frame.frameBorder = 0;
    };

    self.repositionFrame = function (top) {
        //var el = document.getElementById("inna-frame-wrapper");
        //var frameCont = document.getElementById('inna-frame');

        //var docSize = getDocumentSize();
        //var contPos = getPos(frameCont);
        //top = getNumber(top);

        //var origHeight = docSize.y - contPos.y;
        //var origTop = contPos.y;

        ////console.log('');
        ////console.log('top:', top);
        ////console.log('origHeight', origHeight);
        ////console.log('origTop', origTop);

        ////var lastTop = gietNumber(innaModule.frame.lastTop);
        ////console.log('lastTop', lastTop);

        //var newHeight = origHeight;
        //var newTop = origTop;
        //if (top != null) {
        //    newHeight = origHeight + top;
        //    newTop = origTop - top;
        //}
        //else if (self.frame.lastTop != null) {
        //    var lastTop = self.frame.lastTop;
        //    newHeight = docSize.y - lastTop;
        //    newTop = lastTop;
        //}

        //if (newHeight > docSize.y) {
        //    newHeight = docSize.y;
        //}
        //if (newTop < 0) {
        //    newTop = 0;
        //}

        ////console.log('newHeight', newHeight);
        ////console.log('newTop', newTop);

        //el.style.width = docSize.x + 'px';
        //el.style.height = newHeight + 'px';
        //el.style.top = newTop + 'px';

        //self.frame.lastTop = newTop;
    };

    self.setVisibleCmd = function (data) {
        if (data.visible == true) {
            var frameCont = document.getElementById('inna-frame');
            frameCont.style.visibility = '';
        }
    };

    self.setFrameScrollToCmd = function (data) {
        //скролит сайт внутри фрейма
        if (data.scrollTo != null) {
            window.scrollTo(0, data.scrollTo);
        }
    };

    self.smoothScroll = function (from, to) {
        var smooth = 2;
        var speed = 2;
        var fromSteps = Math.round(from / smooth);
        var maxSteps = Math.round(to / smooth);
        var t = 0;
        for (var i = fromSteps; i < maxSteps; i++) {
            var scroll = i * smooth;
            var time = t * speed;
            t++;
            setTimeout(
                (function (scroll, time) {
                    return function () {
                        window.scrollTo(0, scroll);
                    }
                })(scroll, time),
                time);
        }
    };

    self.setFrameScrollPage = function (data) {
        var headerHeight = document.querySelector("#inna-frame")
        var iframeTop = utils.getCoords(headerHeight).top;
        var scrollTop = data.scrollPage + iframeTop;
        //плавный скролл
        var smooth = data.smooth;
        var maxHeight = data.maxHeight + iframeTop;
        var docHeight = getDocumentSize().y;
        //скролит сайт внутри фрейма
        if (data.scrollPage != null) {
            if (smooth) {
                var doc = document.documentElement;
                //текущее положение скролла
                var curScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                //если высоты документа не хватает
                if (docHeight < maxHeight && curScrollTop + 2 < scrollTop) {
                    self.smoothScroll(curScrollTop, scrollTop);
                }
            }
            else {
                window.scrollTo(0, scrollTop);
            }
        }
    };

    self.setScrollTopCmd = function (data) {
        //задает позицию фрейма, чтобы занимал весь экран
        if (data.top != null) {
            //console.log('setScrollTopCmd, top:', data.top);
            //self.repositionFrame(data.top);
        }
    };

    self.setHeightCmd = function (data) {
        //console.log('setHeightCmd, height:', data.height);
        if (data.height != null) {
            //console.log('setHeightCmd, height:', data.height);
            var frame = document.getElementById(innaModule.frameId);
            frame.style.height = data.height + "px";
        }
    };

    self.getElementPosition = function (el) {
        return getPos(el);
    };

    self.getDocumentSize = function () {
        return getDocumentSize();
    };

    function getPos(el) {
        for (var lx = 0, ly = 0;
             el != null;
             lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return { x: lx, y: ly };
    }

    function getDocumentSize() {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight || e.clientHeight || g.clientHeight;
        return { x: x, y: y };
    }

    function getNumber(val) {
        if (val && val.length > 0) {
            val = val.replace("px", "");
            val = parseInt(val);
        }
        return val;
    }
}

function CommandManager() {
    var self = this;

    self.frameManager = null;
    self.urlManager = null;

    self.init = function (frameManager, urlManager) {
        self.frameManager = frameManager;
        self.urlManager = urlManager;
        self.initEventListeners();
    };

    self.initEventListeners = function () {
        self.addCommonEventListener(window, 'message', self.receiveMessage);
        //self.addCommonEventListener(window, 'resize', self.frameManager.repositionFrame);
    };

    self.receiveMessage = function (event) {
        var data = {};
        try {
            data = JSON.parse(event.data);
        }
        catch (e) {
        }

        //if (event.origin !== "http://lh.inna.ru")
        //    return;

        if (data) {
            switch (data.cmd) {
                case 'loaded': {
                    //save location
                    self.sendCommandToInnaFrame(innaModule.commands.frameSaveLocationUrl, { 'href': location.href });

                    //console.log('options', self.options);
                    if (self.options) {
                        //set custom partner css
                        self.sendCommandToInnaFrame(innaModule.commands.setOptions, { 'options': self.options });
                    }
                    break;
                }
                case 'setHeight': self.frameManager.setHeightCmd(data); break;
                case 'setVisible':
                    {
                        self.frameManager.setVisibleCmd(data);
                        //отправляем размер клиентской области
                        var frameCont = document.getElementById('inna-frame');
                        self.sendCommandToInnaFrame(innaModule.commands.clientSizeChange, {
                            'doc': self.frameManager.getDocumentSize(),
                            'top': self.frameManager.getElementPosition(frameCont).y
                        });

                        break;
                    }
                case 'setFrameScrollTo': self.frameManager.setFrameScrollToCmd(data); break;
                case 'setScrollPage': self.frameManager.setFrameScrollPage(data); break;
                case 'setScrollTop': self.frameManager.setScrollTopCmd(data); break;

                case 'saveUrlToParent': self.urlManager.saveUrlCmd(data); break;

                case 'setParentLocationHref': self.processSetParentLocationHref(data); break;
            }
        }
    };

    self.processSetParentLocationHref = function (data) {
        if (data.url && data.url.length > 0) {
            var url = data.url;
            var host = location.host;
            location.href = url;

            // console.log('location.host: ' + host + ' data.url: ' + data.url);
            //если урл, по которому нужно перейти на том же домене - рефрешим, чтобы ангулар перезагрузил страницу
            //if (host && host.length > 0 && url.indexOf(host) > -1 || (url.indexOf('file://') == 0)) {
            //    console.log('reload');
            //    window.location.reload();
            //}
        }
    };

    self.addCommonEventListener = function (el, event, fn) {
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else {
            el.attachEvent('on' + event, fn);
        }
    };

    self.sendCommandToInnaFrame = function (cmd, data) {
        if (arguments && arguments.length > 1) {

            var obj = arguments[1];
            var keys = [];
            for (var k in obj) keys.push(k);

            //ставим команду
            var cmdObj = { 'cmd': arguments[0] };
            var data = arguments[1];

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                //ставим данные
                cmdObj[key] = data[key];
            }
            var msg = JSON.stringify(cmdObj);
            //console.log('sendCommandToInnaFrame, msg:', msg);
            var frame = document.getElementById(innaModule.frameId);
            if (frame && frame.contentWindow) {
                frame.contentWindow.postMessage(msg, '*');
            }
        }
    }
}

function UrlManager() {
    var self = this;

    self.lastSettedFromFrameUrl = null;

    self.addCommonEventListener = function (el, event, fn) {
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else {
            el.attachEvent('on' + event, fn);
        }
    };

    self.lastHref = null;
    self.listenLocationChangeEvents = function(fn){
        //self.addCommonEventListener(window, 'hashchange', function () {
        //    if (fn) {
        //        fn();
        //    }
        //    //console.log('listenLocationChangeEvents, location.href:', location.href);
        //});
        setInterval(function () {
            if (location.href != self.lastHref) {
                self.lastHref = location.href;
                if (fn) {
                    fn();
                }
            }
        }, 100);
    };

    self.saveUrlCmd = function (data) {
        if (data && data.url) {
            var newUrl = getNewHashUrl(data.url);

            if (location.href != newUrl) {
                //запоминаем последний проставленный url
                self.lastSettedFromFrameUrl = newUrl;
                location.href = newUrl;
            }
        }
    };

    function getNewHashUrl(url) {
        //console.log('self.saveUrlCmd', url);
        var curUrl = location.href;
        var indexOfHash = curUrl.indexOf("#");
        var newUrl;
        if (indexOfHash > -1) {
            newUrl = curUrl.substring(0, indexOfHash);
            newUrl = newUrl + url;
        }
        else {
            newUrl = curUrl + url;
        }
        //console.log('self.saveUrlCmd, newUrl:', newUrl);
        return newUrl;
    }
}


var utils = {
    getCoords: function (elem) {
        // (1)
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docEl = document.documentElement;

        // (2)
        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        // (3)
        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        // (4)
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;
        var bottom = box.bottom;

        // (5)
        return {
            top: Math.round(top),
            left: Math.round(left),
            bottom: Math.round(bottom)
        };
    }
};