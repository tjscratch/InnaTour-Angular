innaAppConponents.factory('DpServices', function (EventManager, innaAppApiEvents, $templateCache) {

	var DpServices = Ractive.extend({
		template: $templateCache.get('components/indicator-filters/templ/b-dp-services.hbs.html'),
		data    : {
			additional: null,
			included: null,
            show: false
		},
		onrender: function (options) {
			var that = this;
            EventManager.on('show-insurance', function (visible, data) {
                that.set('show', visible);
                if (data){
                    that.set('additional', data.Additional);
                    that.set('included', data.Included);
                }
            });
		}
	});
	
	return DpServices;
});

