var config = {
    "dist": {
        "src": "./dist"
    },
    "templates": {
        "src": [
            "./spa/templates/**/*.html",
            "./spa/js/**/*.html",
            "./spa/js/widgets/search/templ/*.html"
        ],
        "angularModuleName": "innaApp.templates",
        "distSrc": "./build/js",
        "distSrcMd5": "./build/js/*.js"
    },
    "nodeApp": {
        "distLayouts": "./dist/node-app/templates/layouts/*.hbs"
    },
    "images": {
        "src": "./spa/img/**",
        "distSrc": "./dist/spa/img"
    },
    "styles": {
        "src": "",
        "distSrc": "./dist/spa/css",
        "distSrcMd5": "./dist/spa/css/*.css"
    }
}

module.exports = config;