angular.module('innaApp.services')
    .service('innaApp.services.PageContentLoader', [
        'innaApp.API.const',
        '$timeout',
        'AjaxHelper',
        function(urls, $timeout, AjaxHelper){
            var cache = {};

            return {
                getSectionById: function(id, callback){
                    var url = urls["*_PAGE_CONTENT"] + id;

                    if(cache[url]) {

                        //to make it async as recommended @ http://errors.angularjs.org/1.2.16/$rootScope/inprog?p0=%24digest
                        $timeout(function(){
                            callback(cache[url]);
                        });
                    } else {

                        AjaxHelper.get(url, null, function (data) {

                            //console.log(data);

                            cache[url] = data;

                            //console.log('cache test', cache);

                            callback(data);
                        }, function (data, status) {

                        });
                    }
                }
            }
        }
    ]);