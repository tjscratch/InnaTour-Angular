angular.module('innaApp.services')
    .factory('Validators', [function () {

        return {
            email: function (s, error) {
                if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,63})+$/i.test(s)) throw error;
            },
            /**
             * проверка значения val
             * если пусто выкидавыем ошибку errorText
             * @param val
             * @param error
             * @param errorText
             */
            required: function (val, error, errorText) {
                if (!val) {
                    error.error = errorText
                    throw error
                }
            },
            /**
             * Сравнение равенства v1 и v2
             * @param v1
             * @param v2
             * @param error
             * @param errorText
             */
            noEqual: function (v1, v2, error, errorText) {
                if (v1 == v2) {
                    error.error = errorText;
                    throw error
                }
            },
            defined: function (s, error) {
                if (!s) throw error;
            },
            phoneNum: function (s, error) {
                if (!/^\(\d{3}\)\s\d{3}-\d{2}-\d{2}(\d+)?$/.test(s)) throw error;//(910) 123-45-67
            },
            phoneNumWoFormat: function (s, error) {//без форматирования мин 7 цифр
                if (!/^\d{7,}$/.test(s)) throw error;//1234567
            },
            phone: function (s, error) {
                if (!/^[+]\d{11,}$/.test(s)) throw error;//+79101234567
            },
            equals: function (s1, s2, error) {
                if (s1 != s2) throw error;
            },
            notEqual: function (s1, s2, error) {
                if (s1 == s2) throw error;
            },
            minLength: function (s, len, error) {
                if (!s.length || s.length < len) throw error;
            },
            date: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976
            },
            dateEndEmpty: function (s1, s2, error) {
                var dt = parseInt(Date.fromDDMMYY(s2) - Date.fromDDMMYY(s1));
                if (dt < 0) throw error;
            },
            gtZero: function (s, error) {
                var val = parseInt(s);
                if (isNaN(val) || val <= 0) throw error;
            },
            birthdate: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976

                //от 01.01.1900 до текущей даты
                var dParts = s.split('.');
                var isDayTrue;
                var isMonthTrue;
                var isYearTrue;

                if (dParts.length == 3) {

                    var y = parseInt(dParts[2], 10);
                    var day = parseInt(dParts[0], 10);
                    var month = parseInt(dParts[1], 10);
                    var today = new Date();
                    var yyyy = today.getFullYear();

                    //если дата рождения больше текущей даты
                    var valDate = new Date(y, (month-1), day);
                    //console.log('valDate:', +valDate);
                    //console.log('today  :', +today);
                    if (+valDate > +today){
                        throw error;
                    }

                    if (!(day >= 1 && day <= 31)) {
                        throw error;
                    } else {
                        isDayTrue = true;
                    }

                    if (!(month >= 1 && month <= 12)) {
                        throw error;
                    } else {
                        isMonthTrue = true;
                    }

                    if (!(y >= 1900 && y <= yyyy)) {
                        throw error;
                    } else {
                        isYearTrue = true;
                    }

                    if(isDayTrue && isMonthTrue && isYearTrue) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            expire: function (s, expireDateTo, error, errExpire) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976

                //Дата должна быть в диапазоне от текущей даты + 100 лет
                var dParts = s.split('.');
                if (dParts.length == 3) {
                    var y = parseInt(dParts[2], 10);

                    var day = parseInt(dParts[0], 10);
                    if (!(day >= 1 && day <= 31))
                        throw error;
                    var month = parseInt(dParts[1], 10);
                    if (!(month >= 1 && month <= 12))
                        throw error;

                    var yyyy;
                    if (expireDateTo){
                        //если дата вообще меньше текущей
                        var testDate = new Date(y,month - 1,day);
                        //console.log('expire', s, testDate, expireDateTo);
                        if (+testDate < +expireDateTo){
                            throw errExpire;
                        }

                        yyyy = expireDateTo.getFullYear();
                        if (!(y >= yyyy && y <= (yyyy + 100)))
                            throw error;
                    }
                    else {
                        var today = new Date();

                        //если дата вообще меньше текущей
                        var testDate = new Date(y,month - 1,day);
                        //console.log('expire', s, testDate, today);
                        if (+testDate < +today){
                            throw errExpire;
                        }

                        yyyy = today.getFullYear();
                        if (!(y >= yyyy && y <= (yyyy + 100)))
                            throw error;
                    }
                }
            },
            ruPassport: function (s, error) {
                //10 цифр - российский паспорт
                if (!/^(\d{10})+$/.test(s)) throw error;
            },
            enPassport: function (s, error) {
                //9 цифр - загранпаспорт
                if (!/^(\d{9})+$/.test(s)) throw error;
            },
            birthPassport: function (s, error) {
                //буквы (хотя бы одна) + 6 последних цифр - св-во о рождении (II-ЛО 599785)
                if (!/^.*([а-яА-ЯёЁa-zA-Z]).*(\d{6})+$/.test(s)) throw error;
            }
        }
    }]);