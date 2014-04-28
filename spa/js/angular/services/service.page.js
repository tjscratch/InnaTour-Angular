angular.module('innaApp.services')
    .service('innaApp.services.PageContentLoader', [
        'innaApp.API.const', '$timeout',
        function(urls, $timeout){
            var cache = {};

            return {
                getSectionById: function(id, callback){
                    var url = urls["*_PAGE_CONTENT"] + id;

                    if(cache[url]) {
                        console.log('have page in cache');
                        //to make it async as recommended @ http://errors.angularjs.org/1.2.16/$rootScope/inprog?p0=%24digest
                        $timeout(function(){
                            callback(cache[url]);
                        });
                    } else {
                        console.log('do not have page in cache');
                        $.ajax({
                            url: url,
                            dataType: 'json',
                            method: 'get',
                            success: function(data){
                                cache[url] = data;

                                console.log('cache', cache);

                                callback(data);
                            }
                        });
                    }
                }
            }
        }
    ]);