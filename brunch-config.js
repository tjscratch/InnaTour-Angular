exports.config = {
  "overrides": {
    "DEV": {
      "optimize": true,
      "sourceMaps": true,
      "plugins": {
        "autoReload": {
          "enabled": true
        }
      }
    }
  },

  "paths": {
    "watched": ["dev"],
    "public": "deploy"
  },
  "files": {
    "javascripts": {
      "joinTo": "build/app.min.js"
    }
  },
  "conventions": {
    "assets": /spa\/js[\\/]/
  },
  "plugins": {
    /*"imageoptimizer": {
      "smushit": true,
      "path": "img/"
    }*/
  },
  "modules": {
    "wrapper": false,
    "definition": false
  },
  server: {
    path: './server.js',
    port: 8077,
    stripSlashes: true
  }
}