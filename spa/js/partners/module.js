var innaModule = {
    init: function (partner) {
        setTimeout(function () {
            innaModule.init_internal(partner);
        }, 0);
            
    },
    init_internal: function (partner) {
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
        self.frameManager.repositionFrame();

        self.cmdManager.init(innaModule.frameManager);

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
            var url = innaModule.host.replace("{0}", partner);
            return url;
        }
    },

    cmdManager: new CommandManager(),
    frameManager: new FrameManager()
};

innaModule.host = '@@partnersHost';


//innaModule.host = 'http://192.168.105.54';

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
        fr.id = "innaFrame1"
        //fr.onload = frameLoaded();
        return fr;
    };

    self.setStyles = function () {
        var docSize = getDocumentSize();

        var wrapper = document.getElementById('inna-frame-wrapper');
        
        wrapper.setAttribute("style", "-webkit-overflow-scrolling: touch;");
        wrapper.style.position = 'fixed';
        wrapper.style.overflowY = 'auto';
        wrapper.style.width = docSize.x + 'px';
        wrapper.style.height = "600px";
        
        wrapper.style.right = '0px';
        wrapper.style.bottom = '0px';
        wrapper.style.left = '0px';
        wrapper.style.top = '0px';
        
        var frameCont = document.getElementById('inna-frame');
        frameCont.style.position = 'relative';
        frameCont.style.visibility = 'hidden';

        var frame = document.getElementById('innaFrame1');
        frame.style.width = "100%";
        frame.style.height = "99%";
        frame.style.border = "0";
        frame.border = 0;
        frame.frameBorder = 0;
    }

    self.repositionFrame = function (top) {
        var el = document.getElementById("inna-frame-wrapper");
        var frameCont = document.getElementById('inna-frame');

        var docSize = getDocumentSize();
        var contPos = getPos(frameCont);
        top = getNumber(top);

        var origHeight = docSize.y - contPos.y;
        var origTop = contPos.y;

        //console.log('');
        //console.log('top:', top);
        //console.log('origHeight', origHeight);
        //console.log('origTop', origTop);

        //var lastTop = gietNumber(innaModule.frame.lastTop);
        //console.log('lastTop', lastTop);

        var newHeight = origHeight;
        var newTop = origTop;
        if (top != null) {
            newHeight = origHeight + top;
            newTop = origTop - top;
        }
        else if (self.frame.lastTop != null) {
            var lastTop = self.frame.lastTop;
            newHeight = docSize.y - lastTop;
            newTop = lastTop;
        }

        if (newHeight > docSize.y) {
            newHeight = docSize.y;
        }
        if (newTop < 0) {
            newTop = 0;
        }

        //console.log('newHeight', newHeight);
        //console.log('newTop', newTop);

        el.style.width = docSize.x + 'px';
        el.style.height = newHeight + 'px';
        el.style.top = newTop + 'px';

        self.frame.lastTop = newTop;
    }

    self.setVisibleCmd = function (data) {
        if (data.visible == true) {
            var frameCont = document.getElementById('inna-frame');
            frameCont.style.visibility = '';
        }
    }

    self.setFrameScrollToCmd = function (data) {
        //скролит сайт внутри фрейма
        if (data.scrollTo != null) {
            window.scrollTo(0, data.scrollTo);
        }
    }

    self.setScrollTopCmd = function (data) {
        //задает позицию фрейма, чтобы занимал весь экран
        if (data.top != null) {
            //console.log('setScrollTopCmd, top:', data.top);
            self.repositionFrame(data.top);
        }
    }

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

    self.init = function (frameManager) {
        self.frameManager = frameManager;
        self.initEvents();
    }

    self.initEvents = function () {
        self.addCommonEventListener(window, 'message', self.receiveMessage);
        self.addCommonEventListener(window, 'resize', self.repositionFrame);
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
                case 'setVisible': self.frameManager.setVisibleCmd(data); break;
                case 'setFrameScrollTo': self.frameManager.setFrameScrollToCmd(data); break;
                case 'setScrollTop': self.frameManager.setScrollTopCmd(data); break;
            }
        }
    };

    self.addCommonEventListener = function (el, event, fn) {
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else {
            el.attachEvent('on' + event, fn);
        }
    };
}