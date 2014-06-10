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

                    /*Methods*/
                    $scope.getViewportStyle = function(){
                        if(!$scope.pics.current) return {};

                        var MAX_WIDTH = 960, MAX_HEIGHT = 480;

                        var kw = 1, kh = 1, k;

                        var width = $scope.pics.current.width;
                        var height = $scope.pics.current.height;

                        if(width > MAX_WIDTH) kw = MAX_WIDTH / width;
                        if(height > MAX_HEIGHT) kh = MAX_HEIGHT / height;

                        k = Math.min(kh, kw);

                        return {
                            backgroundImage: 'url(~)'.split('~').join($scope.pics.current.src),
                            width: parseInt(width * k),
                            height: parseInt(height * k)
                        };
                    };

                    /*Initial*/
                    (function(){
                        var deferreds = [];

                        $scope.urls.forEach(function(url, _index){
                            var deferred = new $.Deferred();

                            deferreds.push(deferred.promise());

                            var pic = new Image();

                            pic.onload = function(){
                                $scope.pics.list.push(pic);

                                if(_index === 0) {
                                    $scope.pics.setCurrent(pic);
                                }

                                deferred.resolve();
                            };

                            pic.onerror = function(){
                                deferred.resolve();
                            };

                            pic.src = url.Large;

                            pic.__order = _index;
                        });

                        $.when.apply($, deferreds).then(function(){
                            $scope.pics.list.sort(function(p1, p2){
                                return p1.__order - p2.__order;
                            });
                        });
                    })();
                }
            ]
        }
    }]);