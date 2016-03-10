var path = require("path")
var hideout = require("hideout")
var logger = hideout.util.logger
var config = require("../../src/config")
var cwd = process.cwd()
var cli = hideout.cli
var assign = hideout.transforms.cli.assign
var NAMESPACES = config.namespaces

module.exports = function init() {

  // init host config
  return config
    .default()
    .then(function(defaultRc) {
      return {default: defaultRc, host: null}
    })
    .then(function(context) {
      return config.fallback()
        .then(function(rc) {
          context.host = rc
          return context
        })
    })
    .then(function(context) {
      cli
        // Main properties
        .session("Main properties", context.host)
        .then(function(host) {
          return cli
            .ask("name", path.basename(cwd))
            .then(assign(host, "name"))
        })
        .then(function(host) {
          return cli
            .ask("root", host.root)
            .then(assign(host, "root"))
        })

        // Namespaces
        .then(function(host) {
          host.namespace = host.namespace || {}

          // Select namespaces
          return cli
            .checkbox("Select namespaces to generate", NAMESPACES)
            .then(function(selection) {

              // Namespace mappings
              return cli
                .session("Set namespace-directory mapping", host.namespace)
                .then(function(namespaces) {
                  return hideout.flow.series(selection, function(ns) {
                    return cli
                      .ask(ns, namespaces[ns] || path.join(host.root, ns))
                      .then(assign(namespaces, ns))
                  })
                })
                .then(assign(host, "namespace"))
            })
        })

        // Directory creation

        // create root dir
        .then(function(host) {
          return hideout.fs.makeDir(config.resolveHostPath(host.root || cwd)).then(function() {
            logger.ok(logger.format.label("directory:", "root"))
            return host
          })
        })
        // create selected namespaces
        .then(function(host) {
          return hideout.flow.series(Object.keys(host.namespace), function(dir) {
            var target = host.namespace[dir]

            return hideout.fs.makeDir(config.resolveHostPath(target)).then(function() {
              logger.ok(logger.format.label("namespace:", dir))
            })
          }).then(function() {
            return host
          })
        })

        // create rc file
        .then(function(host) {
          var userConfigPath = config.getConfigPath(cwd)
          var configContent = JSON.stringify(host, null, 2)
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
