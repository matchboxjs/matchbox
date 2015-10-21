var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = Float

function Float (def) {
  Attribute.call(this, def)
  this.type = "float"
}

inherit(Float, Attribute)

Float.prototype.stringifyValue = function(value){
  return value == null ? null : parseInt(value, 10)
}
