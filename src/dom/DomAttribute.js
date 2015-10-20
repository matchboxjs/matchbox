var inherit = require("../factory/inherit")
var Attribute = require("../util/Attribute")

module.exports = DomAttribute

function DomAttribute (def) {
  Attribute.call(this, def)
  def = def || {}
  this.useData = def.useData || false
}

inherit(DomAttribute, Attribute)


DomAttribute.prototype.getAttribute = function( element, name ){
  name = this.useData ? "data-" + name : name
  return element.getAttribute(name)
}
DomAttribute.prototype.setAttribute = function( element, name, value ){
  name = this.useData ? "data-" + name : name
  return element.setAttribute(name, value)
}
DomAttribute.prototype.hasAttribute = function( element, name ){
  name = this.useData ? "data-" + name : name
  return element.hasAttribute(name)
}
DomAttribute.prototype.removeAttribute = function( element, name ){
  name = this.useData ? "data-" + name : name
  return element.removeAttribute(name)
}
