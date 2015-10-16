var Blueprint = require("./Blueprint")
var extend = require("./extend")
var augment = require("./augment")
var include = require("./include")
var inherit = require("./inherit")

module.exports = Factory

function Factory( blueprint, parent ){
  var factory = this

  if( !(blueprint instanceof Blueprint) ) {
    blueprint = new Blueprint(blueprint, parent ? parent.blueprint : null)
  }

  //function Core(){
  //  var instance = this
  //  var args = arguments
  //  var Constructor = factory.Constructor
  //  //var Super = factory.Super
  //
  //  //factory.buildUp(function (ancestor) {
  //  //  var SuperConstructor = ancestor.Constructor
  //  //  ancestor.blueprint.describe("instance", instance, blueprint)
  //  //  SuperConstructor && SuperConstructor.apply(instance, args)
  //  //})
  //  //Super && Super.apply(instance, args)
  //  blueprint.describe("instance", instance)
  //  Constructor && Constructor.apply(instance, args)
  //}
  //
  //internals(Core)
  //Core.extend = function( superBlueprint ){
  //  superBlueprint = superBlueprint || {}
  //  superBlueprint["inherit"] = Core
  //  return new Factory(superBlueprint, factory).assemble()
  //}
  //Core.initialize = function (instance, args) {
  //  blueprint.describe("instance", instance)
  //}

  this.blueprint = blueprint
  //this.Core = Core
  this.parent = parent || null
  this.ancestors = parent ? parent.ancestors.concat([parent]) : []
  this.root = this.ancestors[0] || null
  this.Super = blueprint.get("inherit", null)
  this.Constructor = blueprint.get("constructor", null)
  this.Constructor.extend = function (superBlueprint) {
    superBlueprint = superBlueprint || {}
    superBlueprint["inherit"] = factory.Constructor
    return new Factory(superBlueprint, factory).assemble()
  }
}

Factory.prototype.assemble = function(){
  var blueprint = this.blueprint
  var Constructor = this.Constructor

  blueprint.digest("inherit", function (Base) {
    inherit(Constructor, Base)
  })
  blueprint.digest("include", function (includes) {
    include(Constructor, includes)
  })
  blueprint.digest("augment", function (augments) {
    augment(Constructor, augments)
  })
  blueprint.digest("prototype", function (proto) {
    extend(Constructor, proto)
  })
  blueprint.digest("static", function (name, method) {
    Constructor[name] = method
  }, true)
  blueprint.digest("accessor", function( name, access ){
    if( !access ) return
    if( typeof access == "function" ){
      Constructor.get(name, access)
    }
    else if( typeof access["get"] == "function" && typeof access["set"] == "function" ){
      Constructor.accessor(name, access["get"], access["set"])
    }
    else if( typeof access["get"] == "function" ){
      Constructor.get(name, access["get"])
    }
    else if( typeof access["set"] == "function" ){
      Constructor.set(name, access["set"])
    }
  }, true)

  blueprint.digestDescriptions(function (partName) {
    if (blueprint.has(partName)) {
      Constructor[partName] = blueprint.get(partName)
    }
  })

  //this.traverse(function( ancestor ){
  //  ancestor.blueprint.describe("prototype", Core, blueprint)
  //})

  blueprint.describe("prototype", Constructor.prototype)

  Constructor.Super = this.Super
  Constructor.prototype.Super = this.Super
  Constructor.prototype.super = function () {
    Constructor.Super.apply(this, arguments)
  }
  Constructor.prototype.initialize = function () {
    blueprint.describe("instance", this)
  }

  return this.Core
}

Factory.prototype.buildUp = function( traverse ){
  this.ancestors.forEach(traverse, this)
}
