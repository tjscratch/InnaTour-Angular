innaAppConponents.factory('DpServices', function (EventManager, innaAppApiEvents, $templateCache) {

	var DpServices = Ractive.extend({
		template: $templateCache.get('components/indicator-filters/templ/b-dp-services.hbs.html'),
		data    : {
			additional: null,
			included: null,
            show: false,
			banner_img: null,
			banner_link: null,
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
			EventManager.on('loadAdBanners', function(data){
				if(data && data[0]){
					that.set('banner_img', data[0].ImagePath);
					that.set('banner_link', data[0].Link);
				}
			});
		}
	});
	
	return DpServices;
});

