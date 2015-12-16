var path = require('path');
var loaderUtils = require('loader-utils');
var steed = require('steed');

function resolveIconSrc(loaderContext, icon, callback) {
  var dirname = path.dirname(loaderContext.resourcePath);

  // Resolve the icon filename relative to the manifest file
  loaderContext.resolve(dirname, icon.src, function(err, filename) {
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
      icon.src = Object.keys(module.assets)[0];

      callback(null, icon);
    });
  });
}

module.exports = function(source) {
  var manifest = JSON.parse(source);

  var loaderContext = this;
  var callback = loaderContext.async();

  if (Array.isArray(manifest.icons)) {
    steed.map(manifest.icons, resolveIconSrc.bind(null, loaderContext), function(err, icons) {
      if (err) {
        return callback(err);
      }

      manifest.icons = icons;

      callback(null, JSON.stringify(manifest, null, 2));
    });
  } else {
    callback(null, JSON.stringify(manifest, null, 2));
  }
};
