var path = require('path');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
  var manifest = JSON.parse(source);

  var loaderContext = this;
  var callback = loaderContext.async();

  var dirname = path.dirname(loaderContext.resourcePath);

  if (Array.isArray(manifest.icons)) {
    // Hard-coded to only resolve the first icon for now
    loaderContext.resolve(dirname, manifest.icons[0].src, function(err, filename) {
      if (err) {
				return callback(err);
			}

      // Ensure Webpack knows that the icon is a dependency of the manifest
      loaderContext.dependency && loaderContext.dependency(filename);

      // Asynchronously pass the image through the loader pipeline
      loaderContext.loadModule(filename, function(err, source, map, module) {
        if (err) {
          return callback(err);
        }

        // Update the icon src property to match the generated filename
        // Is it always the first key in the assets object?
        manifest.icons[0].src = Object.keys(module.assets)[0];

        callback(null, JSON.stringify(manifest, null, 2));
      });
    });
  } else {
    callback(null, JSON.stringify(manifest));
  }
};
