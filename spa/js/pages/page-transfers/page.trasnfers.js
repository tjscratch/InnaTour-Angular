
innaAppControllers.
    controller('TrasnfersPageCtrl', [
        '$scope',
        function ($scope) {
            $scope.test = 'asdasdasd';

            $scope.tabs = [
                {name:'Индивидуальный', active:true, url:'spa/files/individual-transfers.xlsx'},
                {name:'Групповой', url:'spa/files/group-transfers.xlsx'}
            ];

            $scope.activeTab = $scope.tabs[0];
            //init
            getDataForActiveTab();

            $scope.tabs.click = function (tab, $event) {
                $event.preventDefault();

                for(var i=0; i<$scope.tabs.length; i++) {
                    $scope.tabs[i].active = false;
                }
                tab.active = true;
                $scope.activeTab = tab;

                if (tab.data) {
                }
                else {
                    getDataForActiveTab();
                }
            };

            function getDataForActiveTab() {
                getXMLFile($scope.activeTab.url, function (wb) {
                    $scope.safeApply(function () {
                        $scope.activeTab.data = toDataArray(wb);
                    });
                });
            }

            function toDataArray(workbook){
                var sheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[sheetName];

                var result = [];
                var lastRow = -1;
                var curRow = 0;
                var lastObj = {};
                for (z in worksheet) {
                    /* all keys that do not begin with "!" correspond to cell addresses */
                    if(z[0] === '!') continue;

                    curRow = +('' + z).substring(1);
                    //пропускаем первые 2 ряда
                    if(curRow <= 2) continue;

                    if (lastRow != curRow) {
                        lastObj = {};
                        result.push(lastObj);
                        lastRow = curRow;
                    }

                    //if (curRow == 7 || curRow == 8) {
                    //    console.log(z, worksheet[z]);
                    //}

                    var val = worksheet[z].v.toString();
                    if (z[0] == 'A'){
                        lastObj.from = val;
                    }
                    else if (z[0] == 'B') {
                        lastObj.to = val;
                    }
                    else if (z[0] == 'C') {
                        if (val.indexOf('$') == -1){
                            val = val.replace(/\s/g,'') + '€';
                        }
                        lastObj.price = val;
                    }
                    else if (z[0] == 'D') {
                        lastObj.notes = val;
                    }
                }

                return result;
            }

            function getXMLFile(url, callback){

                var oReq;
                if(window.XMLHttpRequest) oReq = new XMLHttpRequest();
                else if(window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
                else throw "XHR unavailable for your browser";

                oReq.open("GET", url, true);

                var options = {type:"binary", cellNF:true};
                //var options = {type:"binary"};

                if(typeof Uint8Array !== 'undefined') {
                    oReq.responseType = "arraybuffer";
                    oReq.onload = function(e) {
                        //if(typeof console !== 'undefined') console.log("onload", new Date());
                        var arraybuffer = oReq.response;
                        var data = new Uint8Array(arraybuffer);
                        var arr = new Array();
                        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                        var wb = XLSX.read(arr.join(""), options);
                        callback(wb);
                    };
                } else {
                    oReq.setRequestHeader("Accept-Charset", "x-user-defined");
                    oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
                        var ff = convertResponseToText(oReq.responseBody);
                        //if(typeof console !== 'undefined') console.log("onload", new Date());
                        var wb = XLSX.read(ff, options);
                        callback(wb);
                    } };
                }

                oReq.send();
            }

            function convertResponseToText(){
                if(/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                    var IEBinaryToArray_ByteStr_Script =
                        "<!-- IEBinaryToArray_ByteStr -->\r\n"+
                        "<script type='text/vbscript'>\r\n"+
                        "Function IEBinaryToArray_ByteStr(Binary)\r\n"+
                        "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n"+
                        "End Function\r\n"+
                        "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n"+
                        "   Dim lastIndex\r\n"+
                        "   lastIndex = LenB(Binary)\r\n"+
                        "   if lastIndex mod 2 Then\r\n"+
                        "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n"+
                        "   Else\r\n"+
                        "       IEBinaryToArray_ByteStr_Last = "+'""'+"\r\n"+
                        "   End If\r\n"+
                        "End Function\r\n"+
                        "</script>\r\n";

                    // inject VBScript
                    document.write(IEBinaryToArray_ByteStr_Script);
                }

                var convertResponseBodyToText = function (binary) {
                    var byteMapping = {};
                    for ( var i = 0; i < 256; i++ ) {
                        for ( var j = 0; j < 256; j++ ) {
                            byteMapping[ String.fromCharCode( i + j * 256 ) ] =
                                String.fromCharCode(i) + String.fromCharCode(j);
                        }
                    }
                    var rawBytes = IEBinaryToArray_ByteStr(binary);
                    var lastChr = IEBinaryToArray_ByteStr_Last(binary);
                    return rawBytes.replace(/[\s\S]/g,
                            function( match ) { return byteMapping[match]; }) + lastChr;
                };

                return convertResponseBodyToText;
            }
        }
    ]);