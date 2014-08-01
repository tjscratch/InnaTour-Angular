var app_main = {};
//<!-- build:app-host -->
app_main.host = "http://api.test.inna.ru";
//<!-- endbuild -->

//<!-- build:b2b-host -->
app_main.b2bHost = 'http://b2b.test.inna.ru';
//<!-- endbuild -->

//<!-- build:front-host -->
app_main.frontHost = 'http://test.inna.ru';
//<!-- endbuild -->

//<!-- build:static-host -->
app_main.staticHost = 'http://s.test.inna.ru';
//<!-- endbuild -->

//<!-- build:tripadvisor -->
app_main.tripadvisor = 'http://www.tripadvisor.ru/WidgetEmbed-cdspropertydetail?display=true&partnerId=32CB556934404C699237CD7F267CF5CE&lang=ru&locationId=';
//<!-- endbuild -->

app_main.version = '12';
app_main.constants = {};
app_main.constants.offersCategoriesProgramm = '1';

var addTourUrlEf = app_main.host + '/api/v1/Dictionary';

var getHotelsUrl = app_main.host + '/api/v1/Dictionary';

var getCityUrl = app_main.host + '/api/v1/Dictionary/City/Get';
var getDirectoryUrl = app_main.host + '/api/v1/Dictionary/Directory/Get';
var getRegionUrl = app_main.host + '/api/v1/Dictionary/Region/Get';

var getSletatUrl = app_main.host + '/api/v1/Dictionary/Sletat/Get';
var getSletatCityUrl = app_main.host + '/api/v1/Dictionary/SletatCity/Get';
var getSletatByIdUrl = app_main.host + '/api/v1/Dictionary/SletatById/Get';

var getLocationByUrls = app_main.host + '/Dictionary/LocationByUrl';

var beginSearchUrl = app_main.host + '/api/v1/Search/BeginSearch/Get';
var checkSearchUrl = app_main.host + '/api/v1/Search/CheckSearch/Get';

var hotelDetailUrl = app_main.host + '/HotelDetail/GetPage';

var tourDetailUrl = app_main.host + '/TourDetail/GetPage';

var getOrderUrl = app_main.host + '/Order';

var paymentPageUrl = app_main.host + '/Payment';

var payUrl = app_main.host + '/Payment/Pay';

var deleteSearchHistoryUrl = app_main.host + '/api/v1/Search/DeleteHistory/Get';