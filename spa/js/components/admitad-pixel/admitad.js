innaAppDirectives.directive('admitadPixel', function ($templateCache) {
    return {
        replace: true,
        template: $templateCache.get("components/admitad-pixel/templ/pixel.html"),
        scope: {
            orderId: '=',
            price: '=',
            uid: '='
        },
        link: function ($scope, element, attrs) {
            var d = document;
            var w = window;
            w._admitadPixel = {
                response_type: 'img',
                action_code: '1',
                campaign_code: '65c4bc16da'
            };
            w._admitadPositions = w._admitadPositions || [];
            w._admitadPositions.push({
                uid: $scope.uid,
                order_id: $scope.orderId,
                position_id: '',
                client_id: '',
                tariff_code: '1',
                currency_code: '',
                position_count: '',
                price: $scope.price,
                quantity: '',
                product_id: '',
                screen: '',
                tracking: '',
                old_customer: '',
                coupon: '',
                payment_type: 'sale',
                promocode: ''
            });
            var id = '_admitad-pixel';
            if (d.getElementById(id)) {
                return;
            }
            var s = d.createElement('script');
            s.id = id;
            var r = (new Date).getTime();
            var protocol = (d.location.protocol === 'https:' ? 'https:' : 'http:');
            s.src = protocol + '//cdn.asbmit.com/static/js/pixel.min.js?r=' + r;
            d.head.appendChild(s);
        }
    }
});
