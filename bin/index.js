#!/usr/bin/env node

var commander = require("commander")

commander
  .version("0.1.0")

commander
  .command("init")
  .description("initialize a config file")
  .action(function action() {
    require("./commands/init").apply(null, arguments)
  })

commander
  .command("bootstrap [packages...]")
  .description("bootstrap dirs from the project or a package")
  .action(function action() {
    require("./commands/bootstrap").apply(null, arguments)
  })

commander
  .command("gen <template> <target>")
  .description("generate a template into destination")
  .action(function(template, dest) {
    require("./commands/generate").apply(null, arguments)
  })

commander
  .command("add-gen <name>")
  .description("create a generator")
  .action(function(template, dest) {
    require("./commands/add-gen").apply(null, arguments)
  })

commander
  .action(function(invalid) {
    console.warn("Invalid command '" + invalid + "'")
  })

commander.parse(process.argv)
