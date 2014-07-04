innaAppConponents.
    factory('ShareLink', [
        'innaApp.API.events',
        '$templateCache',
        function (Events, $templateCache) {

            var ShareLink = Ractive.extend({
                el: 'body',
                template: $templateCache.get('components/share-link/templ/index.html'),
                debug: true,
                append: true,
                data: {
                    balloonClose: true
                },
                init: function () {
                    this._overlay = this.find('.js-overlay');
                    this._balloon = this.find('.js-b-balloon');


                    this.on({
                        hide: this.hide,
                        changeTarifs: this.changeTarifs
                    })
                },
                show: function () {
                    this._overlay.style.display = 'block';
                    this._balloon.style.display = 'block';
                },
                hide: function () {
                    this._overlay.style.display = 'none';
                    this._balloon.style.display = 'none';
                },

                toggleShow : function(evt){
                    console.log('toggleShow');
                }
            });

            return ShareLink;
        }
    ]);

