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

  return config
    .context(packageName)
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
      if (generator.namespace && (!contexts.host.namespace || !contexts.host.namespace[generator.namespace])) {
        logger.error("Missing target directory '%s'", generator.namespace)
        return
      }

      // src-dest paths
      var destRoot = generator.namespace
        ? path.join(contexts.host.namespace[generator.namespace], generator.dir)
        : path.join(contexts.host.root, generator.dir)
      var srcPattern = packageName
        ? config.resolvePackagePath(packageName, contexts.package.namespace.generators, generatorName, "**/*")
        : config.resolveHostPath(contexts.package.namespace.generators, generatorName, "**/*")
      var destDir = config.resolveHostPath(destRoot, target)
      var compiler

      // generator template
      if (generator.template) {
        var templatePath = config.resolvePackagePath(packageName, contexts.package.namespace.generators, generatorName)

        try {
          compiler = require(templatePath)
        }
        catch (e) {
          throw new Error("Template script not found at " + templatePath)
        }

        if (compiler && typeof compiler != "function") {
          throw new Error("Template script must export a function, " + typeof compiler + " was given in " + templatePath)
        }
      }

      // select files to copy
      return hideout
        .fs.src(srcPattern)
        .then(function(files) {
          return hideout
            .cli.checkbox("Select files to copy", files.map(function(file) {
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

          return hideout.flow.parallel(files, function(file) {
            var destFile
            var fileName

            // rename dest file according to naming scheme
            switch (generator.naming) {
              case "append":
                fileName = targetName + "." + path.basename(file)
                break
              case "rename":
                fileName = targetName + path.extname(file)
                break
              default:
              case "keep":
                fileName = path.basename(file)
                break
            }

            destFile = path.join(destDir, path.basename(file))

            // use template to render generator files
            if (compiler) {
              return hideout.fs.read(file)
                .then(function(contents) {
                  return compiler(contents, {
                    src: path.basename(file),
                    dest: fileName,
                    name: targetName,
                    dir: path.relative(cwd, path.dirname(destFile)),
                    file: destFile,
                    target: target,
                    host: contexts.host
                  })
                })
                .then(function(contents) {
                  if (typeof contents != "string") {
                    throw new Error("Template returned invalid type: " + typeof contents)
                  }

                  return hideout.fs.write(destFile, contents)
                })
                .then(function() {
                  logger.ok(path.relative(cwd, destFile))
                })
            }

            // or just copy them
            return hideout
              .fs.copy(file, destFile)
              .then(function() {
                logger.ok(path.relative(cwd, destFile))
              })
          })
        })
        .then(function() {
          return destDir
        })
    })
    .then(function(destDir) {
      logger.ok(logger.format.label("Done!", destDir))
    })
    .catch(logger.stack)
}
