var inherit = require("../factory/inherit")
var include = require("../factory/include")
var Attribute = require("../attributes/Attribute")
var String = require("../attributes/String")
var Boolean = require("../attributes/Boolean")
var Number = require("../attributes/Number")
var Float = require("../attributes/Float")

var domAttributes = module.exports = {}

domAttributes.create = function (def) {
  switch (Attribute.getType(def)) {
    case "string":
      return new DomString(def)
    case "boolean":
      return new DomBoolean(def)
    case "number":
      return new DomNumber(def)
    case "float":
      return new DomFloat(def)
  }
}

function DomAttribute (def) {
  def = def || {}
  this.prefix = def.prefix == null ? "data-" : def.prefix
}

DomAttribute.prototype.getFromContext = function( element, name ){
  name = this.prefix ? this.prefix + name : name
  return element.getAttribute(name)
}
DomAttribute.prototype.setOnContext = function( element, name, value ){
  name = this.prefix ? this.prefix + name : name
  return element.setAttribute(name, value)
}
DomAttribute.prototype.hasOnContext = function( element, name ){
  name = this.prefix ? this.prefix + name : name
  return element.hasAttribute(name)
}
DomAttribute.prototype.removeFromContext = function( element, name ){
  name = this.prefix ? this.prefix + name : name
  return element.removeAttribute(name)
}

function DomString (def) {
  String.call(this, def)
  DomAttribute.call(this, def)
}
domAttributes.String = DomString
inherit(DomString, String)
include(DomString, DomAttribute)

function DomBoolean (def) {
  Boolean.call(this, def)
  DomAttribute.call(this, def)
}
domAttributes.Boolean = DomBoolean
inherit(DomBoolean, Boolean)
include(DomBoolean, DomAttribute)

function DomNumber (def) {
  Number.call(this, def)
  DomAttribute.call(this, def)
}
domAttributes.Number = DomNumber
inherit(DomNumber, Number)
include(DomNumber, DomAttribute)

function DomFloat (def) {
  Float.call(this, def)
  DomAttribute.call(this, def)
}
domAttributes.Float = DomFloat
inherit(DomFloat, Float)
include(DomFloat, DomAttribute)
