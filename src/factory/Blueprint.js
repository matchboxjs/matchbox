var object = require("matchbox-util/object")
var merge = require("matchbox-util/merge")

var Description = require("./Description")

module.exports = Blueprint

function Blueprint( parts ){
  this.parts = merge(parts)
  this.transform("describe", function( description ){
    if( !(description instanceof Description) ){
      return new Description(description)
    }
    return description
  })
}

Blueprint.prototype.get = function( property, defaultValue ){
  var parts = this.parts
  if( parts.hasOwnProperty(property) && parts[property] != null ){
    return parts[property]
  }
  else return defaultValue
}

Blueprint.prototype.digest = function( property, define, loop ){
  var part = this.get(property)
  if( part == null ) return
  loop ? object.in(part, define) : define(part)
}
Blueprint.prototype.transform = function( property, transform ){
  var part = this.get(property)
  if( part == null ) return
  object.in(part, function( name, value ){
    part[name] = transform(value, name)
  })
}

Blueprint.prototype.describe = function( target, phase, blueprint ){
  blueprint = blueprint || this
  this.digest("describe", function( partName, description ){
    if( description.phase != phase ) return

    var part = blueprint.get(partName)
    if( !part ) return

    object.in(part, function( name, value ){
      description.describe(target, name, value)
    })
  })
}
