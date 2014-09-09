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
            fr.style.height = "500px";
            fr.style.overflow = 'hidden';
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
                return innaModule.host.replace("{0}", partner);
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

                switch(data.cmd){
                    case 'setHeight': setHeightCmd(data); break;
                    case 'setScrollPos': setScrollPos(data); break;
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

            function setScrollPos(data) {
                if (data.scrollTo != null) {
                    var pos = getPos(document.getElementById('inna-frame'));
                    //console.log('frame top', pos);
                    window.scrollTo(0, data.scrollTo + pos.y);
                }
            }
        }
    }
};

//<!-- build:module-host -->
innaModule.host = 'http://{0}.lh.inna.ru';
//<!-- endbuild -->
