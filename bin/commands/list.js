var path = require("path")
var hideout = require("hideout")
var logger = hideout.util.logger
var config = require("../../src/config")

module.exports = function() {
  function display(rc) {
    var generatorList = "(" + Object.keys(rc.generators||{}).join(", ") + ")"
    logger.info(logger.format.label(rc.name), logger.format.comment(generatorList))
  }
  config()
    .then(display)
    .then(function() {
      var packageGlob = config.resolveHostPath("node_modules/*", config.RC_FILE_GLOB)
      return hideout
        .fs.src(packageGlob)
        .then(function(files) {
          return files.map(function(file) {
            return path.basename(path.dirname(file))
          })
        })
        .then(function(packages) {
          return hideout.flow.series(packages, function(pkg) {
            return config.package(pkg).then(display)
          })
        })
    })
    .catch(logger.stack)
}
