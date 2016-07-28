innaAppServices.service('gtm', function () {
    return {
        /**
         * в этот объект сохраняем общие данные для методов
         * PayLoad
         * PayProcessing
         */
        TrackData: {},
        /**
         * здесь трекаются события
         * HotelsPayLoad
         * HotelsPayProcessing
         * @param thisData - сюда прокидываются уникальные данные для текущего вызова например {'PageType': 'HotelsPayLoad'},
         * @param shareObj - сюда данные общие для вызовов HotelsPayLoad и HotelsPayProcessing
         * @constructor
         */
        GtmTrack: function (thisData, shareObj) {
            this.TrackData = shareObj ? shareObj : this.TrackData;
            var dataLayerObj = {
                'event': 'UI.PageView',
                'Data': Object.assign({}, thisData, this.TrackData)
            };
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
            console.table(dataLayerObj);
        }
    }
});
