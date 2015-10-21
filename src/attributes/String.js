var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = String

function String (def) {
  Attribute.call(this, def)
  this.type = "string"
}

inherit(String, Attribute)

String.prototype.stringifyValue = function(value){
  return value == null ? null : value ? "" + value : ""
}