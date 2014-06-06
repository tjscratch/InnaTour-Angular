angular.module('innaApp.directives')
    .directive('innaGallery', ['$templateCache', function($templateCache){
        return {
            template: $templateCache.get('components/gallery.html'),
            scope: {
                urls: '=innaGalleryPicList'
            },
            controller: [
                '$scope',
                function ($scope) {
                    console.log('innaGallery', $scope);

                    /*Models*/
                    function PicList(){
                        this.list = [];
                        this.current = null;
                    }

                    PicList.prototype.setCurrent = function(pic){
                        this.current = pic;
                    };

                    PicList.prototype.isCurrent = function(pic) {
                        return this.current == pic;
                    };

                    PicList.prototype.next = function(){
                        var index = this.list.indexOf(this.current) + 1;

                        if(index >= this.list.length) index = 0;

                        this.setCurrent(this.list[index]);
                    };

                    PicList.prototype.prev = function(){
                        var index = this.list.indexOf(this.current) - 1;

                        if(index < 0) index = this.list.length - 1;

                        this.setCurrent(this.list[index]);
                    };

                    /*Properties*/
                    $scope.pics = new PicList();

                    /*Initial*/
                    (function(){
                        $scope.urls.forEach(function(url, _index){
                            var pic = new Image();

                            pic.onload = function(){
                                $scope.pics.list.push(pic);

                                if(_index === 0) {
                                    $scope.pics.setCurrent(pic);
                                }
                            };

                            pic.src = url.Large;
                        });
                    })();
                }
            ]
        }
    }]);