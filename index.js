var matchbox = module.exports = {}

matchbox.config = require("./src/config")
matchbox.commands = {
  addGen: require("./bin/commands/add-gen"),
  bootstrap: require("./bin/commands/bootstrap"),
  generate: require("./bin/commands/generate"),
  init: require("./bin/commands/init")
}
