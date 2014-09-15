var innaModule = {
    init: function (partner) {
        setTimeout(function () {
            innaModule.init_internal(partner);
        }, 0);
            
    },
    init_internal: function (partner) {
        var self = innaModule;
        
        var frameCont = document.getElementById('inna-frame');
        var fr = self.frameManager.createFrame();
        var src = getFrameUrl(partner);
        src = processHashParams(src);
        fr.src = src;
        frameCont.appendChild(fr);

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
            var url = innaModule.host.replace("{0}", partner);
            return url;
        }
    },

    cmdManager: new CommandManager(),
    frameManager: new FrameManager()
};

//<!-- build:module-host -->
innaModule.host = 'http://{0}.lh.inna.ru';
//<!-- endbuild -->

function FrameManager() {
    var self = this;

    self.frame = {
        lastTop: null
    };

    self.createFrame = function () {
        var frameCont = document.getElementById('inna-frame');
        //скрываем контейнер, пока не загрузили фрейм и не проставили высоту
        frameCont.style.visibility = 'hidden';

        var fr = document.createElement("IFRAME");
        fr.id = "innaFrame1"
        //fr.onload = frameLoaded();
        self.setFrameStyles(fr);
        self.setFramePosition(fr);

        return fr;
    };

    self.setFrameStyles = function (fr) {
        var docSize = getDocumentSize();
        fr.style.width = docSize.x + 'px';

        //fr.style.width = "100%";
        //начальная высота
        //fr.style.height = "600px";
        fr.style.height = "100%";
        //fr.style.overflow = 'hidden';

        fr.style.position = 'fixed';
        fr.style.left = 0;
        fr.style.top = 0;
        //fr.style.right = 0;

        //fr.style.bottom = 0;
        //fr.style.height = '100%';
        //fr.style.top = '200px';
        //fr.style.top = 0;

        fr.border = 0;
        fr.frameBorder = 0;
    }

    self.setFramePosition = function (fr) {
        self.repositionFrame(null, fr);
    }

    self.repositionFrame = function (top, fr) {
        if (!(fr != null)) {
            fr = document.getElementById("innaFrame1");
        }
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

        fr.style.width = docSize.x + 'px';
        //fr.style.height = newHeight + 'px';
        fr.style.top = newTop + 'px';

        self.frame.lastTop = newTop;
    }

    self.setVisibleCmd = function (data) {
        if (data.visible == true) {
            var frameCont = document.getElementById('inna-frame');
            frameCont.style.visibility = '';
            //console.log('frame setVisible', data.visible);
            //var frame = document.getElementById("innaFrame1");
            
            //frame.style.display = 'block';

            //var frameContainer = document.getElementById('inna-frame');
            //var frameContPos = getPos(frameContainer);
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