window.parent.inna = {
    searchFrom: {
        init: function () {
            //alert('inna.searchFrom init');
            var fr = document.createElement("IFRAME");
            fr.id = "innaFrame1"
            fr.onload = autoResize(fr.id);
            fr.style.width = 1200 + "px";
            fr.style.height = "500px";
            //fr.style.overflow = "hidden";
            fr.border = 0;
            fr.frameBorder = 0;
            fr.src = "http://lh.inna.ru/";
            document.getElementById("inna-frame").appendChild(fr);
            //document.body.appendChild(fr);

            function autoResize(id) {
                setTimeout(function () {
                    resize(id);
                }, 0);
                //resize(id);
            }

            function resize(id) {
                var newheight;
                var newwidth;

                if (document.getElementById) {
                    var frame = document.getElementById(id);
                    newheight = frame.contentWindow.document.body.scrollHeight;
                    //newwidth = document.getElementById(id).contentWindow.document.body.scrollWidth;
                }

                console.log('newheight', newheight);
                frame.height = "";
                frame.height = (newheight) + "px";
                //document.getElementById(id).width = (newwidth) + "px";
            }
        }
    }
};