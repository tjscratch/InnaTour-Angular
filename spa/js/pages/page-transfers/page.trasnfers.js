
innaAppControllers.
    controller('TrasnfersPageCtrl', [
        '$scope', '$routeParams', '$location',
        function ($scope, $routeParams, $location) {
            var dataIndividual = [
                {from:'Прага', to:'Отель Прага', price:'30€', notes:''},
                {from:'Берлин', to:'Отель Берлин', price:'45€', notes:''},
                {from:'Франкфурт', to:'Отель Франкфурт', price:'75€', notes:''},
                {from:'Дюссельдорф', to:'Отель Дюссельдорф', price:'90€', notes:''},
                {from:'Мюнхен', to:'Отель Мюнхен', price:'85€', notes:''},
                {from:'Вена', to:'Отель Вена', price:'50€', notes:''},
                {from:'Лондон Хитроу', to:'Отель Лондон', price:'70€', notes:''},
                {from:'Лондон Гэтвик', to:'Отель Лондон', price:'105€', notes:''},
                {from:'Брюссель', to:'Отель Брюссель', price:'75€', notes:''},
                {from:'Будапешт', to:'Отель Будапешт', price:'35€', notes:''},
                {from:'Будапешт', to:'Хевиз', price:'165€', notes:''},
                {from:'Амстердам', to:'Отель Амстердам', price:'70€', notes:''},
                {from:'Копенгаген', to:'Отель Копенгаген', price:'115€', notes:''},
                {from:'Дублин', to:'Отель Дублин', price:'65€', notes:''},
                {from:'Барселона', to:'Отель Барселона', price:'60€', notes:''},
                {from:'Мадрид', to:'Отель Мадрид', price:'70€', notes:''},
                {from:'Верона', to:'Отель Верона', price:'50€', notes:''},
                {from:'Генуя ', to:'Отель Генуя ', price:'60€', notes:''},
                {from:'Милан', to:'Отель Милан', price:'95€', notes:''},
                {from:'Неаполь', to:'Отель Неаполь', price:'45€', notes:''},
                {from:'Рим', to:'Отель Рим', price:'50€', notes:''},
                {from:'Римини', to:'Отель Римини', price:'45€', notes:''},
                {from:'Флоренция', to:'Отель Флоренция', price:'50€', notes:''},
                {from:'Пекин', to:'Отель Пекин', price:'45€', notes:''},
                {from:'Гуанчжоу', to:'Отель Гуанчжоу', price:'85€', notes:''},
                {from:'Рига', to:'Отель Рига', price:'35€', notes:''},
                {from:'Осло', to:'Отель Осло', price:'155€', notes:''},
                {from:'Дубаи', to:'Отель Дубаи', price:'50$', notes:''},
                {from:'Варшава', to:'Отель Варшава', price:'35€', notes:''},
                {from:'Краков ', to:'Отель Краков ', price:'30€', notes:''},
                {from:'Лиссабон', to:'Отель Лиссабон ', price:'45€', notes:''},
                {from:'Бухарест', to:'Отель Бухарест', price:'55€', notes:''},
                {from:'Белград', to:'Отель Белград', price:'35€', notes:''},
                {from:'Сингапур', to:'Отель Сингапур', price:'50€', notes:''},
                {from:'Стамбул Ататюрк', to:'Отель Стамбул', price:'45$', notes:''},
                {from:'Стамбул Сабиха', to:'Отель Стамбул', price:'85€', notes:''},
                {from:'Париж Шарль Де Голль', to:'Отель Париж', price:'85€', notes:''},
                {from:'Париж Орли', to:'Отель Париж', price:'85€', notes:''},
                {from:'Ницца', to:'Отель Ницца', price:'45€', notes:''},
                {from:'Женева', to:'Отель Женева', price:'55€', notes:''},
                {from:'Цюрих', to:'Отель Цюрих', price:'70€', notes:''},
                {from:'Стокгольм', to:'Отель Стокгольм', price:'90€', notes:''},
                {from:'Сеул', to:'Отель Сеул', price:'125€', notes:''},
                {from:'Токио', to:'Отель Токио', price:'260€', notes:''},
                {from:'Тель-Авив', to:'Отель Тель-Авив', price:'59$', notes:''},
                {from:'Тель-Авив', to:'Отель Иерусалим', price:'111$', notes:''},
                {from:'Тель-Авив', to:'Отель на М. Море', price:'240$', notes:''},
                {from:'Бангкок', to:'Отель в Паттайе', price:'120$', notes:''},
                {from:'Пхукет', to:'Отель на Пхукете', price:'55$', notes:''},
                {from:'Самуи', to:'Отель на Самуи', price:'55$', notes:''},
                {from:'Хошимин', to:'Отель Нячанг', price:'333$', notes:''},
                {from:'Хошимин', to:'Отель Фантхьет', price:'148$', notes:''},
                {from:'Нячанг', to:'Отель Нячанг', price:'26$', notes:''},
                {from:'Бали', to:'Отели Nusa Dua , T.Benoa , Jimbaran, Sanur, Kuta, Legian', price:'72$', notes:''},
                {from:'Бали', to:'Отели Sanur', price:'75$', notes:''},
                {from:'Бали', to:'Отели Ungasan,Pecatu', price:'95$', notes:''},
                {from:'Бали', to:'Отели Tabanan, Ubud', price:'112$', notes:''},
                {from:'Бали', to:' Отели Candidasa, Karangasem, Padang Bai', price:'158$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Коломбо', price:'42$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Mt.Lavinia', price:'44$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Negombo', price:'51$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Marawila', price:'66$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Kalutara, Wadduwa', price:'70$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Beruwala, Bentota', price:'82$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Induruwa', price:'89$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Ahungalla', price:'94$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Hikkaduwa', price:'100$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Galle', price:'110$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Unawatuna', price:'107$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Koggala', price:'121$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Dickwella', price:'148$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Tangalle', price:'154$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Trincomalee', price:'180$', notes:''},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Arugambay', price:'260$', notes:''},
                {from:'Сейшельские острова', to:'Отели на о. Маэ', price:'130€', notes:''},
                {from:'Маврикий', to:'Отели на Маврикии', price:'150€', notes:''},
                {from:'Пунта Кана (Доминиканская Республика)', to:'Отели Пунта Кана', price:'56$', notes:''},
                {from:'Пунта Кана (Доминиканская Республика)', to:'Отели Ля Романа', price:'135$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Канкуна', price:'40$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Puerto Morelos', price:'55$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Playa Maroma', price:'72$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Playa del Carmen ', price:'79$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Puerto Aventuras', price:'94$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Acumal - Tulum', price:'110$', notes:''},
                {from:'Гавана', to:'Отели Гавана', price:'40€', notes:''},
                {from:'Гавана', to:'Отели Варадеро', price:'120€', notes:''},
                {from:'Варадеро', to:'Отели Варадеро', price:'50€', notes:''},
                {from:'Рио де Жанейро', to:'Отели Рио де Жанейро', price:'60$', notes:''},
                {from:'Рио де Жанейро', to:'Отели Бузиуса', price:'188$', notes:''},
                {from:'Рио де Жанейро', to:'Отели Ангра душ Реиш', price:'188$', notes:''},
                {from:'Рио де Жанейро', to:'Отели Парати', price:'223$', notes:''},
                {from:'Манила', to:'Отели Манилы', price:'75$', notes:''},
                {from:'Боракай', to:'Отели Боракая, через Калибо', price:'70$', notes:''},
                {from:'undefined', to:'Отели Боракая, через Катиклан', price:'55$', notes:''},
                {from:'Бохоль', to:'Отели Бохоля', price:'55$', notes:''}
            ];

            var dataGroup = [
                {from:'Прага', to:'Отель Прага', price:'20€', notes:''},
                {from:'Лондон Хитроу', to:'Отель Лондон', price:'70€', notes:''},
                {from:'Будапешт', to:'Отель Будапешт', price:'20€', notes:''},
                {from:'Будапешт', to:'Хевиз', price:'80€', notes:''},
                {from:'Тель-Авив', to:'Отель Тель-Авив', price:'72$', notes:'Время ожидания в аэропорту - до двух часов.'},
                {from:'Тель-Авив', to:'Отель Иерусалим', price:'88$', notes:'Время ожидания в аэропорту - до двух часов.'},
                {from:'Тель-Авив', to:'Отель Нетания', price:'88$', notes:'Время ожидания в аэропорту - до двух часов.'},
                {from:'Тель-Авив', to:'Отель на М. Море', price:'106$', notes:'Время ожидания в аэропорту - до двух часов.'},
                {from:'Хошимин', to:'Отель Фантхьет', price:'70$', notes:'Только под рейсы VN060/VN061, от двух человек'},
                {from:'Хошимин', to:'Отель Фантхьет', price:'88$', notes:'Только под рейсы  SU292/SU293, от двух человек'},
                {from:'Нячанг', to:'Отель Нячанг', price:'26$', notes:'Только под рейсы VN070/VN071'},
                {from:'Бали', to:'Отели Nusa Dua , T.Benoa , Jimbaran, Sanur, Kuta, Legian', price:'45$', notes:'От двух человек'},
                {from:'Бали', to:'Отели Sanur', price:'45$', notes:'От двух человек'},
                {from:'Бали', to:'Отели Ungasan,Pecatu', price:'55$', notes:'От двух человек'},
                {from:'Бали', to:'Отели Tabanan, Ubud', price:'80$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Mt.Lavinia', price:'30$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Negombo', price:'30$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Marawila', price:'30$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Kalutara, Wadduwa', price:'30$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Beruwala, Bentota', price:'30$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Induruwa', price:'30$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Ahungalla', price:'40$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Hikkaduwa', price:'50$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Unawatuna', price:'70$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Koggala', price:'70$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Dickwella', price:'100$', notes:'От двух человек'},
                {from:'Коломбо (Шри-Ланка)', to:'Отели Tangalle', price:'120$', notes:'От двух человек'},
                {from:'Сейшельские острова', to:'Отели на о. Маэ', price:'65€', notes:''},
                {from:'Пунта Кана (Доминиканская Республика)', to:'Отели Пунта Кана', price:'30$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Канкуна', price:'30$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Puerto Morelos', price:'34$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Playa Maroma', price:'35$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Playa del Carmen ', price:'45$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Puerto Aventuras', price:'50$', notes:''},
                {from:'Канкун(Мексика)', to:'Отели Acumal - Tulum', price:'60$', notes:''},
                {from:'Гавана', to:'Отели Гавана', price:'20€', notes:''},
                {from:'Гавана', to:'Отели Варадеро', price:'40€', notes:''},
                {from:'Варадеро', to:'Отели Варадеро', price:'20€', notes:''}
            ];

            $scope.tabs = [
                {name:'Индивидуальный', active:true
                    //, url:'spa/files/individual-transfers.xlsx'
                    , data: dataIndividual
                    , hash: 'individual'
                },
                {name:'Групповой'
                    //, url:'spa/files/group-transfers.xlsx'
                    , data: dataGroup
                    , hash: 'group'
                }
            ];

            setActiveTab($location.search().type);

            function setActiveTab(type){
                var isFound = false;
                for(var i=0;i<$scope.tabs.length; i++){
                    if ($scope.tabs[i].hash == type){
                        isFound = true;
                        $scope.tabs[i].active = true;
                        $scope.activeTab = $scope.tabs[i];

                        $location.search('type', $scope.tabs[i].hash);
                    }
                    else {
                        $scope.tabs[i].active = false;
                    }
                }

                if (!isFound){
                    $scope.tabs[0].active = true;
                    $scope.activeTab = $scope.tabs[0];
                    $location.search('type', $scope.tabs[0].hash);
                }
            }

            //init
            //getDataForActiveTab();

            $scope.tabs.click = function (tab, $event) {
                $event.preventDefault();

                setActiveTab(tab.hash);

                //for(var i=0; i<$scope.tabs.length; i++) {
                //    $scope.tabs[i].active = false;
                //}
                //tab.active = true;
                //$scope.activeTab = tab;
                //$location.search('type', tab.hash);

                //if (tab.data) {
                //}
                //else {
                //    getDataForActiveTab();
                //}
            };



            //function getDataForActiveTab() {
            //    getXMLFile($scope.activeTab.url, function (wb) {
            //        $scope.safeApply(function () {
            //            $scope.activeTab.data = toDataArray(wb);
            //
            //            var text = '';
            //            var ar = $scope.activeTab.data;
            //            for(var i=0; i<ar.length; i++){
            //                var item = ar[i];
            //                text += '\n{from:\''+ item.from +'\', to:\''+ item.to +'\', price:\''+ item.price +'\', notes:\''+ (item.notes ? item.notes : '') +'\'},';
            //            }
            //
            //            console.log(text);
            //        });
            //    });
            //}
            //
            //function toDataArray(workbook){
            //    var sheetName = workbook.SheetNames[0];
            //    var worksheet = workbook.Sheets[sheetName];
            //
            //    var result = [];
            //    var lastRow = -1;
            //    var curRow = 0;
            //    var lastObj = {};
            //    for (z in worksheet) {
            //        /* all keys that do not begin with "!" correspond to cell addresses */
            //        if(z[0] === '!') continue;
            //
            //        curRow = +('' + z).substring(1);
            //        //пропускаем первые 2 ряда
            //        if(curRow <= 2) continue;
            //
            //        if (lastRow != curRow) {
            //            lastObj = {};
            //            result.push(lastObj);
            //            lastRow = curRow;
            //        }
            //
            //        //if (curRow == 7 || curRow == 8) {
            //        //    console.log(z, worksheet[z]);
            //        //}
            //
            //        var val = worksheet[z].v.toString();
            //        if (z[0] == 'A'){
            //            lastObj.from = val;
            //        }
            //        else if (z[0] == 'B') {
            //            lastObj.to = val;
            //        }
            //        else if (z[0] == 'C') {
            //            if (val.indexOf('$') == -1){
            //                val = val.replace(/\s/g,'') + '€';
            //            }
            //            lastObj.price = val;
            //        }
            //        else if (z[0] == 'D') {
            //            lastObj.notes = val;
            //        }
            //    }
            //
            //    return result;
            //}
            //
            //function getXMLFile(url, callback){
            //
            //    var oReq;
            //    if(window.XMLHttpRequest) oReq = new XMLHttpRequest();
            //    else if(window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
            //    else throw "XHR unavailable for your browser";
            //
            //    oReq.open("GET", url, true);
            //
            //    var options = {type:"binary", cellNF:true};
            //    //var options = {type:"binary"};
            //
            //    if(typeof Uint8Array !== 'undefined') {
            //        oReq.responseType = "arraybuffer";
            //        oReq.onload = function(e) {
            //            //if(typeof console !== 'undefined') console.log("onload", new Date());
            //            var arraybuffer = oReq.response;
            //            var data = new Uint8Array(arraybuffer);
            //            var arr = new Array();
            //            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            //            var wb = XLSX.read(arr.join(""), options);
            //            callback(wb);
            //        };
            //    } else {
            //        oReq.setRequestHeader("Accept-Charset", "x-user-defined");
            //        oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
            //            var ff = convertResponseToText(oReq.responseBody);
            //            //if(typeof console !== 'undefined') console.log("onload", new Date());
            //            var wb = XLSX.read(ff, options);
            //            callback(wb);
            //        } };
            //    }
            //
            //    oReq.send();
            //}
            //
            //function convertResponseToText(){
            //    if(/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            //        var IEBinaryToArray_ByteStr_Script =
            //            "<!-- IEBinaryToArray_ByteStr -->\r\n"+
            //            "<script type='text/vbscript'>\r\n"+
            //            "Function IEBinaryToArray_ByteStr(Binary)\r\n"+
            //            "   IEBinaryToArray_ByteStr = CStr(Binary)\r\n"+
            //            "End Function\r\n"+
            //            "Function IEBinaryToArray_ByteStr_Last(Binary)\r\n"+
            //            "   Dim lastIndex\r\n"+
            //            "   lastIndex = LenB(Binary)\r\n"+
            //            "   if lastIndex mod 2 Then\r\n"+
            //            "       IEBinaryToArray_ByteStr_Last = Chr( AscB( MidB( Binary, lastIndex, 1 ) ) )\r\n"+
            //            "   Else\r\n"+
            //            "       IEBinaryToArray_ByteStr_Last = "+'""'+"\r\n"+
            //            "   End If\r\n"+
            //            "End Function\r\n"+
            //            "</script>\r\n";
            //
            //        // inject VBScript
            //        document.write(IEBinaryToArray_ByteStr_Script);
            //    }
            //
            //    var convertResponseBodyToText = function (binary) {
            //        var byteMapping = {};
            //        for ( var i = 0; i < 256; i++ ) {
            //            for ( var j = 0; j < 256; j++ ) {
            //                byteMapping[ String.fromCharCode( i + j * 256 ) ] =
            //                    String.fromCharCode(i) + String.fromCharCode(j);
            //            }
            //        }
            //        var rawBytes = IEBinaryToArray_ByteStr(binary);
            //        var lastChr = IEBinaryToArray_ByteStr_Last(binary);
            //        return rawBytes.replace(/[\s\S]/g,
            //                function( match ) { return byteMapping[match]; }) + lastChr;
            //    };
            //
            //    return convertResponseBodyToText;
            //}
        }
    ]);