var path = require("path")
var hideout = require("hideout")
var cwd = process.cwd()
var logger = hideout.util.logger
var config = require("../../src/config")

module.exports = function generate(template, target) {
  var packageName = path.dirname(template)
  var generatorName = path.basename(template)
  if (packageName == ".") {
    packageName = null
  }
  config.context(packageName)
    .then(function(contexts) {
      var generators = contexts.package.generators || {}
      var generator = generators[generatorName]

      // generator shortcut
      if (typeof generator == "string") {
        return generate(generator, target)
      }

      // Errors
      if (!generator) {
        logger.error("No such generator '%s'", template)
        return
      }
      if (generator.root && (!contexts.host.dirs || !contexts.host.dirs[generator.root])) {
        logger.error("Missing target directory '%s'", generator.root)
        return
      }

      // src-dest paths
      var destRoot = generator.root
        ? path.join(contexts.host.dirs[generator.root], generator.dir)
        : path.join(contexts.host.root, generator.dir)
      var srcPattern = packageName
        ? config.resolvePackagePath(packageName, contexts.package.dirs.generators, generatorName, "**/*")
        : config.resolveHostPath(contexts.package.dirs.generators, generatorName, "**/*")
      var destDir = config.resolveHostPath(destRoot, target)

      // select files to copy
      return hideout.fs.src(srcPattern)
        .then(function(files) {
          return hideout.cli
            .checkbox("Select files to copy", files.map(function(file) {
              // display only the base name for clarity
              return path.basename(file)
            }))
            .then(function(selection) {
              return files.filter(function(file) {
                return selection.some(function(selected) {
                  // then filter selected files according to selection
                  return path.basename(file) == selected
                })
              })
            })
        })
        // copy selected files from generator dir to host target
        .then(function(files) {
          var targetName = path.basename(target)
          hideout.flow.parallel(files, function(file) {
            var destFile
            switch (generator.naming) {
              case "append":
                destFile = path.join(destDir, targetName + "." + path.basename(file))
                break
              case "target":
                destFile = path.join(destDir, targetName + path.extname(file))
                break
              case "keep":
              default:
                destFile = path.join(destDir, path.basename(file))
                break
            }
            return hideout.fs.copy(file, destFile).then(function() {
              logger.ok(path.relative(cwd, destFile))
            })
          })
        })
        .then(function() {
          return destDir
        })
    })
    .then(function(destDir) {
      logger.label("Done!", destDir)
    })
    .catch(logger.stack)
}
