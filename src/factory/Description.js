module.exports = Description

function Description( phase, describer ){
  if( typeof describer != "function" && typeof phase == "function" ){
    describer = phase
    phase = null
  }
  this.phase = phase || "instance"
  this.describer = describer
}

Description.prototype.describe = function( target, name, value ){
  this.describer.call(target, name, value)
}
