var path = require("path")
var hideout = require("hideout")
var logger = hideout.util.logger
var config = require("../../src/config")

module.exports = function() {
  var glob = config.resolveHostPath("node_modules/*", config.RC_FILE_GLOB)
  return hideout
    .fs.src(glob)
    .then(function(files) {
      return files.map(function(file) {
        return path.basename(path.dirname(file))
      })
    })
    .then(function(packages) {
      return hideout.flow.series(packages, function(pkg) {
        return config.package(pkg).then(function(rc) {
          var generatorList = "(" + Object.keys(rc.generators||{}).join(", ") + ")"
          logger.info(logger.format.label(pkg), logger.format.comment(generatorList))
        })
      })
    })
    .catch(logger.stack)
}
