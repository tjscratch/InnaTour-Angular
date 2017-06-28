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
                'event': 'UM.PageView',
                'Data': Object.assign({}, thisData, this.TrackData)
            };
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
            //console.table(dataLayerObj);
        },
        TrackDataEvent: {},
        /**
         *
         dataLayer.push({
                'event': 'UM.Event',			// Параметр для настройки правила GTM
                'Data': {
                    'Category': 'Packages',		// Категория события
                    'Action': 'Banner',		// Действие
                    'Label': 'Айя-Напа',		// Доп описание
                    'Content': 'АЙЯ-НАПА 22-25 июля, 3 ночи от 26 390 руб (за чел.)',
                    'Context': 1,
                    'Text': '[no data]'
                 }
         });
         * @param thisData
         * @param shareObj
         * @constructor
         */
        GtmTrackEvent: function (thisData, shareObj) {
            this.TrackDataEvent = shareObj ? shareObj : this.TrackDataEvent;
            var dataLayerObj = {
                'event': 'UM.Event',
                'Data': Object.assign({}, thisData, this.TrackDataEvent)
            };
            if (window.dataLayer) {
                window.dataLayer.push(dataLayerObj);
            }
            //console.table(dataLayerObj);
        },
        
    }
});
