/**
 * RavenWrapper - singleton
 * Обертка над Raven
 */
angular.module('innaApp.services').service('RavenWrapper', [
    '$location',
    function ($location) {

       function RavenWrapper(){
       }

        RavenWrapper.prototype.raven = function(data){
            if(data && Object.keys(data).length) {
                var dataRaven = {
                    extra: {
                        data: {
                            siteUrl: $location.href,
                            dataResponse: data.dataResponse || null,
                            dataRequest: data.dataRequest || null
                        }
                    }
                };
                if (data.level) {
                    dataRaven.tags = {
                        level: data.level
                    }
                }
                Raven.captureMessage(data.captureMessage.toUpperCase(), dataRaven);
            }
        }

        return new RavenWrapper();
    }]);
