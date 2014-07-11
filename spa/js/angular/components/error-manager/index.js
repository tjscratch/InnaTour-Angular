/**
 * ErrorManager - singleton
 */
angular.module('innaApp.services').service('ErrorManager', [
    '$templateCache',
    'Balloon',
    function ($templateCache, Balloon) {

        var ErrorManager = Balloon.extend({
            partials: {
                balloonContent: $templateCache.get('components/error-manager/templ/error.html')
            },
            data: {
                balloonClose: true,
                balloon_class: 'b-balloon_error-manager',
                errors: {
                    auth: {

                    },
                    reservation: {

                    },
                    1: 'Ошибка сервера : (',
                    500 : 'Ошибка сервера : ('
                }
            },
            init: function (options) {
                this._super(options);
                var that = this;

                this.on({
                    change: this.change
                })


                this.observe('errId', function (newValue, oldValue) {
                    if (newValue) {
                        this.set({errorText: that.getErrorId(newValue)});
                        this.show();
                    }
                }, this);
            },

            change: function (data) {

            },

            getErrorId: function (id) {
                return this.get('errors.' + id);
            }
        });

        return ErrorManager;
    }]);
