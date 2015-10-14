var Factory = require("./Factory")
var Blueprint = require("./Blueprint")
var Description = require("./Description")

module.exports = factory

factory.Description = Description

function factory( blueprint ){
  return new Factory(new Blueprint(blueprint)).assemble()
}
