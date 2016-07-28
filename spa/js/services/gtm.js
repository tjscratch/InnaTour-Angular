innaAppServices.service('gtm', function () {
    return {
        /**
         * в этот объект сохраняем общие данные для методов
         * PayLoad
         * PayProcessing
         */
        PayInfo: {},
        /**
         * здесь трекаются события
         * HotelsPayLoad
         * HotelsPayProcessing
         * @param thisData - сюда прокидываются уникальные данные для текущего вызова например {'PageType': 'HotelsPayLoad'},
         * @param shareObj - сюда данные общие для вызовов HotelsPayLoad и HotelsPayProcessing
         * @constructor
         */
        Pay: function (thisData, shareObj) {
            var data = shareObj ? shareObj : this.PayInfo;
            var dataLayerObj = {
                'event': 'UI.PageView',
                'Data': Object.assign({}, thisData, data)
            };
            this.PayInfo = data;
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
            console.table(dataLayerObj);
        }
    }
});
