/**
 * RavenWrapper - singleton
 * Обертка над Raven
 */
angular.module('innaApp.services').service('RavenWrapper', [
    function () {

       function RavenWrapper(){
       }

        RavenWrapper.prototype.raven = function(data){
            try {
                if (data && Object.keys(data).length) {
                    var dataRaven = {
                        extra: {
                            data: {
                                siteUrl: location.href,
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
            } catch (e){
                Raven.captureException(e);
            }
        }

        RavenWrapper.prototype.captureException = function(e){
            Raven.captureException(e);
        }

        return new RavenWrapper();
    }]);
