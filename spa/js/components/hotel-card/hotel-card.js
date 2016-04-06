innaAppDirectives.directive('hotelCard', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/hotel-card/templ/hotel-card.html"),
        scope: {
            hotel: '=',
            hotelUrl: '=',
            hotelInfo: '='
        },
        link: function (scope, elem, attr) {
            var HotelGalleryComponent = null;
        }
    }
});
