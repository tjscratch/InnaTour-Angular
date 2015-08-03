innaAppConponents.factory('DpServices', function (EventManager, $templateCache) {

	var DpServices = Ractive.extend({
		template: $templateCache.get('components/indicator-filters/templ/b-dp-services.hbs.html'),
		data    : {
			additional: null,
			included: null
		},
		onrender: function (options) {
			var that = this;
			EventManager.on('loadDpData', function (data) {
				that.set('additional', data.Additional);
				that.set('included', data.Included);
			});
		}
	});

	return DpServices;
});

