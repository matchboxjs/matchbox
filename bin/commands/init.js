var path = require("path")
var hideout = require("hideout")
var logger = hideout.util.logger
var config = require("../../src/config")
var cwd = process.cwd()
var cli = hideout.cli
var assign = hideout.transforms.cli.assign

module.exports = function init(packageName) {
  if (packageName) {
    return config.context(packageName)
      .then(function(contexts) {
        var initialize = Object.keys(contexts.package.init)
        return hideout.flow.parallel(initialize, function(dir) {
          return hideout.flow.series(contexts.package.init[dir], function(dirPath) {
            var dest = config.resolveHostPath(contexts.host.dirs[dir], dirPath)
            return hideout.fs.makeDir(dest).then(function() {
              logger.ok(path.relative(cwd, dest))
            })
          })
        })
      })
      .catch(logger.stack)
  }
  return config.fallback().then(function(settings) {
    cli
      .session("Main properties", settings)
      .then(function(vars) {
        return cli
          .ask("name", path.basename(cwd))
          .then(assign(vars, "name"))
      })
      .then(function(settings) {
        return cli
          .ask("root", settings.root)
          .then(assign(settings, "root"))
      })
      .then(function(settings) {
        return cli
          .checkbox("Select directories to generate", Object.keys(settings.dirs))
          .then(function(selection) {
            return selection.reduce(function(obj, dir) {
              obj[dir] = settings.dirs[dir]
              return obj
            }, {})
          })
          .then(assign(settings, "dirs"))
      })

      .then(function(settings) {
        var dirNames = Object.keys(settings.dirs)
        if (!dirNames.length) {
          return settings
        }

        return cli
          .session("Set directory mapping", settings.dirs)
          .then(function(dirs) {
            return hideout.flow.series(Object.keys(dirs), function(dir) {
              return cli
                .ask(dir, path.join(settings.root, dirs[dir]))
                .then(assign(dirs, dir))
            })
          })
          .then(assign(settings, "dirs"))
      })

      .then(function(settings) {
        return hideout.fs.makeDir(config.resolveHostPath(settings.root || cwd)).then(function() {
          logger.ok(logger.format.label("directory:", "root"))
          return settings
        })
      })

      .then(function(settings) {
        return hideout.flow.series(Object.keys(settings.dirs), function(dir) {
          var target = settings.dirs[dir]

          return hideout.fs.makeDir(config.resolveHostPath(target)).then(function() {
            logger.ok(logger.format.label("namespace:", dir))
          })
        }).then(function() {
          return settings
        })
      })

      .then(function(settings) {
        var userConfigPath = config.getConfigPath(cwd)
        var configContent = JSON.stringify(settings, null, 2)
        logger.log(logger.format.title("Config file"))
        logger.log(logger.format.comment(configContent))
        return cli
          .confirm("Write this to " + userConfigPath)
          .then(function(yes) {
            if (yes) {
              return hideout.fs.write(userConfigPath, configContent)
            }
          })
      })
      .then(function() {
        logger.ok("All Done!")
      })
      .catch(logger.stack)
  })
}
