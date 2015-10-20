var forIn = require("matchbox-util/object/in")
var copy = require("matchbox-util/object/copy")
var inherit = require("./../factory/inherit")
var Extension = require("./../factory/Extension")

module.exports = CacheExtension

function CacheExtension (initialize) {
  Extension.call(this, {
    type: "cache",
    inherit: true,
    initialize: initialize
  })
}

inherit(CacheExtension, Extension)

//CacheExtension.prototype.use = function( prototype, block ){
//  if (!this.name) return
//
//  var cache = prototype[this.name] = {}
//
//  if (prototype.constructor.Super) {
//    var superCache = prototype.constructor.Super.prototype[this.name]
//    cache = prototype[this.name] = copy(superCache)
//  }
//
//  var initialize = this.initialize
//  forIn(block, function( name, value ){
//    cache[name] = initialize
//        ? initialize(prototype, name, value, block)
//        : value
//  })
//}
