var internals = require("matchbox-internals")
var Blueprint = require("./Blueprint")

module.exports = Factory

function Factory( blueprint, parent ){
  if( !(blueprint instanceof Blueprint) ) {
    blueprint = new Blueprint(blueprint)
  }

  var factory = this
  var Constructor
  var root

  if( parent instanceof Factory ){
    Constructor = parent.blueprint.get("constructor", function(){})
    root = parent.root || parent
  }
  else {
    Constructor = function(){
      factory.initialize(this, arguments)
    }
  }

  internals(Constructor)
  Constructor.extend = function( superBlueprint ){
    superBlueprint = superBlueprint || {}
    superBlueprint["inherit"] = Constructor
    return factory.extend(superBlueprint)
  }

  this.blueprint = blueprint
  this.Core = Constructor
  this.parent = parent || null
  this.root = root || null
}

Factory.prototype.assemble = function(){
  var blueprint = this.blueprint
  var Core = this.Core

  blueprint.digest("inherit", Core.inherit)
  blueprint.digest("include", Core.include)
  blueprint.digest("augment", Core.augment)
  blueprint.digest("prototype", Core.proto)
  blueprint.digest("static", Core.static)
  blueprint.digest("accessor", function( name, access ){
    if( !access ) return
    if( typeof access == "function" ){
      Core.get(name, access)
    }
    else if( typeof access["get"] == "function" && typeof access["set"] == "function" ){
      Core.accessor(name, access["get"], access["set"])
    }
    else if( typeof access["get"] == "function" ){
      Core.get(name, access["get"])
    }
    else if( typeof access["set"] == "function" ){
      Core.set(name, access["set"])
    }
  })

  this.traverse(function( factory ){
    factory.blueprint.describe(Core, "assemble", blueprint)
  })

  blueprint.describe(Core, "assemble")

  return this.Core
}

Factory.prototype.traverse = function( traverse ){
  var parents = []
  var factory = this.parent
  while( factory ){
    parents.push(factory)
    factory = factory.parent
  }
  var l = parents.length
  while( l-- ){
    traverse(parents[l])
  }
}

Factory.prototype.extend = function( blueprint ){
  var factory = new Factory(blueprint, this)
  return factory.assemble()
}

Factory.prototype.initialize = function( instance, args ){
  var blueprint = this
  this.traverse(function( factory ){
    factory.blueprint.describe(instance, "instance", blueprint)
  })
  blueprint.describe(instance, "instance")
  var Constructor = blueprint.get("constructor", function(){})
  Constructor.apply(instance, args)
}
