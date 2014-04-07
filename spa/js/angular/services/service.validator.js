angular.module('innaApp.services')
    .factory('Validators', [function(){
        return {
            email: function(s, error){
                if(!/^[a-z0-9\+\.\-]+@[a-z0-9\+\.\-]+\.[a-z]+$/i.test(s)) throw error;
            },
            defined: function(s, error){
                if(!s) throw error;
            },
            phone: function(s, error){
                if(!/^\d{10,}$/.test(s)) throw error;
            },
            equals: function(s1, s2, error){
                if(s1 != s2) throw error;
            },
            minLength: function(s, len, error){
                if(!s.length || s.length < len) throw error;
            }
        }
    }])