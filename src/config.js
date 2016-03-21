var path = require("path")
var hideout = require("hideout")

var cwd = process.cwd()
var RC_FILE_NAME = ".matchboxrc"
var RC_FILE_GLOB = RC_FILE_NAME + ".{json,ya?ml}"
var RC_FILE_DEFAULT = RC_FILE_NAME + ".json"
var LIBRARY_ROOT = path.join(__dirname, "../")
var NAMESPACES = [
  "generators",
  "tasks",
  "ui",
  "libs",
  "utils",
  "polyfills"
]

module.exports = readHostConfig

module.exports.RC_FILE_NAME = RC_FILE_NAME
module.exports.RC_FILE_GLOB = RC_FILE_GLOB
module.exports.namespaces = NAMESPACES

/**
 * Read the user config, or the default if it doesn't exist yet
 * */
module.exports.fallback = function() {
  return readHostConfig().catch(function() {
    return readDefaultConfig()
  })
}

/**
 * Read the default config file
 * */
module.exports.default = function() {
  return readDefaultConfig()
}

/**
 * Read a config from a package
 * @param {String} packageName
 * @return {Promise}
 * */
module.exports.package = readPackageConfig
function readPackageConfig(packageName) {
  return readConfig(getConfigPath(resolvePackagePath(packageName))).catch(function(e) {
    throw new Error("Couldn't load config from package: " + packageName)
  })
}

/**
 * Read the host and package config (if provided)
 * and resolve to a config object.
 * {host: settings, package: settings}
 * when `packageName` is empty, the package field equals to host
 * */
module.exports.context = function(packageName) {
  return readHostConfig()
    .then(function(settings) {
      return {host: settings, package: settings}
    })
    .then(function(contexts) {
      if (packageName) {
        return readPackageConfig(packageName).then(function(setting) {
          contexts.package = setting
          return contexts
        })
      }
      return contexts
    })
}

/**
 * Create a config file path
 * */
module.exports.getConfigPath = getConfigPath
function getConfigPath(dir, format) {
  return path.join(dir, RC_FILE_NAME + "." + (format||"json"))
}

/**
 * Resolve some path to the cwd
 * */
module.exports.resolveHostPath = resolveHostPath
function resolveHostPath(somePath) {
  if (!somePath) {
    throw new Error("Can't resolve config path: '" + somePath + "'")
  }
  return path.resolve.apply(null, [cwd].concat([].slice.call(arguments)))
}

/**
 * Resolve a package path to the cwd
 * */
module.exports.resolvePackagePath = resolvePackagePath
function resolvePackagePath(somePath) {
  if (!somePath) {
    throw new Error("Can't resolve package path: '" + somePath + "'")
  }

  return resolveHostPath.apply(null, ["node_modules"].concat([].slice.call(arguments)))
}

module.exports.resolveLibPath = resolveLibPath
function resolveLibPath(somePath) {
  if (!somePath) {
    throw new Error("Can't resolve library path: '" + somePath + "'")
  }
  return path.resolve(LIBRARY_ROOT, somePath)
}

/**
 * Read the user config file, but log an error if it doesn't exist
 * */
function readHostConfig() {
  return readConfig(path.join(cwd, RC_FILE_GLOB))
}

/**
 * Read the default config file
 * */
function readDefaultConfig() {
  return readConfig(path.join(__dirname, "../config", RC_FILE_DEFAULT))
}

/**
 * Read a config file from a specific src
 * */
function readConfig(rcFileSearch) {
  return hideout.fs.src(rcFileSearch).then(function(files) {
    if (!files[0]) {
      throw new Error("Missing config file: " + rcFileSearch)
    }
    return files[0]
  }).then(function(configFile) {
    return hideout.fs.read(configFile).then(function(content) {
      try {
        switch (path.extname(configFile).substr(1)) {
          case "json":
            return JSON.parse(content)
          case "yml":
          case "yaml":
            return require("yamljs").parse(content)
        }
      }
      catch (e) {
        throw new Error("Invalid config file: " + configFile)
      }
    })
  })
}
