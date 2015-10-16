var object = require("matchbox-util/object")

module.exports = Description

function Description(description){
  description = description || {}
  this.phase = description.phase || "instance"
  this.override = description.override || true
  this.initialize = description.initialize || null
}

Description.prototype.describe = function( part, target ){
  var initialize = this.initialize
  if (!initialize) return

  object.in(part, function( name, value ){
    initialize.call(target, name, value, part)
  })
}
