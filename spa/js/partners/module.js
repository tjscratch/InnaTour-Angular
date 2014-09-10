var innaModule = {
    searchFrom: {
        init: function (partner) {
            setTimeout(function () {
                innaModule.searchFrom.init_internal(partner);
            }, 0);
            
        },
        init_internal: function (partner) {
            var frameCont = document.getElementById('inna-frame');
            //скрываем контейнер, пока не загрузили фрейм и не проставили высоту
            frameCont.style.visibility = 'hidden';

            var fr = document.createElement("IFRAME");
            fr.id = "innaFrame1"
            //fr.onload = frameLoaded();
            fr.style.width = "100%";
            //начальная высота
            fr.style.height = "600px";
            //fr.style.overflow = 'hidden';

            fr.style.position = 'fixed';
            fr.style.left = 0;
            fr.style.right = 0;

            //fr.style.bottom = 0;
            //fr.style.height = '100%';
            //fr.style.top = '200px';
            //fr.style.top = 0;

            setFramePosition();

            function setFramePosition() {
                var docSize = getDocumentSize();
                //console.log('docSize');
                //console.log(docSize);

                var contPos = getPos(frameCont);
                //console.log('contPos');
                //console.log(contPos);

                fr.style.height = (docSize.y - contPos.y) + 'px';
                //fr.style.top = contPos.y + 'px';
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

            fr.border = 0;
            fr.frameBorder = 0;
            fr.src = getFrameUrl(partner);
            frameCont.appendChild(fr);

            if (window.addEventListener) {
                //console.log('addEventListener');
                window.addEventListener("message", receiveMessage, false);
            }
            else {
                //console.log('no addEventListener');
                window.attachEvent("onmessage", receiveMessage);
            }

            function getFrameUrl(partner) {
                var url = innaModule.host.replace("{0}", partner);

                //console.log(location.href);
                //console.log(location.hash);

                //если передаются урлы типа #/packages/buy/QWA5KX
                //прокидываем их к нам
                if (location.hash != null && location.hash.length > 0) {
                    url += location.hash;
                }
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
                        case 'setScrollPos': setScrollPosCmd(data); break;
                        case 'setPosition': setPositionCmd(data); break;
                    }
                }
            }

            function setVisibleCmd(data) {
                if (data.visible == true) {
                    console.log('frame setVisible', data.visible);
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

            function setScrollPosCmd(data) {
                if (data.scrollTo != null) {
                    var pos = getPos(document.getElementById('inna-frame'));
                    //console.log('frame top', pos);
                    window.scrollTo(0, data.scrollTo + pos.y);
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
