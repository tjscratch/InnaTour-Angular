var nconf = require("nconf");
var baseApiUrls = nconf.get("serverApiUrl");

module.exports = {
    AUTH : baseApiUrls + '/Account/Info/Post'
}
