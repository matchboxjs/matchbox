#!/usr/bin/env node

var commander = require("commander")

commander
  .version(require("../package.json").version)
  .option("-v, --version", "alias for -V")

commander
  .command("help")
  .description("display help")
  .action(function() {
    commander.outputHelp()
  })

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
  .command("gen <generator> <target>")
  .description("use a generator to populate a target directory")
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

if (!commander.args.length) commander.help()
