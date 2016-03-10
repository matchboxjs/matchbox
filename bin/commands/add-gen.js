var hideout = require("hideout")
var cwd = process.cwd()
var logger = hideout.util.logger
var config = require("../../src/config")
var NAMESPACES = config.namespaces
var assign = hideout.transforms.cli.assign

module.exports = function(generatorName) {

  config()
    .then(function(host) {
      if (!host.namespace.generators) {
        logger.warn("'generators' namespace is missing. Create it with 'matchbox init'")
        return
      }

      return host
    })
    .then(function(host) {
      if (!host) {
        return
      }

      return hideout
        .cli.session("Generator: " + generatorName, {
          namespace: "",
          dir: "",
          naming: "keep",
          template: false
        })
        // generator fields
        .then(function(generator) {
          return hideout
            .cli.select("Target namespace", NAMESPACES)
            .then(assign(generator, "namespace"))
            .then(function() {
              return hideout.cli.ask("Target dir", "")
            })
            .then(assign(generator, "dir"))
            .then(function() {
              return hideout.cli.select("Naming scheme", ["keep", "rename", "append"])
            })
            .then(assign(generator, "naming"))
            .then(function() {
              return hideout.cli.confirm("Generate template?")
            })
            .then(assign(generator, "template"))
        })
        // update rc file contents
        .then(function(generator) {
          var generatorPath = config.resolveHostPath(host.namespace.generators, generatorName)

          return hideout
            .fs.makeDir(generatorPath)
            .then(function() {
              host.generators = host.generators || {}
              host.generators[generatorName] = generator
              var userConfigPath = config.getConfigPath(cwd)
              var configContent = JSON.stringify(host, null, 2)

              return hideout.fs.write(userConfigPath, configContent)
            })
            // write generator template
            .then(function() {
              if (generator.template) {
                var compilerPath = generatorPath + ".js"
                var defaultCompiler = config.resolveLibPath("config/generator.js")
                return hideout.fs.copy(defaultCompiler, compilerPath)
              }
            })
        })
    })
    .then(function() {
      logger.ok(logger.format.label("Done!", generatorName))
    })
    .catch(logger.stack)
}
