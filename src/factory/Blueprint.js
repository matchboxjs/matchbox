var object = require("matchbox-util/object")
var merge = require("matchbox-util/merge")

var Description = require("./Description")

module.exports = Blueprint

function Blueprint( parts, parent ){
  this.parts = merge(parts)

  this.transform("describe", function( description ){
    return description instanceof description
        ? description
        : new Description(description)
  })

  if (parent) {
    //this.inheritPart("describe", parent)
    this.digestDescriptions(function (partName, description) {
      this.inheritPart(partName, parent)
    })
  }
}
Blueprint.prototype.describe = function( phase, target, top ){
  this.digestDescriptions(function( partName, description ){
    if( description.phase != phase ) return

    var part = top && top.has(partName)
        ? top.get(partName)
        : this.get(partName)
    if( !part ) return

    description.describe(part, target)
  })
}

Blueprint.prototype.digestDescriptions = function( fn ){
  this.digest("describe", fn.bind(this), true)
}

Blueprint.prototype.inheritPart = function( partName, parent ){
  this.parts[partName] = merge(parent.get(partName), this.get(partName))
}

Blueprint.prototype.has = function( partName ){
  return this.parts.hasOwnProperty(partName) && this.parts[partName] != null
}
Blueprint.prototype.get = function( partName, defaultValue ){
  var parts = this.parts
  if( this.has(partName) ){
    return parts[partName]
  }
  else return defaultValue
}

Blueprint.prototype.digest = function( partName, define, loop ){
  if (this.has(partName)) {
    var part = this.get(partName)
    if (loop) {
      object.in(part, define.bind(this))
    }
    else {
      define.call(this, part)
    }
  }
}

Blueprint.prototype.transform = function( property, transform ){
  var part = this.get(property)
  if( part == null ) return
  object.in(part, function( name, value ){
    part[name] = transform(value, name)
  })
}
