var innaModule = {
    frame: {
        lastTop: null
    },
    searchForm: {
        init: function (partner) {
            setTimeout(function () {
                innaModule.searchForm.init_internal(partner);
            }, 0);
            
        },
        init_internal: function (partner) {
            var frameCont = document.getElementById('inna-frame');
            //скрываем контейнер, пока не загрузили фрейм и не проставили высоту
            frameCont.style.visibility = 'hidden';

            var fr = document.createElement("IFRAME");
            fr.id = "innaFrame1"
            //fr.onload = frameLoaded();
            setFrameStyles(fr);
            setFramePosition(fr);

            var src = getFrameUrl(partner);
            src = processHashParams(src);
            fr.src = src;

            frameCont.appendChild(fr);

            addCommonEventListener(window, 'message', receiveMessage);
            addCommonEventListener(window, 'resize', trackResize);

            var timeoutId = null;
            function trackResize() {
                //console.log('trackResize');
                repositionFrame();
            }

            function setFramePosition(fr) {
                repositionFrame(null, fr);
            }

            function getNumber(val) {
                if (val && val.length > 0) {
                    val = val.replace("px", "");
                    val = parseInt(val);
                }
                return val;
            }

            function repositionFrame(top, fr) {
                if (!(fr != null)) {
                    fr = document.getElementById("innaFrame1");
                }

                var docSize = getDocumentSize();
                var contPos = getPos(frameCont);
                top = getNumber(top);

                var origHeight = docSize.y - contPos.y;
                var origTop = contPos.y;

                //console.log('');
                //console.log('top:', top);
                //console.log('origHeight', origHeight);
                //console.log('origTop', origTop);

                //var lastTop = getNumber(innaModule.frame.lastTop);
                //console.log('lastTop', lastTop);

                var newHeight = origHeight;
                var newTop = origTop;
                if (top != null) {
                    newHeight = origHeight + top;
                    newTop = origTop - top;
                }
                else if (innaModule.frame.lastTop != null) {
                    var lastTop = innaModule.frame.lastTop;
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
                fr.style.height = newHeight + 'px';
                fr.style.top = newTop + 'px';

                innaModule.frame.lastTop = newTop;
            }

            function setFrameStyles(fr) {
                fr.style.width = "100%";
                //начальная высота
                fr.style.height = "600px";
                //fr.style.overflow = 'hidden';

                fr.style.position = 'absolute';
                fr.style.left = 0;
                //fr.style.right = 0;

                //fr.style.bottom = 0;
                //fr.style.height = '100%';
                //fr.style.top = '200px';
                //fr.style.top = 0;

                fr.border = 0;
                fr.frameBorder = 0;
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

            function addCommonEventListener(el, event, fn) {
                if (el.addEventListener) {
                    el.addEventListener(event, fn, false);
                } else {
                    el.attachEvent('on' + event, fn);
                }
            };

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

            function receiveMessage(event) {
                var data = {};
                try
                {
                    data = JSON.parse(event.data);
                }
                catch(e){
                }
                
                //if (event.origin !== "http://lh.inna.ru")
                //    return;

                if (data) {
                    switch (data.cmd) {
                        case 'setVisible': setVisibleCmd(data); break;
                        case 'setHeight': setHeightCmd(data); break;
                        case 'setFrameScrollTo': setFrameScrollToCmd(data); break;
                        case 'setPosition': setPositionCmd(data); break;
                        case 'setScrollTop': setScrollTopCmd(data); break;
                    }
                }
            }

            function setScrollTopCmd(data) {
                //задает позицию фрейма, чтобы занимал весь экран
                if (data.top != null) {
                    //console.log('setScrollTopCmd, top:', data.top);
                    repositionFrame(data.top);
                }
            }

            function setVisibleCmd(data) {
                if (data.visible == true) {
                    //console.log('frame setVisible', data.visible);
                    var frame = document.getElementById("innaFrame1");
                    frameCont.style.visibility = '';
                    frame.style.display = 'block';

                    var frameContainer = document.getElementById('inna-frame');
                    var frameContPos = getPos(frameContainer);
                }
            }

            function setHeightCmd(data) {
                if (data.height != null) {
                    var frame = document.getElementById("innaFrame1");

                    console.log('frame set height', data.height);
                    if (data.height > 0) {
                        frame.style.height = data.height + "px";
                    }

                    frameCont.style.visibility = '';
                    frame.style.display = 'block';
                }
            }

            function getPos(el) {
                for (var lx = 0, ly = 0;
                     el != null;
                     lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
                return { x: lx, y: ly };
            }

            function setFrameScrollToCmd(data) {
                //скролит сайт внутри фрейма
                if (data.scrollTo != null) {
                    //var pos = getPos(document.getElementById('inna-frame'));
                    //console.log('frame top', pos);
                    window.scrollTo(0, data.scrollTo);
                }
            }

            function setPositionCmd(data) {
                //console.log('setPositionCmd');
                //console.log(data);
                //var frame = document.getElementById("innaFrame1");
                //frame.style.height = data.height - data.top;
                //frame.style.top = data.top;
            }
        }
    }
};

//<!-- build:module-host -->
innaModule.host = 'http://{0}.lh.inna.ru';
//<!-- endbuild -->
