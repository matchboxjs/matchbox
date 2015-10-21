var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = Boolean

function Boolean (def) {
  Attribute.call(this, def)
  this.type = "boolean"
}

inherit(Boolean, Attribute)

Boolean.prototype.stringifyValue = function(){
  return ""
}
Boolean.prototype.shouldRemove = function( value ){
  return value == false
}
