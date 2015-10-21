var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = Number

function Number (def) {
  Attribute.call(this, def)
  this.type = "number"
}

inherit(Number, Attribute)

Number.prototype.stringifyValue = function(value){
  return value == null ? null : parseFloat(value)
}
