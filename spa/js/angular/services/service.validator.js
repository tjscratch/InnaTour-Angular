angular.module('innaApp.services')
    .factory('Validators', [function(){
        return {
            email: function(s, error){
                if (!/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,63})+$/i.test(s)) throw error;
            },
            defined: function(s, error){
                if(!s) throw error;
            },
            phone: function(s, error){
                if(!/^[+]\d{11,}$/.test(s)) throw error;//+79101234567
            },
            equals: function(s1, s2, error){
                if(s1 != s2) throw error;
            },
            notEqual: function(s1, s2, error){
                if(s1 == s2) throw error;
            },
            minLength: function(s, len, error){
                if(!s.length || s.length < len) throw error;
            },
            date: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976
            },
            gtZero: function (s, error) {
                var val = parseInt(s);
                if (isNaN(val) || val <= 0) throw error;
            },
            birthdate: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976

                //�� 01.01.1900 �� ������� ����
                var dParts = s.split('.');
                if (dParts.length == 3) {
                    var y = parseInt(dParts[2], 10);

                    var today = new Date();
                    var yyyy = today.getFullYear();
                    if (!(y >= 1900 && y <= yyyy))
                        throw error;
                }
            },
            expire: function (s, error) {
                if (!/^(\d{2})+\.(\d{2})+\.(\d{4})+$/.test(s)) throw error;//18.07.1976

                //���� ������ ���� � ��������� �� ������� ���� + 100 ���
                var dParts = s.split('.');
                if (dParts.length == 3) {
                    var y = parseInt(dParts[2], 10);

                    var today = new Date();
                    var yyyy = today.getFullYear();
                    if (!(y >= yyyy && y <= (yyyy + 100)))
                        throw error;
                }
            },
            ruPassport: function (s, error) {
                //10 ���� - ���������� �������
                if (!/^(\d{10})+$/.test(s)) throw error;
            },
            enPassport: function (s, error) {
                //9 ���� - �������������
                if (!/^(\d{9})+$/.test(s)) throw error;
            },
            birthPassport: function (s, error) {
                //����� (���� �� ����) + 6 ��������� ���� - ��-�� � �������� (II-�� 599785)
                if (!/^.*([�-��-߸�a-zA-Z]).*(\d{6})+$/.test(s)) throw error;
            },
        }
    }])