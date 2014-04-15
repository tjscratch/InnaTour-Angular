angular.module('innaApp.services')
    .service('innaApp.services.PageContentLoader', [
        'innaApp.API.const',
        function(urls){
            return {
                getSectionById: function(id, callback){
                    $.ajax({
                        url: urls["*_PAGE_CONTENT"] + id,
                        dataType: 'json',
                        method: 'get',
                        success: callback
                    });
                }
            }
        }
    ]);