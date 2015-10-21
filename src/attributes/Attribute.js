module.exports = Attribute

function Attribute (def) {
  if (typeof def == "undefined") {
    def = {}
  }
  this.type = def.type || ""
  this.name = def.name || ""
  this.onchange = def.onchange || null
  this.default = null
  this.hasDefault = false

  if (Attribute.isPrimitive(def)) {
    this.default = def
    this.hasDefault = true
  }
  else if (def) {
    this.default = def.default
    this.hasDefault = typeof this.default != "undefined"
  }
}

Attribute.getType = function (def) {
  if (typeof def == "undefined") {
    return "string"
  }
  if (Attribute.isPrimitive(def)) {
    switch (typeof def) {
      case "number":
        // note: it fails for 1.0
        if (def === +def && def !== (def | 0)) {
          return "float"
        }
    }
    return typeof def
  }
  else {
    return typeof def.type
  }
}

Attribute.isPrimitive = function (value) {
  switch( typeof value ) {
    case "boolean":
    case "number":
    case "string":
      return true
    default:
      return false
  }
}

Attribute.prototype.parseValue = function (value) {
  return value
}
Attribute.prototype.stringifyValue = function (value) {
  return "" + value
}
Attribute.prototype.shouldRemove = function( value ){
  return value == null
}

Attribute.prototype.defineProperty = function (obj, name, getContext) {
  var attribute = this
  Object.defineProperty(obj, name, {
    get: function () {
      var context = typeof getContext == "function" ? getContext(this) : getContext
      attribute.get(context)
    },
    set: function (value) {
      var context = typeof getContext == "function" ? getContext(this) : getContext
      attribute.set(context, value)
    }
  })
}
Attribute.prototype.getFromContext = function (context, name) {}
Attribute.prototype.setOnContext = function (context, name, value) {}
Attribute.prototype.hasOnContext = function (context, name) {}
Attribute.prototype.removeFromContext = function (context, name) {}

Attribute.prototype.get = function( context, useDefault ){
  var value = this.getFromContext(context, this.name)
  if( value == null && useDefault == true ){
    return this.default
  }

  return this.parseValue(value)
}

Attribute.prototype.set = function( context, value, callOnchange ){
  var previousValue = this.get(context, false)
  if( previousValue === value ){
    return
  }

  if( this.shouldRemove(value) ){
    this.removeFromContext(context, this.name)
  }
  else {
    var newValue = this.stringifyValue(value)
    this.setOnContext(context, this.name, newValue)
  }

  this.onchange && callOnchange != false && this.onchange.call(context, previousValue, value)
}
