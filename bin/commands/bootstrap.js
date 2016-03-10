var path = require("path")
var hideout = require("hideout")
var logger = hideout.util.logger
var config = require("../../src/config")
var cwd = process.cwd()

module.exports = function(packages) {
  return config()
    .then(function(host) {
      if (!Array.isArray(packages) || !packages.length) {
        return bootstrap(host, host)
      }

      return hideout.flow.series(packages, function(packageName) {
        logger.log("Bootstrapping %s", packageName)

        return config.package(packageName).then(function(packageRc) {
          return bootstrap(host, packageRc)
        }).catch(function(e) {
          logger.error(e)
        })
      })
    })
    .then(function() {
      logger.ok("All Done!")
    })
    .catch(logger.stack)
}

function bootstrap(host, packageRc) {
  var dirs = Object.keys(packageRc.dirs)

  if (!dirs) {
    return
  }

  return hideout
    .flow.parallel(dirs, function(ns) {
      if (!host.namespace[ns]) {
        logger.warn("Missing namespace: '%s'. Create it with 'matchbox init'", ns)
        return
      }

      logger.log("Creating dirs in %s", ns)

      return hideout.flow.series(packageRc.dirs[ns], function(dirPath) {
        var dest = config.resolveHostPath(host.namespace[ns], dirPath)

        return hideout.fs.makeDir(dest).then(function() {
          logger.ok(logger.format.label("Created", path.relative(cwd, dest)))
        })
      })
    })
}
