(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.matchbox = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var matchbox = module.exports = {}

matchbox.factory = require("./src/factory")
matchbox.ui = require("./src/ui")
matchbox.dom = require("./src/dom")
matchbox.attributes = require("./src/attributes")

},{"./src/attributes":14,"./src/dom":19,"./src/factory":26,"./src/ui":36}],2:[function(require,module,exports){
module.exports = Descriptor

var _writable = "_writable"
var _enumerable = "_enumerable"
var _configurable = "_configurable"

function Descriptor( writable, enumerable, configurable ){
  this.value(this, _writable, writable || false)
  this.value(this, _enumerable, enumerable || false)
  this.value(this, _configurable, configurable || false)

  this.getter(this, "w", function () { return this.writable })
  this.getter(this, "writable", function () {
    return new Descriptor(true, enumerable, configurable)
  })

  this.getter(this, "e", function () { return this.enumerable })
  this.getter(this, "enumerable", function () {
    return new Descriptor(writable, true, configurable)
  })

  this.getter(this, "c", function () { return this.configurable })
  this.getter(this, "configurable", function () {
    return new Descriptor(writable, enumerable, true)
  })
}

Descriptor.prototype = {
  accessor: function( obj, name, getter, setter ){
    Object.defineProperty(obj, name, {
      enumerable: this[_enumerable],
      configurable: this[_configurable],
      get: getter,
      set: setter
    })
    return this
  },
  getter: function( obj, name, fn ){
    Object.defineProperty(obj, name, {
      enumerable: this[_enumerable],
      configurable: this[_configurable],
      get: fn
    })
    return this
  },
  setter: function( obj, name, fn ){
    Object.defineProperty(obj, name, {
      enumerable: this[_enumerable],
      configurable: this[_configurable],
      set: fn
    })
    return this
  },
  value: function( obj, name, value ){
    Object.defineProperty(obj, name, {
      writable: this[_writable],
      enumerable: this[_enumerable],
      configurable: this[_configurable],
      value: value
    })
    return this
  },
  method: function( obj, name, fn ){
    Object.defineProperty(obj, name, {
      writable: this[_writable],
      enumerable: false,
      configurable: this[_configurable],
      value: fn
    })
    return this
  },
  property: function( obj, name, value ){
    Object.defineProperty(obj, name, {
      writable: this[_writable],
      enumerable: false,
      configurable: this[_configurable],
      value: value
    })
    return this
  },
  constant: function( obj, name, value ){
    Object.defineProperty(obj, name, {
      writable: false,
      enumerable: false,
      configurable: false,
      value: value
    })
    return this
  }
}

},{}],3:[function(require,module,exports){
var extend = require("./extend")

module.exports = function (obj) {
  return extend({}, obj)
}

},{"./extend":6}],4:[function(require,module,exports){
var copy = require("./copy")

module.exports = function defaults (options, defaults) {
  if (!options) {
    return copy(defaults)
  }

  var obj = copy(options)

  for (var prop in defaults) {
    if (defaults.hasOwnProperty(prop) && !options.hasOwnProperty(prop)) {
      obj[prop] = defaults[prop]
    }
  }

  return obj
}

},{"./copy":3}],5:[function(require,module,exports){
var Descriptor = require("./Descriptor")

module.exports = new Descriptor()

},{"./Descriptor":2}],6:[function(require,module,exports){
module.exports = function extend( obj, extension ){
  for( var name in extension ){
    if( extension.hasOwnProperty(name) ) obj[name] = extension[name]
  }
  return obj
}

},{}],7:[function(require,module,exports){
module.exports = function( obj, callback ){
  for( var prop in obj ){
    if( obj.hasOwnProperty(prop) ){
      callback(prop, obj[prop], obj)
    }
  }
  return obj
}

},{}],8:[function(require,module,exports){
var extend = require("./extend")

module.exports = function( obj, extension ){
  return extend(extend({}, obj), extension)
}

},{"./extend":6}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = Boolean

function Boolean (def) {
  Attribute.call(this, def)
  this.type = "boolean"
}

inherit(Boolean, Attribute)

Boolean.prototype.stringifyValue = function(){
  return ""
}
Boolean.prototype.shouldRemove = function( value ){
  return value == false
}

},{"../factory/inherit":27,"./Attribute":9}],11:[function(require,module,exports){
var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = Float

function Float (def) {
  Attribute.call(this, def)
  this.type = "float"
}

inherit(Float, Attribute)

Float.prototype.stringifyValue = function(value){
  return value == null ? null : parseInt(value, 10)
}

},{"../factory/inherit":27,"./Attribute":9}],12:[function(require,module,exports){
var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = Number

function Number (def) {
  Attribute.call(this, def)
  this.type = "number"
}

inherit(Number, Attribute)

Number.prototype.stringifyValue = function(value){
  return value == null ? null : parseFloat(value)
}

},{"../factory/inherit":27,"./Attribute":9}],13:[function(require,module,exports){
var inherit = require("../factory/inherit")
var Attribute = require("./Attribute")

module.exports = String

function String (def) {
  Attribute.call(this, def)
  this.type = "string"
}

inherit(String, Attribute)

String.prototype.stringifyValue = function(value){
  return value == null ? null : value ? "" + value : ""
}

},{"../factory/inherit":27,"./Attribute":9}],14:[function(require,module,exports){
var Attribute = require("./Attribute")
var String = require("./String")
var Boolean = require("./Boolean")
var Number = require("./Number")
var Float = require("./Float")

var attributes = module.exports = {}

attributes.create = function (def) {
  switch (Attribute.getType(def)) {
    case "string":
      return new String(def)
    case "boolean":
      return new Boolean(def)
    case "number":
      return new Number(def)
    case "float":
      return new Float(def)
  }
}

attributes.Attribute = Attribute
attributes.String = String
attributes.Boolean = Boolean
attributes.Number = Number
attributes.Float = Float

},{"./Attribute":9,"./Boolean":10,"./Float":11,"./Number":12,"./String":13}],15:[function(require,module,exports){
module.exports = Fragment

function Fragment (fragment) {
  fragment = fragment || {}
  this.html = fragment.html || ""
  this.first = fragment.first == undefined || !!fragment.first
  this.timeout = fragment.timeout || 2000
}

Fragment.prototype.create = function (html) {
  var temp = document.createElement('div')

  temp.innerHTML = html || this.html

  if (this.first === undefined || this.first) {
    return temp.children[0]
  }

  var fragment = document.createDocumentFragment()
  while (temp.childNodes.length) {
    fragment.appendChild(temp.firstChild)
  }

  return fragment;
}

Fragment.prototype.compile = function (html, options, cb) {
  setTimeout(function () {
    cb(null, html)
  }, 4)
}

Fragment.prototype.render = function (context, options) {
  var fragment = this
  context = context || {}

  return new Promise(function (resolve, reject) {
    var resolved = false
    var id = setTimeout(function () {
      reject(new Error("Render timed out"))
    }, fragment.timeout)

    try {
      fragment.compile(context, options, function (err, rendered) {
        clearTimeout(id)
        if (resolved) return

        if (err) {
          reject(err)
        }
        else {
          resolve(fragment.create(rendered))
        }
      })
    }
    catch (e) {
      reject(e)
    }
  })
}

},{}],16:[function(require,module,exports){
module.exports = Selector

Selector.DEFAULT_NEST_SEPARATOR = ":"

function Selector (selector) {
  selector = selector || {}
  this.attribute = selector.attribute
  this.value = selector.value || null
  this.operator = selector.operator || "="
  this.extra = selector.extra || null

  this.element = selector.element || null

  this.Constructor = selector.Constructor || null
  this.instantiate = selector.instantiate || null
  this.multiple = selector.multiple != null ? !!selector.multiple : false

  this.matcher = selector.matcher || null
}

Selector.prototype.clone = function () {
  return new Selector(this)
}

Selector.prototype.combine = function (selector) {
  var s = this.clone()
  s.extra += selector.toString()
  return s
}

Selector.prototype.equal = function (value) {
  var s = this.clone()
  s.operator = "="
  s.value = value
  return s
}

Selector.prototype.contains = function (value) {
  var s = this.clone()
  s.operator = "~"
  s.value = value
  return s
}

Selector.prototype.prefix = function (pre, separator) {
  var s = this.clone()
  var sep = s.value ? separator || Selector.DEFAULT_NEST_SEPARATOR : ""
  s.value = pre + sep + s.value
  return s
}

Selector.prototype.nest = function (post, separator) {
  var s = this.clone()
  var sep = s.value ? separator || Selector.DEFAULT_NEST_SEPARATOR : ""
  s.value += sep + post
  return s
}

Selector.prototype.from = function (element) {
  var s = this.clone()
  s.element = element
  return s
}

Selector.prototype.select = function (element, transform) {
  var result = element.querySelector(this.toString())
  return transform ? transform(result) : result
}

Selector.prototype.selectAll = function (element, transform) {
  var result = element.querySelectorAll(this.toString())
  return transform ? transform(result) : result
}

Selector.prototype.node = function (transform) {
  return this.select(this.element, transform)
}

Selector.prototype.nodeList = function (transform) {
  return this.selectAll(this.element, transform)
}

Selector.prototype.construct = function () {
  var Constructor = this.Constructor
  var instantiate = this.instantiate || function (element) {
    return new Constructor(element)
  }
  if (this.multiple) {
    return this.nodeList(function (elements) {
      return [].map.call(elements, instantiate)
    })
  }
  else {
    return this.node(instantiate)
  }
}

Selector.prototype.toString = function () {
  var value = this.value != null
      ? '"' + (this.value == true ? "" : this.value) + '"'
      : ""
  var operator = value ? this.operator || "=" : ""
  var extra = this.extra || ""
  return "[" + this.attribute + operator + value + "]" + extra
}

},{}],17:[function(require,module,exports){
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

},{"../attributes/Attribute":9,"../attributes/Boolean":10,"../attributes/Float":11,"../attributes/Number":12,"../attributes/String":13,"../factory/include":25,"../factory/inherit":27}],18:[function(require,module,exports){
var Selector = require("./Selector")

/**
 * Registers an event listener on an element
 * and returns a delegator.
 * A delegated event runs matches to find an event target,
 * then executes the handler paired with the matcher.
 * Matchers can check if an event target matches a given selector,
 * or see if an of its parents do.
 * */
module.exports = delegate

function delegate( options ){
  var element = options.element
    , event = options.event
    , capture = !!options.capture || false
    , context = options.context || element
    , transform = options.transform || null

  if( !element ){
    console.log("Can't delegate undefined element")
    return null
  }
  if( !event ){
    console.log("Can't delegate undefined event")
    return null
  }

  var delegator = createDelegator(context, transform)
  element.addEventListener(event, delegator, capture)

  return delegator
}

/**
 * Returns a delegator that can be used as an event listener.
 * The delegator has static methods which can be used to register handlers.
 * */
function createDelegator( context, transform ){
  var matchers = []

  function delegator( e ){
    var l = matchers.length
    if( !l ){
      return true
    }

    var el = this
        , i = -1
        , handler
        , selector
        , delegateElement
        , stopPropagation
        , args

    while( ++i < l ){
      args = matchers[i]
      handler = args[0]
      selector = args[1]

      delegateElement = matchCapturePath(selector, el, e, transform, context)
      if( delegateElement && delegateElement.length ) {
        stopPropagation = false === handler.apply(context, [e].concat(delegateElement))
        if( stopPropagation ) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Registers a handler with a target finder logic
   * */
  delegator.match = function( selector, handler ){
    matchers.push([handler, selector])
    return delegator
  }

  return delegator
}

function matchCapturePath( selector, el, e, transform, context ){
  var delegateElements = []
  var delegateElement = null
  if( Array.isArray(selector) ){
    var i = -1
    var l = selector.length
    while( ++i < l ){
      delegateElement = findParent(selector[i], el, e)
      if( !delegateElement ) return null
      if (typeof transform == "function") {
        delegateElement = transform(context, selector, delegateElement)
      }
      delegateElements.push(delegateElement)
    }
  }
  else {
    delegateElement = findParent(selector, el, e)
    if( !delegateElement ) return null
    if (typeof transform == "function") {
      delegateElement = transform(context, selector, delegateElement)
    }
    delegateElements.push(delegateElement)
  }
  return delegateElements
}

/**
 * Check if the target or any of its parent matches a selector
 * */
function findParent( selector, el, e ){
  var target = e.target
  if (selector instanceof Selector) {
    selector = selector.toString()
  }
  switch( typeof selector ){
    case "string":
      while( target && target != el ){
        if( target.matches && target.matches(selector) ) return target
        target = target.parentNode
      }
      break
    case "function":
      while( target && target != el ){
        if( selector.call(el, target) ) return target
        target = target.parentNode
      }
      break
    default:
      return null
  }
  return null
}

},{"./Selector":16}],19:[function(require,module,exports){
var dom = module.exports = {}

dom.delegate = require("./delegate")
dom.Selector = require("./Selector")

},{"./Selector":16,"./delegate":18}],20:[function(require,module,exports){
var merge = require("matchbox-util/object/merge")
var forIn = require("matchbox-util/object/in")
var Extension = require("./Extension")

module.exports = Blueprint

function Blueprint( blocks, parent ){
  var blueprint = this

  this.blocks = merge(blocks)
  this.parent = parent

  this.localExtensions = this.get("extensions", {})

  forIn(this.localExtensions, function( name, extension ){
    //if (parent && !!~parent.extensionNames.indexOf(name)) {
    //  throw new Error("Description override is not supported")
    //}

    extension = extension instanceof Extension
        ? extension
        : new Extension(extension)
    blueprint.localExtensions[name] = extension
    extension.name = name
  })

  this.globalExtensions = this.localExtensions

  if (parent) {
    this.globalExtensions = merge(parent.globalExtensions, this.localExtensions)
    forIn(this.globalExtensions, function (name, extension) {
      if (extension.inherit) {
        blueprint.blocks[name] = merge(parent.get(name), blueprint.get(name))
      }
    })
  }
}

Blueprint.prototype.buildPrototype = function( prototype, top ){
  this.build("prototype", this.globalExtensions, top, function (name, extension, block) {
    forIn(block, function( name, value ){
      extension.initialize(prototype, name, value)
    })
  })
}

Blueprint.prototype.buildCache = function( prototype, top ){
  this.build("cache", this.globalExtensions, top, function (name, extension, block) {
    if (!prototype.hasOwnProperty(name)) {
      prototype[name] = {}
    }

    var cache = prototype[name]
    var initialize = extension.initialize

    forIn(block, function( name, value ){
      cache[name] = initialize
          ? initialize(prototype, name, value)
          : value
    })
  })
}

Blueprint.prototype.buildInstance = function( instance, top ){
  this.build("instance", this.localExtensions, top, function (name, extension, block) {
    forIn(block, function( name, value ){
      extension.initialize(instance, name, value)
    })
  })
}

Blueprint.prototype.build = function( type, extensions, top, build ){
  var blueprint = top || this
  //var base = this
  forIn(extensions, function (name, extension) {
    if( extension.type != type ) return
    //var blueprint = extension.inherit ? top : base
    var block = blueprint.get(name)
    if( !block ) return

    build(name, extension, block)
  })
}

Blueprint.prototype.digest = function( name, fn, loop ){
  if (this.has(name)) {
    var block = this.get(name)
    if (loop) {
      forIn(block, fn)
    }
    else {
      fn.call(this, block)
    }
  }
}

Blueprint.prototype.has = function( name ){
  return this.blocks.hasOwnProperty(name) && this.blocks[name] != null
}

Blueprint.prototype.get = function( name, defaultValue ){
  if( this.has(name) ){
    return this.blocks[name]
  }
  else return defaultValue
}

},{"./Extension":21,"matchbox-util/object/in":7,"matchbox-util/object/merge":8}],21:[function(require,module,exports){
module.exports = Extension

function Extension(extension){
  extension = extension || {}
  this.name = ""
  this.type = extension.type || "instance"
  this.inherit = extension.inherit || false
  this.initialize = extension.initialize || null
}

//Extension.prototype.use = function( context, block ){}

},{}],22:[function(require,module,exports){
var define = require("matchbox-util/object/define")
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

  this.blueprint = blueprint
  this.parent = parent || null
  this.ancestors = parent ? parent.ancestors.concat([parent]) : []
  this.root = this.ancestors[0] || null
  this.Super = blueprint.get("inherit", null)
  this.Constructor = blueprint.get("constructor", function () {
    if (this.constructor.Super) {
      this.constructor.Super.apply(this, arguments)
    }
    this.constructor.initialize(this)
  })
  this.Constructor.extend = function (superBlueprint) {
    superBlueprint = superBlueprint || {}
    superBlueprint["inherit"] = factory.Constructor
    var superFactory = new Factory(superBlueprint, factory)
    return superFactory.assemble()
  }

  this.industry.push(this)
}

Factory.prototype.assemble = function(){
  var factory = this
  var blueprint = this.blueprint
  var Constructor = this.Constructor

  Constructor.Super = this.Super
  Constructor.blueprint = blueprint

  this.digest()

  blueprint.buildPrototype(Constructor.prototype, blueprint)
  blueprint.buildCache(Constructor.prototype, blueprint)

  Constructor.initialize = function (instance) {
    //var top = factory.findFactory(instance.constructor).blueprint
    var top = instance.constructor.blueprint
    blueprint.buildInstance(instance, top)
  }

  return Constructor
}

Factory.prototype.digest = function(  ){
  var factory = this
  var blueprint = this.blueprint
  var Constructor = this.Constructor
  var proto = Constructor.prototype

  blueprint.digest("inherit", function (Super) {
    inherit(Constructor, Super)
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
      define.getter(proto, name, access)
    }
    else if( typeof access["get"] == "function" && typeof access["set"] == "function" ){
      define.accessor(proto, name, access["get"], access["set"])
    }
    else if( typeof access["get"] == "function" ){
      define.getter(proto, name, access["get"])
    }
    else if( typeof access["set"] == "function" ){
      define.getter(proto, name, access["set"])
    }
  }, true)
  //blueprint.digest("include", function (includes) {
  //  if (!Array.isArray(includes)) {
  //    includes = [includes]
  //  }
  //  includes.forEach(function (include) {
  //    var foreign = factory.findFactory(include)
  //    if (foreign) {
  //      foreign.blueprint.build("prototype", Constructor.prototype, blueprint)
  //    }
  //  })
  //})
}

Factory.prototype.industry = []

Factory.prototype.findFactory = function( Constructor ){
  var ret = null
  this.industry.some(function (factory) {
    return factory.Constructor === Constructor && (ret = factory)
  })
  return ret
}

},{"./Blueprint":20,"./augment":23,"./extend":24,"./include":25,"./inherit":27,"matchbox-util/object/define":5}],23:[function(require,module,exports){
module.exports = function augment (Class, mixin) {
  if (Array.isArray(mixin)) {
    mixin.forEach(function (mixin) {
      if (typeof mixin == "function") {
        mixin.call(Class.prototype)
      }
    })
  }
  else {
    if (typeof mixin == "function") {
      mixin.call(Class.prototype)
    }
  }

  return Class
}

},{}],24:[function(require,module,exports){
module.exports = function extend (Class, prototype) {
  Object.getOwnPropertyNames(prototype).forEach(function (name) {
    if (name !== "constructor" ) {
      var descriptor = Object.getOwnPropertyDescriptor(prototype, name)
      Object.defineProperty(Class.prototype, name, descriptor)
    }
  })

  return Class
}

},{}],25:[function(require,module,exports){
var extend = require("./extend")

module.exports = function include (Class, Other) {
  if (Array.isArray(Other)) {
    Other.forEach(function (Other) {
      if (typeof Other == "function") {
        extend(Class, Other.prototype)
      }
      else if (typeof Other == "object") {
        extend(Class, Other)
      }
    })
  }
  else {
    if (typeof Other == "function") {
      extend(Class, Other.prototype)
    }
    else if (typeof Other == "object") {
      extend(Class, Other)
    }
  }

  return Class
}

},{"./extend":24}],26:[function(require,module,exports){
var Factory = require("./Factory")

module.exports = function factory( blueprint ){
  return new Factory(blueprint).assemble()
}

},{"./Factory":22}],27:[function(require,module,exports){
module.exports = function inherit (Class, Base) {
  Class.prototype = Object.create(Base.prototype)
  Class.prototype.constructor = Class

  return Class
}

},{}],28:[function(require,module,exports){
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

},{"./../factory/Extension":21,"./../factory/inherit":27,"matchbox-util/object/copy":3,"matchbox-util/object/in":7}],29:[function(require,module,exports){
var defaults = require("matchbox-util/object/defaults")
var View = require("./View")
var Selector = require("../dom/Selector")
var Fragment = require("../dom/Fragment")
var InstanceExtension = require("./InstanceExtension")
var CacheExtension = require("./CacheExtension")

var Element = module.exports = View.extend({
  extensions: {
    children: new InstanceExtension(function(element, name, selector){
      selector = new Selector(defaults(selector, {
        attribute: "data-element",
        operator: "~",
        value: name
      })).prefix(element.name)
      selector.element = element.element
      element.children[name] = selector
    }),
    fragments: new CacheExtension(function (prototype, name, fragment) {
      if (!(fragment instanceof Fragment)) {
        return new Fragment(fragment)
      }
      return fragment
    })
  },
  children: {},
  changeLayout: {},
  events: {},
  attributes: {},
  fragments: {},
  constructor: function Element(element) {
    View.apply(this, arguments)
    Element.initialize(this)
  },
  prototype: {
    name: ""
  }
})

},{"../dom/Fragment":15,"../dom/Selector":16,"./CacheExtension":28,"./InstanceExtension":31,"./View":35,"matchbox-util/object/defaults":4}],30:[function(require,module,exports){
var delegate = require("../dom/delegate")

module.exports = Event

function Event (event) {
  event = event || {}
  this.type = event.type
  this.target = event.target
  this.once = !!event.once
  this.capture = !!event.capture
  this.handler = event.handler
  this.proxy = event.handler
  if (event.transform ) this.transform = event.transform
}

Event.prototype.transform = function () {}

Event.prototype.register = function (element, context) {
  if (this.target) {
    this.proxy = delegate({
      element: element,
      event: this.event,
      context: context,
      transform: this.transform
    })
    this.proxy.match(this.target, this.handler)
  }
  else {
    if (this.once) {
      element.addEventListener(this.type, this.handler, this.capture)
    }
    else {
      element.addEventListener(this.type, this.handler, this.capture)
    }
  }
}

Event.prototype.unRegister = function (element) {
  if (this.proxy) {
    element.removeEventListener(this.type, this.proxy, this.capture)
  }
  else {
    element.removeEventListener(this.type, this.handler, this.capture)
  }
}

},{"../dom/delegate":18}],31:[function(require,module,exports){
var forIn = require("matchbox-util/object/in")
var inherit = require("./../factory/inherit")
var Extension = require("./../factory/Extension")

module.exports = InstanceExtension

function InstanceExtension (initialize) {
  Extension.call(this, {
    type: "instance",
    inherit: true,
    initialize: initialize
  })
}

inherit(InstanceExtension, Extension)

//InstanceExtension.prototype.use = function( instance, block ){
//  var initialize = this.initialize
//  forIn(block, function( name, value ){
//    initialize(instance, name, value, block)
//  })
//}

},{"./../factory/Extension":21,"./../factory/inherit":27,"matchbox-util/object/in":7}],32:[function(require,module,exports){
var forIn = require("matchbox-util/object/in")
var inherit = require("./../factory/inherit")
var Extension = require("./../factory/Extension")

module.exports = PrototypeExtension

function PrototypeExtension (initialize) {
  Extension.call(this, {
    type: "prototype",
    inherit: false,
    initialize: initialize
  })
}

inherit(PrototypeExtension, Extension)

//PrototypeExtension.prototype.use = function( prototype, block ){
//  var initialize = this.initialize
//  forIn(block, function( name, value ){
//    initialize(prototype, name, value, block)
//  })
//}

},{"./../factory/Extension":21,"./../factory/inherit":27,"matchbox-util/object/in":7}],33:[function(require,module,exports){
var defaults = require("matchbox-util/object/defaults")
var View = require("./View")
var Selector = require("../dom/Selector")
var InstanceExtension = require("./InstanceExtension")

var Region = module.exports = View.extend({
  extensions: {
    children: new InstanceExtension(function(region, name, selector){
      selector = new Selector(defaults(selector, {
        attribute: "data-element",
        operator: "~",
        value: name
      }))
      selector.element = region.element
      region.children[name] = selector
    })
  },
  children: {},
  layouts: {},
  events: {},
  attributes: {
    visible: false,
    focused: false
  },
  constructor: function Region(element) {
    View.call(this, element)
    Region.initialize(this)
  },
  prototype: {
    name: ""
  }
})

},{"../dom/Selector":16,"./InstanceExtension":31,"./View":35,"matchbox-util/object/defaults":4}],34:[function(require,module,exports){
var defaults = require("matchbox-util/object/defaults")
var View = require("./View")
var Region = require("./Region")
var Selector = require("../dom/Selector")
var inherit = require("../factory/inherit")
var InstanceExtension = require("./InstanceExtension")

var Screen = module.exports = View.extend({
  extensions: {
    regions: new InstanceExtension(function (screen, name, selector) {
      selector = new Selector(defaults(selector, {
        attribute: "data-region",
        operator: "=",
        value: name,
        Constructor: Region
      }))
      selector.element = screen.element
      screen.regions[name] = selector
    })
  },
  regions: {},
  changeLayout: {},
  events: {},
  attributes: {},
  constructor: function Screen(element) {
    element = element || document.body
    element = this.selector.select(element)
    View.call(this, element)
    this.regions = {}
    Screen.initialize(this)
  },
  prototype: {
    selector: new Selector({attribute: "data-screen"})
  }
})

},{"../dom/Selector":16,"../factory/inherit":27,"./InstanceExtension":31,"./Region":33,"./View":35,"matchbox-util/object/defaults":4}],35:[function(require,module,exports){
var define = require("matchbox-util/object/define")
var defaults = require("matchbox-util/object/defaults")
var factory = require("../factory")
var Event = require("./Event")
var attributes = require("../attributes")
var domAttributes = require("../dom/attributes")
var PrototypeExtension = require("./PrototypeExtension")
var InstanceExtension = require("./InstanceExtension")
var CacheExtension = require("./CacheExtension")

var View = module.exports = factory({
  'static': {},

  extensions: {
    layouts: new CacheExtension(function (prototype, name, layoutHandler) {
      return layoutHandler
    }),
    events: new InstanceExtension(function (view, name, event) {
      if (!(event instanceof Event)) {
        event = new Event(event)
      }
      if (typeof event.handler == "string") {
        event.handler = view[event.handler].bind(view)
      }
      event.register(view.element, this)
    }),
    attributes: new PrototypeExtension(function (prototype, name, attribute) {
      if (!(attribute instanceof attributes.Attribute)) {
        attribute = domAttributes.create(attribute)
      }

      attribute.name = attribute.name || name
      attribute.defineProperty(prototype, name, function (view) {
        return view.element
      })
    })
  },

  layouts: {
    'default': function () {}
  },
  events: {},
  attributes: {
    dummy: false
  },

  constructor: function View( element ){
    this.currentLayout = ""
    //this.layouts = {}
    this.children = {}
    this._element = null
    this.element = element
    View.initialize(this)
  },

  accessor: {
    element: {
      get: function () {
        return this._element
      },
      set: function (element) {
        var previous = this._element
        this._element = element
        this.onElementChange(element, previous)
      }
    }
  },

  prototype: {
    onElementChange: function (element, previous) {},
    onLayoutChange: function (layout, previous) {},
    changeLayout: function( layout ){
      if (this.currentLayout == layout) {
        return Promise.resolve()
      }

      var layoutHandler = this.layouts[layout]
      if (!layoutHandler) return Promise.reject(new Error("Missing layout handler: " + layout))

      var view = this
      var previous = view.currentLayout
      return Promise.resolve(previous).then(function () {
        return layoutHandler.call(view, previous)
      }).then(function () {
        view.currentLayout = layout
        view.onLayoutChange(layout, previous)
      })
    },
    dispatch: function (type, detail, def) {
      var definition = defaults(def, {
        detail: detail || null,
        view: window,
        bubbles: true,
        cancelable: true
      })
      return this.element.dispatchEvent(new window.CustomEvent(type, definition))
    }
  }
})

},{"../attributes":14,"../dom/attributes":17,"../factory":26,"./CacheExtension":28,"./Event":30,"./InstanceExtension":31,"./PrototypeExtension":32,"matchbox-util/object/defaults":4,"matchbox-util/object/define":5}],36:[function(require,module,exports){
var ui = module.exports = {}

ui.Screen = require("./Screen")
ui.Region = require("./Region")
ui.Element = require("./Element")
ui.View = require("./View")

},{"./Element":29,"./Region":33,"./Screen":34,"./View":35}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9EZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL21hdGNoYm94LXV0aWwvb2JqZWN0L2NvcHkuanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmYXVsdHMuanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL21hdGNoYm94LXV0aWwvb2JqZWN0L2V4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9pbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9tZXJnZS5qcyIsInNyYy9hdHRyaWJ1dGVzL0F0dHJpYnV0ZS5qcyIsInNyYy9hdHRyaWJ1dGVzL0Jvb2xlYW4uanMiLCJzcmMvYXR0cmlidXRlcy9GbG9hdC5qcyIsInNyYy9hdHRyaWJ1dGVzL051bWJlci5qcyIsInNyYy9hdHRyaWJ1dGVzL1N0cmluZy5qcyIsInNyYy9hdHRyaWJ1dGVzL2luZGV4LmpzIiwic3JjL2RvbS9GcmFnbWVudC5qcyIsInNyYy9kb20vU2VsZWN0b3IuanMiLCJzcmMvZG9tL2F0dHJpYnV0ZXMuanMiLCJzcmMvZG9tL2RlbGVnYXRlLmpzIiwic3JjL2RvbS9pbmRleC5qcyIsInNyYy9mYWN0b3J5L0JsdWVwcmludC5qcyIsInNyYy9mYWN0b3J5L0V4dGVuc2lvbi5qcyIsInNyYy9mYWN0b3J5L0ZhY3RvcnkuanMiLCJzcmMvZmFjdG9yeS9hdWdtZW50LmpzIiwic3JjL2ZhY3RvcnkvZXh0ZW5kLmpzIiwic3JjL2ZhY3RvcnkvaW5jbHVkZS5qcyIsInNyYy9mYWN0b3J5L2luZGV4LmpzIiwic3JjL2ZhY3RvcnkvaW5oZXJpdC5qcyIsInNyYy91aS9DYWNoZUV4dGVuc2lvbi5qcyIsInNyYy91aS9FbGVtZW50LmpzIiwic3JjL3VpL0V2ZW50LmpzIiwic3JjL3VpL0luc3RhbmNlRXh0ZW5zaW9uLmpzIiwic3JjL3VpL1Byb3RvdHlwZUV4dGVuc2lvbi5qcyIsInNyYy91aS9SZWdpb24uanMiLCJzcmMvdWkvU2NyZWVuLmpzIiwic3JjL3VpL1ZpZXcuanMiLCJzcmMvdWkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtYXRjaGJveCA9IG1vZHVsZS5leHBvcnRzID0ge31cblxubWF0Y2hib3guZmFjdG9yeSA9IHJlcXVpcmUoXCIuL3NyYy9mYWN0b3J5XCIpXG5tYXRjaGJveC51aSA9IHJlcXVpcmUoXCIuL3NyYy91aVwiKVxubWF0Y2hib3guZG9tID0gcmVxdWlyZShcIi4vc3JjL2RvbVwiKVxubWF0Y2hib3guYXR0cmlidXRlcyA9IHJlcXVpcmUoXCIuL3NyYy9hdHRyaWJ1dGVzXCIpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IERlc2NyaXB0b3JcblxudmFyIF93cml0YWJsZSA9IFwiX3dyaXRhYmxlXCJcbnZhciBfZW51bWVyYWJsZSA9IFwiX2VudW1lcmFibGVcIlxudmFyIF9jb25maWd1cmFibGUgPSBcIl9jb25maWd1cmFibGVcIlxuXG5mdW5jdGlvbiBEZXNjcmlwdG9yKCB3cml0YWJsZSwgZW51bWVyYWJsZSwgY29uZmlndXJhYmxlICl7XG4gIHRoaXMudmFsdWUodGhpcywgX3dyaXRhYmxlLCB3cml0YWJsZSB8fCBmYWxzZSlcbiAgdGhpcy52YWx1ZSh0aGlzLCBfZW51bWVyYWJsZSwgZW51bWVyYWJsZSB8fCBmYWxzZSlcbiAgdGhpcy52YWx1ZSh0aGlzLCBfY29uZmlndXJhYmxlLCBjb25maWd1cmFibGUgfHwgZmFsc2UpXG5cbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJ3XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMud3JpdGFibGUgfSlcbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJ3cml0YWJsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEZXNjcmlwdG9yKHRydWUsIGVudW1lcmFibGUsIGNvbmZpZ3VyYWJsZSlcbiAgfSlcblxuICB0aGlzLmdldHRlcih0aGlzLCBcImVcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5lbnVtZXJhYmxlIH0pXG4gIHRoaXMuZ2V0dGVyKHRoaXMsIFwiZW51bWVyYWJsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEZXNjcmlwdG9yKHdyaXRhYmxlLCB0cnVlLCBjb25maWd1cmFibGUpXG4gIH0pXG5cbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJjXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhYmxlIH0pXG4gIHRoaXMuZ2V0dGVyKHRoaXMsIFwiY29uZmlndXJhYmxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERlc2NyaXB0b3Iod3JpdGFibGUsIGVudW1lcmFibGUsIHRydWUpXG4gIH0pXG59XG5cbkRlc2NyaXB0b3IucHJvdG90eXBlID0ge1xuICBhY2Nlc3NvcjogZnVuY3Rpb24oIG9iaiwgbmFtZSwgZ2V0dGVyLCBzZXR0ZXIgKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgc2V0OiBzZXR0ZXJcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIGdldHRlcjogZnVuY3Rpb24oIG9iaiwgbmFtZSwgZm4gKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIGdldDogZm5cbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIHNldHRlcjogZnVuY3Rpb24oIG9iaiwgbmFtZSwgZm4gKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIHNldDogZm5cbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIHZhbHVlOiBmdW5jdGlvbiggb2JqLCBuYW1lLCB2YWx1ZSApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIHdyaXRhYmxlOiB0aGlzW193cml0YWJsZV0sXG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgbWV0aG9kOiBmdW5jdGlvbiggb2JqLCBuYW1lLCBmbiApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIHdyaXRhYmxlOiB0aGlzW193cml0YWJsZV0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIHZhbHVlOiBmblxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgcHJvcGVydHk6IGZ1bmN0aW9uKCBvYmosIG5hbWUsIHZhbHVlICl7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgd3JpdGFibGU6IHRoaXNbX3dyaXRhYmxlXSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuICBjb25zdGFudDogZnVuY3Rpb24oIG9iaiwgbmFtZSwgdmFsdWUgKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwiLi9leHRlbmRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBleHRlbmQoe30sIG9iailcbn1cbiIsInZhciBjb3B5ID0gcmVxdWlyZShcIi4vY29weVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRzIChvcHRpb25zLCBkZWZhdWx0cykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gY29weShkZWZhdWx0cylcbiAgfVxuXG4gIHZhciBvYmogPSBjb3B5KG9wdGlvbnMpXG5cbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgb2JqW3Byb3BdID0gZGVmYXVsdHNbcHJvcF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqXG59XG4iLCJ2YXIgRGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuL0Rlc2NyaXB0b3JcIilcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGVzY3JpcHRvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCggb2JqLCBleHRlbnNpb24gKXtcbiAgZm9yKCB2YXIgbmFtZSBpbiBleHRlbnNpb24gKXtcbiAgICBpZiggZXh0ZW5zaW9uLmhhc093blByb3BlcnR5KG5hbWUpICkgb2JqW25hbWVdID0gZXh0ZW5zaW9uW25hbWVdXG4gIH1cbiAgcmV0dXJuIG9ialxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb2JqLCBjYWxsYmFjayApe1xuICBmb3IoIHZhciBwcm9wIGluIG9iaiApe1xuICAgIGlmKCBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgKXtcbiAgICAgIGNhbGxiYWNrKHByb3AsIG9ialtwcm9wXSwgb2JqKVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqXG59XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG9iaiwgZXh0ZW5zaW9uICl7XG4gIHJldHVybiBleHRlbmQoZXh0ZW5kKHt9LCBvYmopLCBleHRlbnNpb24pXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEF0dHJpYnV0ZVxuXG5mdW5jdGlvbiBBdHRyaWJ1dGUgKGRlZikge1xuICBpZiAodHlwZW9mIGRlZiA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZGVmID0ge31cbiAgfVxuICB0aGlzLnR5cGUgPSBkZWYudHlwZSB8fCBcIlwiXG4gIHRoaXMubmFtZSA9IGRlZi5uYW1lIHx8IFwiXCJcbiAgdGhpcy5vbmNoYW5nZSA9IGRlZi5vbmNoYW5nZSB8fCBudWxsXG4gIHRoaXMuZGVmYXVsdCA9IG51bGxcbiAgdGhpcy5oYXNEZWZhdWx0ID0gZmFsc2VcblxuICBpZiAoQXR0cmlidXRlLmlzUHJpbWl0aXZlKGRlZikpIHtcbiAgICB0aGlzLmRlZmF1bHQgPSBkZWZcbiAgICB0aGlzLmhhc0RlZmF1bHQgPSB0cnVlXG4gIH1cbiAgZWxzZSBpZiAoZGVmKSB7XG4gICAgdGhpcy5kZWZhdWx0ID0gZGVmLmRlZmF1bHRcbiAgICB0aGlzLmhhc0RlZmF1bHQgPSB0eXBlb2YgdGhpcy5kZWZhdWx0ICE9IFwidW5kZWZpbmVkXCJcbiAgfVxufVxuXG5BdHRyaWJ1dGUuZ2V0VHlwZSA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgaWYgKHR5cGVvZiBkZWYgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiBcInN0cmluZ1wiXG4gIH1cbiAgaWYgKEF0dHJpYnV0ZS5pc1ByaW1pdGl2ZShkZWYpKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgZGVmKSB7XG4gICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgIC8vIG5vdGU6IGl0IGZhaWxzIGZvciAxLjBcbiAgICAgICAgaWYgKGRlZiA9PT0gK2RlZiAmJiBkZWYgIT09IChkZWYgfCAwKSkge1xuICAgICAgICAgIHJldHVybiBcImZsb2F0XCJcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIGRlZlxuICB9XG4gIGVsc2Uge1xuICAgIHJldHVybiB0eXBlb2YgZGVmLnR5cGVcbiAgfVxufVxuXG5BdHRyaWJ1dGUuaXNQcmltaXRpdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgc3dpdGNoKCB0eXBlb2YgdmFsdWUgKSB7XG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQXR0cmlidXRlLnByb3RvdHlwZS5wYXJzZVZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZVxufVxuQXR0cmlidXRlLnByb3RvdHlwZS5zdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gXCJcIiArIHZhbHVlXG59XG5BdHRyaWJ1dGUucHJvdG90eXBlLnNob3VsZFJlbW92ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApe1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbFxufVxuXG5BdHRyaWJ1dGUucHJvdG90eXBlLmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iaiwgbmFtZSwgZ2V0Q29udGV4dCkge1xuICB2YXIgYXR0cmlidXRlID0gdGhpc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHR5cGVvZiBnZXRDb250ZXh0ID09IFwiZnVuY3Rpb25cIiA/IGdldENvbnRleHQodGhpcykgOiBnZXRDb250ZXh0XG4gICAgICBhdHRyaWJ1dGUuZ2V0KGNvbnRleHQpXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0eXBlb2YgZ2V0Q29udGV4dCA9PSBcImZ1bmN0aW9uXCIgPyBnZXRDb250ZXh0KHRoaXMpIDogZ2V0Q29udGV4dFxuICAgICAgYXR0cmlidXRlLnNldChjb250ZXh0LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG59XG5BdHRyaWJ1dGUucHJvdG90eXBlLmdldEZyb21Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5hbWUpIHt9XG5BdHRyaWJ1dGUucHJvdG90eXBlLnNldE9uQ29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCBuYW1lLCB2YWx1ZSkge31cbkF0dHJpYnV0ZS5wcm90b3R5cGUuaGFzT25Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5hbWUpIHt9XG5BdHRyaWJ1dGUucHJvdG90eXBlLnJlbW92ZUZyb21Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5hbWUpIHt9XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oIGNvbnRleHQsIHVzZURlZmF1bHQgKXtcbiAgdmFyIHZhbHVlID0gdGhpcy5nZXRGcm9tQ29udGV4dChjb250ZXh0LCB0aGlzLm5hbWUpXG4gIGlmKCB2YWx1ZSA9PSBudWxsICYmIHVzZURlZmF1bHQgPT0gdHJ1ZSApe1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRcbiAgfVxuXG4gIHJldHVybiB0aGlzLnBhcnNlVmFsdWUodmFsdWUpXG59XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oIGNvbnRleHQsIHZhbHVlLCBjYWxsT25jaGFuZ2UgKXtcbiAgdmFyIHByZXZpb3VzVmFsdWUgPSB0aGlzLmdldChjb250ZXh0LCBmYWxzZSlcbiAgaWYoIHByZXZpb3VzVmFsdWUgPT09IHZhbHVlICl7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiggdGhpcy5zaG91bGRSZW1vdmUodmFsdWUpICl7XG4gICAgdGhpcy5yZW1vdmVGcm9tQ29udGV4dChjb250ZXh0LCB0aGlzLm5hbWUpXG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5zdHJpbmdpZnlWYWx1ZSh2YWx1ZSlcbiAgICB0aGlzLnNldE9uQ29udGV4dChjb250ZXh0LCB0aGlzLm5hbWUsIG5ld1ZhbHVlKVxuICB9XG5cbiAgdGhpcy5vbmNoYW5nZSAmJiBjYWxsT25jaGFuZ2UgIT0gZmFsc2UgJiYgdGhpcy5vbmNoYW5nZS5jYWxsKGNvbnRleHQsIHByZXZpb3VzVmFsdWUsIHZhbHVlKVxufVxuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4vQXR0cmlidXRlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gQm9vbGVhblxuXG5mdW5jdGlvbiBCb29sZWFuIChkZWYpIHtcbiAgQXR0cmlidXRlLmNhbGwodGhpcywgZGVmKVxuICB0aGlzLnR5cGUgPSBcImJvb2xlYW5cIlxufVxuXG5pbmhlcml0KEJvb2xlYW4sIEF0dHJpYnV0ZSlcblxuQm9vbGVhbi5wcm90b3R5cGUuc3RyaW5naWZ5VmFsdWUgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gXCJcIlxufVxuQm9vbGVhbi5wcm90b3R5cGUuc2hvdWxkUmVtb3ZlID0gZnVuY3Rpb24oIHZhbHVlICl7XG4gIHJldHVybiB2YWx1ZSA9PSBmYWxzZVxufVxuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4vQXR0cmlidXRlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gRmxvYXRcblxuZnVuY3Rpb24gRmxvYXQgKGRlZikge1xuICBBdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG4gIHRoaXMudHlwZSA9IFwiZmxvYXRcIlxufVxuXG5pbmhlcml0KEZsb2F0LCBBdHRyaWJ1dGUpXG5cbkZsb2F0LnByb3RvdHlwZS5zdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyBudWxsIDogcGFyc2VJbnQodmFsdWUsIDEwKVxufVxuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4vQXR0cmlidXRlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gTnVtYmVyXG5cbmZ1bmN0aW9uIE51bWJlciAoZGVmKSB7XG4gIEF0dHJpYnV0ZS5jYWxsKHRoaXMsIGRlZilcbiAgdGhpcy50eXBlID0gXCJudW1iZXJcIlxufVxuXG5pbmhlcml0KE51bWJlciwgQXR0cmlidXRlKVxuXG5OdW1iZXIucHJvdG90eXBlLnN0cmluZ2lmeVZhbHVlID0gZnVuY3Rpb24odmFsdWUpe1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKVxufVxuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4vQXR0cmlidXRlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gU3RyaW5nXG5cbmZ1bmN0aW9uIFN0cmluZyAoZGVmKSB7XG4gIEF0dHJpYnV0ZS5jYWxsKHRoaXMsIGRlZilcbiAgdGhpcy50eXBlID0gXCJzdHJpbmdcIlxufVxuXG5pbmhlcml0KFN0cmluZywgQXR0cmlidXRlKVxuXG5TdHJpbmcucHJvdG90eXBlLnN0cmluZ2lmeVZhbHVlID0gZnVuY3Rpb24odmFsdWUpe1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB2YWx1ZSA/IFwiXCIgKyB2YWx1ZSA6IFwiXCJcbn1cbiIsInZhciBBdHRyaWJ1dGUgPSByZXF1aXJlKFwiLi9BdHRyaWJ1dGVcIilcbnZhciBTdHJpbmcgPSByZXF1aXJlKFwiLi9TdHJpbmdcIilcbnZhciBCb29sZWFuID0gcmVxdWlyZShcIi4vQm9vbGVhblwiKVxudmFyIE51bWJlciA9IHJlcXVpcmUoXCIuL051bWJlclwiKVxudmFyIEZsb2F0ID0gcmVxdWlyZShcIi4vRmxvYXRcIilcblxudmFyIGF0dHJpYnV0ZXMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9XG5cbmF0dHJpYnV0ZXMuY3JlYXRlID0gZnVuY3Rpb24gKGRlZikge1xuICBzd2l0Y2ggKEF0dHJpYnV0ZS5nZXRUeXBlKGRlZikpIHtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gbmV3IFN0cmluZyhkZWYpXG4gICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgIHJldHVybiBuZXcgQm9vbGVhbihkZWYpXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcmV0dXJuIG5ldyBOdW1iZXIoZGVmKVxuICAgIGNhc2UgXCJmbG9hdFwiOlxuICAgICAgcmV0dXJuIG5ldyBGbG9hdChkZWYpXG4gIH1cbn1cblxuYXR0cmlidXRlcy5BdHRyaWJ1dGUgPSBBdHRyaWJ1dGVcbmF0dHJpYnV0ZXMuU3RyaW5nID0gU3RyaW5nXG5hdHRyaWJ1dGVzLkJvb2xlYW4gPSBCb29sZWFuXG5hdHRyaWJ1dGVzLk51bWJlciA9IE51bWJlclxuYXR0cmlidXRlcy5GbG9hdCA9IEZsb2F0XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEZyYWdtZW50XG5cbmZ1bmN0aW9uIEZyYWdtZW50IChmcmFnbWVudCkge1xuICBmcmFnbWVudCA9IGZyYWdtZW50IHx8IHt9XG4gIHRoaXMuaHRtbCA9IGZyYWdtZW50Lmh0bWwgfHwgXCJcIlxuICB0aGlzLmZpcnN0ID0gZnJhZ21lbnQuZmlyc3QgPT0gdW5kZWZpbmVkIHx8ICEhZnJhZ21lbnQuZmlyc3RcbiAgdGhpcy50aW1lb3V0ID0gZnJhZ21lbnQudGltZW91dCB8fCAyMDAwXG59XG5cbkZyYWdtZW50LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaHRtbCkge1xuICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgdGVtcC5pbm5lckhUTUwgPSBodG1sIHx8IHRoaXMuaHRtbFxuXG4gIGlmICh0aGlzLmZpcnN0ID09PSB1bmRlZmluZWQgfHwgdGhpcy5maXJzdCkge1xuICAgIHJldHVybiB0ZW1wLmNoaWxkcmVuWzBdXG4gIH1cblxuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgd2hpbGUgKHRlbXAuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCh0ZW1wLmZpcnN0Q2hpbGQpXG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbkZyYWdtZW50LnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKGh0bWwsIG9wdGlvbnMsIGNiKSB7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGNiKG51bGwsIGh0bWwpXG4gIH0sIDQpXG59XG5cbkZyYWdtZW50LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuICB2YXIgZnJhZ21lbnQgPSB0aGlzXG4gIGNvbnRleHQgPSBjb250ZXh0IHx8IHt9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzb2x2ZWQgPSBmYWxzZVxuICAgIHZhciBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlJlbmRlciB0aW1lZCBvdXRcIikpXG4gICAgfSwgZnJhZ21lbnQudGltZW91dClcblxuICAgIHRyeSB7XG4gICAgICBmcmFnbWVudC5jb21waWxlKGNvbnRleHQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIHJlbmRlcmVkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZClcbiAgICAgICAgaWYgKHJlc29sdmVkKSByZXR1cm5cblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGZyYWdtZW50LmNyZWF0ZShyZW5kZXJlZCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSlcbiAgICB9XG4gIH0pXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFNlbGVjdG9yXG5cblNlbGVjdG9yLkRFRkFVTFRfTkVTVF9TRVBBUkFUT1IgPSBcIjpcIlxuXG5mdW5jdGlvbiBTZWxlY3RvciAoc2VsZWN0b3IpIHtcbiAgc2VsZWN0b3IgPSBzZWxlY3RvciB8fCB7fVxuICB0aGlzLmF0dHJpYnV0ZSA9IHNlbGVjdG9yLmF0dHJpYnV0ZVxuICB0aGlzLnZhbHVlID0gc2VsZWN0b3IudmFsdWUgfHwgbnVsbFxuICB0aGlzLm9wZXJhdG9yID0gc2VsZWN0b3Iub3BlcmF0b3IgfHwgXCI9XCJcbiAgdGhpcy5leHRyYSA9IHNlbGVjdG9yLmV4dHJhIHx8IG51bGxcblxuICB0aGlzLmVsZW1lbnQgPSBzZWxlY3Rvci5lbGVtZW50IHx8IG51bGxcblxuICB0aGlzLkNvbnN0cnVjdG9yID0gc2VsZWN0b3IuQ29uc3RydWN0b3IgfHwgbnVsbFxuICB0aGlzLmluc3RhbnRpYXRlID0gc2VsZWN0b3IuaW5zdGFudGlhdGUgfHwgbnVsbFxuICB0aGlzLm11bHRpcGxlID0gc2VsZWN0b3IubXVsdGlwbGUgIT0gbnVsbCA/ICEhc2VsZWN0b3IubXVsdGlwbGUgOiBmYWxzZVxuXG4gIHRoaXMubWF0Y2hlciA9IHNlbGVjdG9yLm1hdGNoZXIgfHwgbnVsbFxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0b3IodGhpcylcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLmNvbWJpbmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgdmFyIHMgPSB0aGlzLmNsb25lKClcbiAgcy5leHRyYSArPSBzZWxlY3Rvci50b1N0cmluZygpXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcyA9IHRoaXMuY2xvbmUoKVxuICBzLm9wZXJhdG9yID0gXCI9XCJcbiAgcy52YWx1ZSA9IHZhbHVlXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcyA9IHRoaXMuY2xvbmUoKVxuICBzLm9wZXJhdG9yID0gXCJ+XCJcbiAgcy52YWx1ZSA9IHZhbHVlXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5wcmVmaXggPSBmdW5jdGlvbiAocHJlLCBzZXBhcmF0b3IpIHtcbiAgdmFyIHMgPSB0aGlzLmNsb25lKClcbiAgdmFyIHNlcCA9IHMudmFsdWUgPyBzZXBhcmF0b3IgfHwgU2VsZWN0b3IuREVGQVVMVF9ORVNUX1NFUEFSQVRPUiA6IFwiXCJcbiAgcy52YWx1ZSA9IHByZSArIHNlcCArIHMudmFsdWVcbiAgcmV0dXJuIHNcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLm5lc3QgPSBmdW5jdGlvbiAocG9zdCwgc2VwYXJhdG9yKSB7XG4gIHZhciBzID0gdGhpcy5jbG9uZSgpXG4gIHZhciBzZXAgPSBzLnZhbHVlID8gc2VwYXJhdG9yIHx8IFNlbGVjdG9yLkRFRkFVTFRfTkVTVF9TRVBBUkFUT1IgOiBcIlwiXG4gIHMudmFsdWUgKz0gc2VwICsgcG9zdFxuICByZXR1cm4gc1xufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuZnJvbSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBzID0gdGhpcy5jbG9uZSgpXG4gIHMuZWxlbWVudCA9IGVsZW1lbnRcbiAgcmV0dXJuIHNcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0cmFuc2Zvcm0pIHtcbiAgdmFyIHJlc3VsdCA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnRvU3RyaW5nKCkpXG4gIHJldHVybiB0cmFuc2Zvcm0gPyB0cmFuc2Zvcm0ocmVzdWx0KSA6IHJlc3VsdFxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuc2VsZWN0QWxsID0gZnVuY3Rpb24gKGVsZW1lbnQsIHRyYW5zZm9ybSkge1xuICB2YXIgcmVzdWx0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMudG9TdHJpbmcoKSlcbiAgcmV0dXJuIHRyYW5zZm9ybSA/IHRyYW5zZm9ybShyZXN1bHQpIDogcmVzdWx0XG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24gKHRyYW5zZm9ybSkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5lbGVtZW50LCB0cmFuc2Zvcm0pXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5ub2RlTGlzdCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsKHRoaXMuZWxlbWVudCwgdHJhbnNmb3JtKVxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuY29uc3RydWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yXG4gIHZhciBpbnN0YW50aWF0ZSA9IHRoaXMuaW5zdGFudGlhdGUgfHwgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGVsZW1lbnQpXG4gIH1cbiAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlTGlzdChmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgIHJldHVybiBbXS5tYXAuY2FsbChlbGVtZW50cywgaW5zdGFudGlhdGUpXG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlKGluc3RhbnRpYXRlKVxuICB9XG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZSAhPSBudWxsXG4gICAgICA/ICdcIicgKyAodGhpcy52YWx1ZSA9PSB0cnVlID8gXCJcIiA6IHRoaXMudmFsdWUpICsgJ1wiJ1xuICAgICAgOiBcIlwiXG4gIHZhciBvcGVyYXRvciA9IHZhbHVlID8gdGhpcy5vcGVyYXRvciB8fCBcIj1cIiA6IFwiXCJcbiAgdmFyIGV4dHJhID0gdGhpcy5leHRyYSB8fCBcIlwiXG4gIHJldHVybiBcIltcIiArIHRoaXMuYXR0cmlidXRlICsgb3BlcmF0b3IgKyB2YWx1ZSArIFwiXVwiICsgZXh0cmFcbn1cbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIGluY2x1ZGUgPSByZXF1aXJlKFwiLi4vZmFjdG9yeS9pbmNsdWRlXCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4uL2F0dHJpYnV0ZXMvQXR0cmlidXRlXCIpXG52YXIgU3RyaW5nID0gcmVxdWlyZShcIi4uL2F0dHJpYnV0ZXMvU3RyaW5nXCIpXG52YXIgQm9vbGVhbiA9IHJlcXVpcmUoXCIuLi9hdHRyaWJ1dGVzL0Jvb2xlYW5cIilcbnZhciBOdW1iZXIgPSByZXF1aXJlKFwiLi4vYXR0cmlidXRlcy9OdW1iZXJcIilcbnZhciBGbG9hdCA9IHJlcXVpcmUoXCIuLi9hdHRyaWJ1dGVzL0Zsb2F0XCIpXG5cbnZhciBkb21BdHRyaWJ1dGVzID0gbW9kdWxlLmV4cG9ydHMgPSB7fVxuXG5kb21BdHRyaWJ1dGVzLmNyZWF0ZSA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgc3dpdGNoIChBdHRyaWJ1dGUuZ2V0VHlwZShkZWYpKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIG5ldyBEb21TdHJpbmcoZGVmKVxuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICByZXR1cm4gbmV3IERvbUJvb2xlYW4oZGVmKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBuZXcgRG9tTnVtYmVyKGRlZilcbiAgICBjYXNlIFwiZmxvYXRcIjpcbiAgICAgIHJldHVybiBuZXcgRG9tRmxvYXQoZGVmKVxuICB9XG59XG5cbmZ1bmN0aW9uIERvbUF0dHJpYnV0ZSAoZGVmKSB7XG4gIGRlZiA9IGRlZiB8fCB7fVxuICB0aGlzLnByZWZpeCA9IGRlZi5wcmVmaXggPT0gbnVsbCA/IFwiZGF0YS1cIiA6IGRlZi5wcmVmaXhcbn1cblxuRG9tQXR0cmlidXRlLnByb3RvdHlwZS5nZXRGcm9tQ29udGV4dCA9IGZ1bmN0aW9uKCBlbGVtZW50LCBuYW1lICl7XG4gIG5hbWUgPSB0aGlzLnByZWZpeCA/IHRoaXMucHJlZml4ICsgbmFtZSA6IG5hbWVcbiAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpXG59XG5Eb21BdHRyaWJ1dGUucHJvdG90eXBlLnNldE9uQ29udGV4dCA9IGZ1bmN0aW9uKCBlbGVtZW50LCBuYW1lLCB2YWx1ZSApe1xuICBuYW1lID0gdGhpcy5wcmVmaXggPyB0aGlzLnByZWZpeCArIG5hbWUgOiBuYW1lXG4gIHJldHVybiBlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSlcbn1cbkRvbUF0dHJpYnV0ZS5wcm90b3R5cGUuaGFzT25Db250ZXh0ID0gZnVuY3Rpb24oIGVsZW1lbnQsIG5hbWUgKXtcbiAgbmFtZSA9IHRoaXMucHJlZml4ID8gdGhpcy5wcmVmaXggKyBuYW1lIDogbmFtZVxuICByZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUobmFtZSlcbn1cbkRvbUF0dHJpYnV0ZS5wcm90b3R5cGUucmVtb3ZlRnJvbUNvbnRleHQgPSBmdW5jdGlvbiggZWxlbWVudCwgbmFtZSApe1xuICBuYW1lID0gdGhpcy5wcmVmaXggPyB0aGlzLnByZWZpeCArIG5hbWUgOiBuYW1lXG4gIHJldHVybiBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxufVxuXG5mdW5jdGlvbiBEb21TdHJpbmcgKGRlZikge1xuICBTdHJpbmcuY2FsbCh0aGlzLCBkZWYpXG4gIERvbUF0dHJpYnV0ZS5jYWxsKHRoaXMsIGRlZilcbn1cbmRvbUF0dHJpYnV0ZXMuU3RyaW5nID0gRG9tU3RyaW5nXG5pbmhlcml0KERvbVN0cmluZywgU3RyaW5nKVxuaW5jbHVkZShEb21TdHJpbmcsIERvbUF0dHJpYnV0ZSlcblxuZnVuY3Rpb24gRG9tQm9vbGVhbiAoZGVmKSB7XG4gIEJvb2xlYW4uY2FsbCh0aGlzLCBkZWYpXG4gIERvbUF0dHJpYnV0ZS5jYWxsKHRoaXMsIGRlZilcbn1cbmRvbUF0dHJpYnV0ZXMuQm9vbGVhbiA9IERvbUJvb2xlYW5cbmluaGVyaXQoRG9tQm9vbGVhbiwgQm9vbGVhbilcbmluY2x1ZGUoRG9tQm9vbGVhbiwgRG9tQXR0cmlidXRlKVxuXG5mdW5jdGlvbiBEb21OdW1iZXIgKGRlZikge1xuICBOdW1iZXIuY2FsbCh0aGlzLCBkZWYpXG4gIERvbUF0dHJpYnV0ZS5jYWxsKHRoaXMsIGRlZilcbn1cbmRvbUF0dHJpYnV0ZXMuTnVtYmVyID0gRG9tTnVtYmVyXG5pbmhlcml0KERvbU51bWJlciwgTnVtYmVyKVxuaW5jbHVkZShEb21OdW1iZXIsIERvbUF0dHJpYnV0ZSlcblxuZnVuY3Rpb24gRG9tRmxvYXQgKGRlZikge1xuICBGbG9hdC5jYWxsKHRoaXMsIGRlZilcbiAgRG9tQXR0cmlidXRlLmNhbGwodGhpcywgZGVmKVxufVxuZG9tQXR0cmlidXRlcy5GbG9hdCA9IERvbUZsb2F0XG5pbmhlcml0KERvbUZsb2F0LCBGbG9hdClcbmluY2x1ZGUoRG9tRmxvYXQsIERvbUF0dHJpYnV0ZSlcbiIsInZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuL1NlbGVjdG9yXCIpXG5cbi8qKlxuICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIG9uIGFuIGVsZW1lbnRcbiAqIGFuZCByZXR1cm5zIGEgZGVsZWdhdG9yLlxuICogQSBkZWxlZ2F0ZWQgZXZlbnQgcnVucyBtYXRjaGVzIHRvIGZpbmQgYW4gZXZlbnQgdGFyZ2V0LFxuICogdGhlbiBleGVjdXRlcyB0aGUgaGFuZGxlciBwYWlyZWQgd2l0aCB0aGUgbWF0Y2hlci5cbiAqIE1hdGNoZXJzIGNhbiBjaGVjayBpZiBhbiBldmVudCB0YXJnZXQgbWF0Y2hlcyBhIGdpdmVuIHNlbGVjdG9yLFxuICogb3Igc2VlIGlmIGFuIG9mIGl0cyBwYXJlbnRzIGRvLlxuICogKi9cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGVcblxuZnVuY3Rpb24gZGVsZWdhdGUoIG9wdGlvbnMgKXtcbiAgdmFyIGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnRcbiAgICAsIGV2ZW50ID0gb3B0aW9ucy5ldmVudFxuICAgICwgY2FwdHVyZSA9ICEhb3B0aW9ucy5jYXB0dXJlIHx8IGZhbHNlXG4gICAgLCBjb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IGVsZW1lbnRcbiAgICAsIHRyYW5zZm9ybSA9IG9wdGlvbnMudHJhbnNmb3JtIHx8IG51bGxcblxuICBpZiggIWVsZW1lbnQgKXtcbiAgICBjb25zb2xlLmxvZyhcIkNhbid0IGRlbGVnYXRlIHVuZGVmaW5lZCBlbGVtZW50XCIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBpZiggIWV2ZW50ICl7XG4gICAgY29uc29sZS5sb2coXCJDYW4ndCBkZWxlZ2F0ZSB1bmRlZmluZWQgZXZlbnRcIilcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgdmFyIGRlbGVnYXRvciA9IGNyZWF0ZURlbGVnYXRvcihjb250ZXh0LCB0cmFuc2Zvcm0pXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZGVsZWdhdG9yLCBjYXB0dXJlKVxuXG4gIHJldHVybiBkZWxlZ2F0b3Jcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZGVsZWdhdG9yIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gZXZlbnQgbGlzdGVuZXIuXG4gKiBUaGUgZGVsZWdhdG9yIGhhcyBzdGF0aWMgbWV0aG9kcyB3aGljaCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBoYW5kbGVycy5cbiAqICovXG5mdW5jdGlvbiBjcmVhdGVEZWxlZ2F0b3IoIGNvbnRleHQsIHRyYW5zZm9ybSApe1xuICB2YXIgbWF0Y2hlcnMgPSBbXVxuXG4gIGZ1bmN0aW9uIGRlbGVnYXRvciggZSApe1xuICAgIHZhciBsID0gbWF0Y2hlcnMubGVuZ3RoXG4gICAgaWYoICFsICl7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHZhciBlbCA9IHRoaXNcbiAgICAgICAgLCBpID0gLTFcbiAgICAgICAgLCBoYW5kbGVyXG4gICAgICAgICwgc2VsZWN0b3JcbiAgICAgICAgLCBkZWxlZ2F0ZUVsZW1lbnRcbiAgICAgICAgLCBzdG9wUHJvcGFnYXRpb25cbiAgICAgICAgLCBhcmdzXG5cbiAgICB3aGlsZSggKytpIDwgbCApe1xuICAgICAgYXJncyA9IG1hdGNoZXJzW2ldXG4gICAgICBoYW5kbGVyID0gYXJnc1swXVxuICAgICAgc2VsZWN0b3IgPSBhcmdzWzFdXG5cbiAgICAgIGRlbGVnYXRlRWxlbWVudCA9IG1hdGNoQ2FwdHVyZVBhdGgoc2VsZWN0b3IsIGVsLCBlLCB0cmFuc2Zvcm0sIGNvbnRleHQpXG4gICAgICBpZiggZGVsZWdhdGVFbGVtZW50ICYmIGRlbGVnYXRlRWxlbWVudC5sZW5ndGggKSB7XG4gICAgICAgIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlID09PSBoYW5kbGVyLmFwcGx5KGNvbnRleHQsIFtlXS5jb25jYXQoZGVsZWdhdGVFbGVtZW50KSlcbiAgICAgICAgaWYoIHN0b3BQcm9wYWdhdGlvbiApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgaGFuZGxlciB3aXRoIGEgdGFyZ2V0IGZpbmRlciBsb2dpY1xuICAgKiAqL1xuICBkZWxlZ2F0b3IubWF0Y2ggPSBmdW5jdGlvbiggc2VsZWN0b3IsIGhhbmRsZXIgKXtcbiAgICBtYXRjaGVycy5wdXNoKFtoYW5kbGVyLCBzZWxlY3Rvcl0pXG4gICAgcmV0dXJuIGRlbGVnYXRvclxuICB9XG5cbiAgcmV0dXJuIGRlbGVnYXRvclxufVxuXG5mdW5jdGlvbiBtYXRjaENhcHR1cmVQYXRoKCBzZWxlY3RvciwgZWwsIGUsIHRyYW5zZm9ybSwgY29udGV4dCApe1xuICB2YXIgZGVsZWdhdGVFbGVtZW50cyA9IFtdXG4gIHZhciBkZWxlZ2F0ZUVsZW1lbnQgPSBudWxsXG4gIGlmKCBBcnJheS5pc0FycmF5KHNlbGVjdG9yKSApe1xuICAgIHZhciBpID0gLTFcbiAgICB2YXIgbCA9IHNlbGVjdG9yLmxlbmd0aFxuICAgIHdoaWxlKCArK2kgPCBsICl7XG4gICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSBmaW5kUGFyZW50KHNlbGVjdG9yW2ldLCBlbCwgZSlcbiAgICAgIGlmKCAhZGVsZWdhdGVFbGVtZW50ICkgcmV0dXJuIG51bGxcbiAgICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSB0cmFuc2Zvcm0oY29udGV4dCwgc2VsZWN0b3IsIGRlbGVnYXRlRWxlbWVudClcbiAgICAgIH1cbiAgICAgIGRlbGVnYXRlRWxlbWVudHMucHVzaChkZWxlZ2F0ZUVsZW1lbnQpXG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGRlbGVnYXRlRWxlbWVudCA9IGZpbmRQYXJlbnQoc2VsZWN0b3IsIGVsLCBlKVxuICAgIGlmKCAhZGVsZWdhdGVFbGVtZW50ICkgcmV0dXJuIG51bGxcbiAgICBpZiAodHlwZW9mIHRyYW5zZm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGRlbGVnYXRlRWxlbWVudCA9IHRyYW5zZm9ybShjb250ZXh0LCBzZWxlY3RvciwgZGVsZWdhdGVFbGVtZW50KVxuICAgIH1cbiAgICBkZWxlZ2F0ZUVsZW1lbnRzLnB1c2goZGVsZWdhdGVFbGVtZW50KVxuICB9XG4gIHJldHVybiBkZWxlZ2F0ZUVsZW1lbnRzXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHRhcmdldCBvciBhbnkgb2YgaXRzIHBhcmVudCBtYXRjaGVzIGEgc2VsZWN0b3JcbiAqICovXG5mdW5jdGlvbiBmaW5kUGFyZW50KCBzZWxlY3RvciwgZWwsIGUgKXtcbiAgdmFyIHRhcmdldCA9IGUudGFyZ2V0XG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIFNlbGVjdG9yKSB7XG4gICAgc2VsZWN0b3IgPSBzZWxlY3Rvci50b1N0cmluZygpXG4gIH1cbiAgc3dpdGNoKCB0eXBlb2Ygc2VsZWN0b3IgKXtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICB3aGlsZSggdGFyZ2V0ICYmIHRhcmdldCAhPSBlbCApe1xuICAgICAgICBpZiggdGFyZ2V0Lm1hdGNoZXMgJiYgdGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpICkgcmV0dXJuIHRhcmdldFxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIHdoaWxlKCB0YXJnZXQgJiYgdGFyZ2V0ICE9IGVsICl7XG4gICAgICAgIGlmKCBzZWxlY3Rvci5jYWxsKGVsLCB0YXJnZXQpICkgcmV0dXJuIHRhcmdldFxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuIiwidmFyIGRvbSA9IG1vZHVsZS5leHBvcnRzID0ge31cblxuZG9tLmRlbGVnYXRlID0gcmVxdWlyZShcIi4vZGVsZWdhdGVcIilcbmRvbS5TZWxlY3RvciA9IHJlcXVpcmUoXCIuL1NlbGVjdG9yXCIpXG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvbWVyZ2VcIilcbnZhciBmb3JJbiA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9pblwiKVxudmFyIEV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0V4dGVuc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsdWVwcmludFxuXG5mdW5jdGlvbiBCbHVlcHJpbnQoIGJsb2NrcywgcGFyZW50ICl7XG4gIHZhciBibHVlcHJpbnQgPSB0aGlzXG5cbiAgdGhpcy5ibG9ja3MgPSBtZXJnZShibG9ja3MpXG4gIHRoaXMucGFyZW50ID0gcGFyZW50XG5cbiAgdGhpcy5sb2NhbEV4dGVuc2lvbnMgPSB0aGlzLmdldChcImV4dGVuc2lvbnNcIiwge30pXG5cbiAgZm9ySW4odGhpcy5sb2NhbEV4dGVuc2lvbnMsIGZ1bmN0aW9uKCBuYW1lLCBleHRlbnNpb24gKXtcbiAgICAvL2lmIChwYXJlbnQgJiYgISF+cGFyZW50LmV4dGVuc2lvbk5hbWVzLmluZGV4T2YobmFtZSkpIHtcbiAgICAvLyAgdGhyb3cgbmV3IEVycm9yKFwiRGVzY3JpcHRpb24gb3ZlcnJpZGUgaXMgbm90IHN1cHBvcnRlZFwiKVxuICAgIC8vfVxuXG4gICAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uIGluc3RhbmNlb2YgRXh0ZW5zaW9uXG4gICAgICAgID8gZXh0ZW5zaW9uXG4gICAgICAgIDogbmV3IEV4dGVuc2lvbihleHRlbnNpb24pXG4gICAgYmx1ZXByaW50LmxvY2FsRXh0ZW5zaW9uc1tuYW1lXSA9IGV4dGVuc2lvblxuICAgIGV4dGVuc2lvbi5uYW1lID0gbmFtZVxuICB9KVxuXG4gIHRoaXMuZ2xvYmFsRXh0ZW5zaW9ucyA9IHRoaXMubG9jYWxFeHRlbnNpb25zXG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHRoaXMuZ2xvYmFsRXh0ZW5zaW9ucyA9IG1lcmdlKHBhcmVudC5nbG9iYWxFeHRlbnNpb25zLCB0aGlzLmxvY2FsRXh0ZW5zaW9ucylcbiAgICBmb3JJbih0aGlzLmdsb2JhbEV4dGVuc2lvbnMsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24pIHtcbiAgICAgIGlmIChleHRlbnNpb24uaW5oZXJpdCkge1xuICAgICAgICBibHVlcHJpbnQuYmxvY2tzW25hbWVdID0gbWVyZ2UocGFyZW50LmdldChuYW1lKSwgYmx1ZXByaW50LmdldChuYW1lKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbkJsdWVwcmludC5wcm90b3R5cGUuYnVpbGRQcm90b3R5cGUgPSBmdW5jdGlvbiggcHJvdG90eXBlLCB0b3AgKXtcbiAgdGhpcy5idWlsZChcInByb3RvdHlwZVwiLCB0aGlzLmdsb2JhbEV4dGVuc2lvbnMsIHRvcCwgZnVuY3Rpb24gKG5hbWUsIGV4dGVuc2lvbiwgYmxvY2spIHtcbiAgICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4gICAgICBleHRlbnNpb24uaW5pdGlhbGl6ZShwcm90b3R5cGUsIG5hbWUsIHZhbHVlKVxuICAgIH0pXG4gIH0pXG59XG5cbkJsdWVwcmludC5wcm90b3R5cGUuYnVpbGRDYWNoZSA9IGZ1bmN0aW9uKCBwcm90b3R5cGUsIHRvcCApe1xuICB0aGlzLmJ1aWxkKFwiY2FjaGVcIiwgdGhpcy5nbG9iYWxFeHRlbnNpb25zLCB0b3AsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24sIGJsb2NrKSB7XG4gICAgaWYgKCFwcm90b3R5cGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIHByb3RvdHlwZVtuYW1lXSA9IHt9XG4gICAgfVxuXG4gICAgdmFyIGNhY2hlID0gcHJvdG90eXBlW25hbWVdXG4gICAgdmFyIGluaXRpYWxpemUgPSBleHRlbnNpb24uaW5pdGlhbGl6ZVxuXG4gICAgZm9ySW4oYmxvY2ssIGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApe1xuICAgICAgY2FjaGVbbmFtZV0gPSBpbml0aWFsaXplXG4gICAgICAgICAgPyBpbml0aWFsaXplKHByb3RvdHlwZSwgbmFtZSwgdmFsdWUpXG4gICAgICAgICAgOiB2YWx1ZVxuICAgIH0pXG4gIH0pXG59XG5cbkJsdWVwcmludC5wcm90b3R5cGUuYnVpbGRJbnN0YW5jZSA9IGZ1bmN0aW9uKCBpbnN0YW5jZSwgdG9wICl7XG4gIHRoaXMuYnVpbGQoXCJpbnN0YW5jZVwiLCB0aGlzLmxvY2FsRXh0ZW5zaW9ucywgdG9wLCBmdW5jdGlvbiAobmFtZSwgZXh0ZW5zaW9uLCBibG9jaykge1xuICAgIGZvckluKGJsb2NrLCBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKXtcbiAgICAgIGV4dGVuc2lvbi5pbml0aWFsaXplKGluc3RhbmNlLCBuYW1lLCB2YWx1ZSlcbiAgICB9KVxuICB9KVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oIHR5cGUsIGV4dGVuc2lvbnMsIHRvcCwgYnVpbGQgKXtcbiAgdmFyIGJsdWVwcmludCA9IHRvcCB8fCB0aGlzXG4gIC8vdmFyIGJhc2UgPSB0aGlzXG4gIGZvckluKGV4dGVuc2lvbnMsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24pIHtcbiAgICBpZiggZXh0ZW5zaW9uLnR5cGUgIT0gdHlwZSApIHJldHVyblxuICAgIC8vdmFyIGJsdWVwcmludCA9IGV4dGVuc2lvbi5pbmhlcml0ID8gdG9wIDogYmFzZVxuICAgIHZhciBibG9jayA9IGJsdWVwcmludC5nZXQobmFtZSlcbiAgICBpZiggIWJsb2NrICkgcmV0dXJuXG5cbiAgICBidWlsZChuYW1lLCBleHRlbnNpb24sIGJsb2NrKVxuICB9KVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uKCBuYW1lLCBmbiwgbG9vcCApe1xuICBpZiAodGhpcy5oYXMobmFtZSkpIHtcbiAgICB2YXIgYmxvY2sgPSB0aGlzLmdldChuYW1lKVxuICAgIGlmIChsb29wKSB7XG4gICAgICBmb3JJbihibG9jaywgZm4pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm4uY2FsbCh0aGlzLCBibG9jaylcbiAgICB9XG4gIH1cbn1cblxuQmx1ZXByaW50LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiggbmFtZSApe1xuICByZXR1cm4gdGhpcy5ibG9ja3MuaGFzT3duUHJvcGVydHkobmFtZSkgJiYgdGhpcy5ibG9ja3NbbmFtZV0gIT0gbnVsbFxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCBuYW1lLCBkZWZhdWx0VmFsdWUgKXtcbiAgaWYoIHRoaXMuaGFzKG5hbWUpICl7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tzW25hbWVdXG4gIH1cbiAgZWxzZSByZXR1cm4gZGVmYXVsdFZhbHVlXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEV4dGVuc2lvblxuXG5mdW5jdGlvbiBFeHRlbnNpb24oZXh0ZW5zaW9uKXtcbiAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uIHx8IHt9XG4gIHRoaXMubmFtZSA9IFwiXCJcbiAgdGhpcy50eXBlID0gZXh0ZW5zaW9uLnR5cGUgfHwgXCJpbnN0YW5jZVwiXG4gIHRoaXMuaW5oZXJpdCA9IGV4dGVuc2lvbi5pbmhlcml0IHx8IGZhbHNlXG4gIHRoaXMuaW5pdGlhbGl6ZSA9IGV4dGVuc2lvbi5pbml0aWFsaXplIHx8IG51bGxcbn1cblxuLy9FeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBjb250ZXh0LCBibG9jayApe31cbiIsInZhciBkZWZpbmUgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmaW5lXCIpXG52YXIgQmx1ZXByaW50ID0gcmVxdWlyZShcIi4vQmx1ZXByaW50XCIpXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kXCIpXG52YXIgYXVnbWVudCA9IHJlcXVpcmUoXCIuL2F1Z21lbnRcIilcbnZhciBpbmNsdWRlID0gcmVxdWlyZShcIi4vaW5jbHVkZVwiKVxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi9pbmhlcml0XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gRmFjdG9yeVxuXG5mdW5jdGlvbiBGYWN0b3J5KCBibHVlcHJpbnQsIHBhcmVudCApe1xuICB2YXIgZmFjdG9yeSA9IHRoaXNcblxuICBpZiggIShibHVlcHJpbnQgaW5zdGFuY2VvZiBCbHVlcHJpbnQpICkge1xuICAgIGJsdWVwcmludCA9IG5ldyBCbHVlcHJpbnQoYmx1ZXByaW50LCBwYXJlbnQgPyBwYXJlbnQuYmx1ZXByaW50IDogbnVsbClcbiAgfVxuXG4gIHRoaXMuYmx1ZXByaW50ID0gYmx1ZXByaW50XG4gIHRoaXMucGFyZW50ID0gcGFyZW50IHx8IG51bGxcbiAgdGhpcy5hbmNlc3RvcnMgPSBwYXJlbnQgPyBwYXJlbnQuYW5jZXN0b3JzLmNvbmNhdChbcGFyZW50XSkgOiBbXVxuICB0aGlzLnJvb3QgPSB0aGlzLmFuY2VzdG9yc1swXSB8fCBudWxsXG4gIHRoaXMuU3VwZXIgPSBibHVlcHJpbnQuZ2V0KFwiaW5oZXJpdFwiLCBudWxsKVxuICB0aGlzLkNvbnN0cnVjdG9yID0gYmx1ZXByaW50LmdldChcImNvbnN0cnVjdG9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5TdXBlcikge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5TdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfVxuICAgIHRoaXMuY29uc3RydWN0b3IuaW5pdGlhbGl6ZSh0aGlzKVxuICB9KVxuICB0aGlzLkNvbnN0cnVjdG9yLmV4dGVuZCA9IGZ1bmN0aW9uIChzdXBlckJsdWVwcmludCkge1xuICAgIHN1cGVyQmx1ZXByaW50ID0gc3VwZXJCbHVlcHJpbnQgfHwge31cbiAgICBzdXBlckJsdWVwcmludFtcImluaGVyaXRcIl0gPSBmYWN0b3J5LkNvbnN0cnVjdG9yXG4gICAgdmFyIHN1cGVyRmFjdG9yeSA9IG5ldyBGYWN0b3J5KHN1cGVyQmx1ZXByaW50LCBmYWN0b3J5KVxuICAgIHJldHVybiBzdXBlckZhY3RvcnkuYXNzZW1ibGUoKVxuICB9XG5cbiAgdGhpcy5pbmR1c3RyeS5wdXNoKHRoaXMpXG59XG5cbkZhY3RvcnkucHJvdG90eXBlLmFzc2VtYmxlID0gZnVuY3Rpb24oKXtcbiAgdmFyIGZhY3RvcnkgPSB0aGlzXG4gIHZhciBibHVlcHJpbnQgPSB0aGlzLmJsdWVwcmludFxuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yXG5cbiAgQ29uc3RydWN0b3IuU3VwZXIgPSB0aGlzLlN1cGVyXG4gIENvbnN0cnVjdG9yLmJsdWVwcmludCA9IGJsdWVwcmludFxuXG4gIHRoaXMuZGlnZXN0KClcblxuICBibHVlcHJpbnQuYnVpbGRQcm90b3R5cGUoQ29uc3RydWN0b3IucHJvdG90eXBlLCBibHVlcHJpbnQpXG4gIGJsdWVwcmludC5idWlsZENhY2hlKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgYmx1ZXByaW50KVxuXG4gIENvbnN0cnVjdG9yLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAvL3ZhciB0b3AgPSBmYWN0b3J5LmZpbmRGYWN0b3J5KGluc3RhbmNlLmNvbnN0cnVjdG9yKS5ibHVlcHJpbnRcbiAgICB2YXIgdG9wID0gaW5zdGFuY2UuY29uc3RydWN0b3IuYmx1ZXByaW50XG4gICAgYmx1ZXByaW50LmJ1aWxkSW5zdGFuY2UoaW5zdGFuY2UsIHRvcClcbiAgfVxuXG4gIHJldHVybiBDb25zdHJ1Y3RvclxufVxuXG5GYWN0b3J5LnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiggICl7XG4gIHZhciBmYWN0b3J5ID0gdGhpc1xuICB2YXIgYmx1ZXByaW50ID0gdGhpcy5ibHVlcHJpbnRcbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvclxuICB2YXIgcHJvdG8gPSBDb25zdHJ1Y3Rvci5wcm90b3R5cGVcblxuICBibHVlcHJpbnQuZGlnZXN0KFwiaW5oZXJpdFwiLCBmdW5jdGlvbiAoU3VwZXIpIHtcbiAgICBpbmhlcml0KENvbnN0cnVjdG9yLCBTdXBlcilcbiAgfSlcbiAgYmx1ZXByaW50LmRpZ2VzdChcImluY2x1ZGVcIiwgZnVuY3Rpb24gKGluY2x1ZGVzKSB7XG4gICAgaW5jbHVkZShDb25zdHJ1Y3RvciwgaW5jbHVkZXMpXG4gIH0pXG4gIGJsdWVwcmludC5kaWdlc3QoXCJhdWdtZW50XCIsIGZ1bmN0aW9uIChhdWdtZW50cykge1xuICAgIGF1Z21lbnQoQ29uc3RydWN0b3IsIGF1Z21lbnRzKVxuICB9KVxuICBibHVlcHJpbnQuZGlnZXN0KFwicHJvdG90eXBlXCIsIGZ1bmN0aW9uIChwcm90bykge1xuICAgIGV4dGVuZChDb25zdHJ1Y3RvciwgcHJvdG8pXG4gIH0pXG4gIGJsdWVwcmludC5kaWdlc3QoXCJzdGF0aWNcIiwgZnVuY3Rpb24gKG5hbWUsIG1ldGhvZCkge1xuICAgIENvbnN0cnVjdG9yW25hbWVdID0gbWV0aG9kXG4gIH0sIHRydWUpXG4gIGJsdWVwcmludC5kaWdlc3QoXCJhY2Nlc3NvclwiLCBmdW5jdGlvbiggbmFtZSwgYWNjZXNzICl7XG4gICAgaWYoICFhY2Nlc3MgKSByZXR1cm5cbiAgICBpZiggdHlwZW9mIGFjY2VzcyA9PSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgIGRlZmluZS5nZXR0ZXIocHJvdG8sIG5hbWUsIGFjY2VzcylcbiAgICB9XG4gICAgZWxzZSBpZiggdHlwZW9mIGFjY2Vzc1tcImdldFwiXSA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGFjY2Vzc1tcInNldFwiXSA9PSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgIGRlZmluZS5hY2Nlc3Nvcihwcm90bywgbmFtZSwgYWNjZXNzW1wiZ2V0XCJdLCBhY2Nlc3NbXCJzZXRcIl0pXG4gICAgfVxuICAgIGVsc2UgaWYoIHR5cGVvZiBhY2Nlc3NbXCJnZXRcIl0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICBkZWZpbmUuZ2V0dGVyKHByb3RvLCBuYW1lLCBhY2Nlc3NbXCJnZXRcIl0pXG4gICAgfVxuICAgIGVsc2UgaWYoIHR5cGVvZiBhY2Nlc3NbXCJzZXRcIl0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICBkZWZpbmUuZ2V0dGVyKHByb3RvLCBuYW1lLCBhY2Nlc3NbXCJzZXRcIl0pXG4gICAgfVxuICB9LCB0cnVlKVxuICAvL2JsdWVwcmludC5kaWdlc3QoXCJpbmNsdWRlXCIsIGZ1bmN0aW9uIChpbmNsdWRlcykge1xuICAvLyAgaWYgKCFBcnJheS5pc0FycmF5KGluY2x1ZGVzKSkge1xuICAvLyAgICBpbmNsdWRlcyA9IFtpbmNsdWRlc11cbiAgLy8gIH1cbiAgLy8gIGluY2x1ZGVzLmZvckVhY2goZnVuY3Rpb24gKGluY2x1ZGUpIHtcbiAgLy8gICAgdmFyIGZvcmVpZ24gPSBmYWN0b3J5LmZpbmRGYWN0b3J5KGluY2x1ZGUpXG4gIC8vICAgIGlmIChmb3JlaWduKSB7XG4gIC8vICAgICAgZm9yZWlnbi5ibHVlcHJpbnQuYnVpbGQoXCJwcm90b3R5cGVcIiwgQ29uc3RydWN0b3IucHJvdG90eXBlLCBibHVlcHJpbnQpXG4gIC8vICAgIH1cbiAgLy8gIH0pXG4gIC8vfSlcbn1cblxuRmFjdG9yeS5wcm90b3R5cGUuaW5kdXN0cnkgPSBbXVxuXG5GYWN0b3J5LnByb3RvdHlwZS5maW5kRmFjdG9yeSA9IGZ1bmN0aW9uKCBDb25zdHJ1Y3RvciApe1xuICB2YXIgcmV0ID0gbnVsbFxuICB0aGlzLmluZHVzdHJ5LnNvbWUoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICByZXR1cm4gZmFjdG9yeS5Db25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IgJiYgKHJldCA9IGZhY3RvcnkpXG4gIH0pXG4gIHJldHVybiByZXRcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXVnbWVudCAoQ2xhc3MsIG1peGluKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG1peGluKSkge1xuICAgIG1peGluLmZvckVhY2goZnVuY3Rpb24gKG1peGluKSB7XG4gICAgICBpZiAodHlwZW9mIG1peGluID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBtaXhpbi5jYWxsKENsYXNzLnByb3RvdHlwZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0eXBlb2YgbWl4aW4gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBtaXhpbi5jYWxsKENsYXNzLnByb3RvdHlwZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQ2xhc3Ncbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kIChDbGFzcywgcHJvdG90eXBlKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvdHlwZSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBcImNvbnN0cnVjdG9yXCIgKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLnByb3RvdHlwZSwgbmFtZSwgZGVzY3JpcHRvcilcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIENsYXNzXG59XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5jbHVkZSAoQ2xhc3MsIE90aGVyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KE90aGVyKSkge1xuICAgIE90aGVyLmZvckVhY2goZnVuY3Rpb24gKE90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIE90aGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBleHRlbmQoQ2xhc3MsIE90aGVyLnByb3RvdHlwZSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBPdGhlciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGV4dGVuZChDbGFzcywgT3RoZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIE90aGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgZXh0ZW5kKENsYXNzLCBPdGhlci5wcm90b3R5cGUpXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBPdGhlciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICBleHRlbmQoQ2xhc3MsIE90aGVyKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBDbGFzc1xufVxuIiwidmFyIEZhY3RvcnkgPSByZXF1aXJlKFwiLi9GYWN0b3J5XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmFjdG9yeSggYmx1ZXByaW50ICl7XG4gIHJldHVybiBuZXcgRmFjdG9yeShibHVlcHJpbnQpLmFzc2VtYmxlKClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdCAoQ2xhc3MsIEJhc2UpIHtcbiAgQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlLnByb3RvdHlwZSlcbiAgQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xhc3NcblxuICByZXR1cm4gQ2xhc3Ncbn1cbiIsInZhciBmb3JJbiA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9pblwiKVxudmFyIGNvcHkgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvY29weVwiKVxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi8uLi9mYWN0b3J5L2luaGVyaXRcIilcbnZhciBFeHRlbnNpb24gPSByZXF1aXJlKFwiLi8uLi9mYWN0b3J5L0V4dGVuc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhY2hlRXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIENhY2hlRXh0ZW5zaW9uIChpbml0aWFsaXplKSB7XG4gIEV4dGVuc2lvbi5jYWxsKHRoaXMsIHtcbiAgICB0eXBlOiBcImNhY2hlXCIsXG4gICAgaW5oZXJpdDogdHJ1ZSxcbiAgICBpbml0aWFsaXplOiBpbml0aWFsaXplXG4gIH0pXG59XG5cbmluaGVyaXQoQ2FjaGVFeHRlbnNpb24sIEV4dGVuc2lvbilcblxuLy9DYWNoZUV4dGVuc2lvbi5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oIHByb3RvdHlwZSwgYmxvY2sgKXtcbi8vICBpZiAoIXRoaXMubmFtZSkgcmV0dXJuXG4vL1xuLy8gIHZhciBjYWNoZSA9IHByb3RvdHlwZVt0aGlzLm5hbWVdID0ge31cbi8vXG4vLyAgaWYgKHByb3RvdHlwZS5jb25zdHJ1Y3Rvci5TdXBlcikge1xuLy8gICAgdmFyIHN1cGVyQ2FjaGUgPSBwcm90b3R5cGUuY29uc3RydWN0b3IuU3VwZXIucHJvdG90eXBlW3RoaXMubmFtZV1cbi8vICAgIGNhY2hlID0gcHJvdG90eXBlW3RoaXMubmFtZV0gPSBjb3B5KHN1cGVyQ2FjaGUpXG4vLyAgfVxuLy9cbi8vICB2YXIgaW5pdGlhbGl6ZSA9IHRoaXMuaW5pdGlhbGl6ZVxuLy8gIGZvckluKGJsb2NrLCBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKXtcbi8vICAgIGNhY2hlW25hbWVdID0gaW5pdGlhbGl6ZVxuLy8gICAgICAgID8gaW5pdGlhbGl6ZShwcm90b3R5cGUsIG5hbWUsIHZhbHVlLCBibG9jaylcbi8vICAgICAgICA6IHZhbHVlXG4vLyAgfSlcbi8vfVxuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmF1bHRzXCIpXG52YXIgVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIilcbnZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuLi9kb20vU2VsZWN0b3JcIilcbnZhciBGcmFnbWVudCA9IHJlcXVpcmUoXCIuLi9kb20vRnJhZ21lbnRcIilcbnZhciBJbnN0YW5jZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0luc3RhbmNlRXh0ZW5zaW9uXCIpXG52YXIgQ2FjaGVFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9DYWNoZUV4dGVuc2lvblwiKVxuXG52YXIgRWxlbWVudCA9IG1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICBleHRlbnNpb25zOiB7XG4gICAgY2hpbGRyZW46IG5ldyBJbnN0YW5jZUV4dGVuc2lvbihmdW5jdGlvbihlbGVtZW50LCBuYW1lLCBzZWxlY3Rvcil7XG4gICAgICBzZWxlY3RvciA9IG5ldyBTZWxlY3RvcihkZWZhdWx0cyhzZWxlY3Rvciwge1xuICAgICAgICBhdHRyaWJ1dGU6IFwiZGF0YS1lbGVtZW50XCIsXG4gICAgICAgIG9wZXJhdG9yOiBcIn5cIixcbiAgICAgICAgdmFsdWU6IG5hbWVcbiAgICAgIH0pKS5wcmVmaXgoZWxlbWVudC5uYW1lKVxuICAgICAgc2VsZWN0b3IuZWxlbWVudCA9IGVsZW1lbnQuZWxlbWVudFxuICAgICAgZWxlbWVudC5jaGlsZHJlbltuYW1lXSA9IHNlbGVjdG9yXG4gICAgfSksXG4gICAgZnJhZ21lbnRzOiBuZXcgQ2FjaGVFeHRlbnNpb24oZnVuY3Rpb24gKHByb3RvdHlwZSwgbmFtZSwgZnJhZ21lbnQpIHtcbiAgICAgIGlmICghKGZyYWdtZW50IGluc3RhbmNlb2YgRnJhZ21lbnQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnJhZ21lbnQoZnJhZ21lbnQpXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJhZ21lbnRcbiAgICB9KVxuICB9LFxuICBjaGlsZHJlbjoge30sXG4gIGNoYW5nZUxheW91dDoge30sXG4gIGV2ZW50czoge30sXG4gIGF0dHJpYnV0ZXM6IHt9LFxuICBmcmFnbWVudHM6IHt9LFxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gRWxlbWVudChlbGVtZW50KSB7XG4gICAgVmlldy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgRWxlbWVudC5pbml0aWFsaXplKHRoaXMpXG4gIH0sXG4gIHByb3RvdHlwZToge1xuICAgIG5hbWU6IFwiXCJcbiAgfVxufSlcbiIsInZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoXCIuLi9kb20vZGVsZWdhdGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFxuXG5mdW5jdGlvbiBFdmVudCAoZXZlbnQpIHtcbiAgZXZlbnQgPSBldmVudCB8fCB7fVxuICB0aGlzLnR5cGUgPSBldmVudC50eXBlXG4gIHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gIHRoaXMub25jZSA9ICEhZXZlbnQub25jZVxuICB0aGlzLmNhcHR1cmUgPSAhIWV2ZW50LmNhcHR1cmVcbiAgdGhpcy5oYW5kbGVyID0gZXZlbnQuaGFuZGxlclxuICB0aGlzLnByb3h5ID0gZXZlbnQuaGFuZGxlclxuICBpZiAoZXZlbnQudHJhbnNmb3JtICkgdGhpcy50cmFuc2Zvcm0gPSBldmVudC50cmFuc2Zvcm1cbn1cblxuRXZlbnQucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICgpIHt9XG5cbkV2ZW50LnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250ZXh0KSB7XG4gIGlmICh0aGlzLnRhcmdldCkge1xuICAgIHRoaXMucHJveHkgPSBkZWxlZ2F0ZSh7XG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgdHJhbnNmb3JtOiB0aGlzLnRyYW5zZm9ybVxuICAgIH0pXG4gICAgdGhpcy5wcm94eS5tYXRjaCh0aGlzLnRhcmdldCwgdGhpcy5oYW5kbGVyKVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0aGlzLm9uY2UpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5jYXB0dXJlKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5jYXB0dXJlKVxuICAgIH1cbiAgfVxufVxuXG5FdmVudC5wcm90b3R5cGUudW5SZWdpc3RlciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIGlmICh0aGlzLnByb3h5KSB7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy5wcm94eSwgdGhpcy5jYXB0dXJlKVxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5jYXB0dXJlKVxuICB9XG59XG4iLCJ2YXIgZm9ySW4gPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvaW5cIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9FeHRlbnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBJbnN0YW5jZUV4dGVuc2lvblxuXG5mdW5jdGlvbiBJbnN0YW5jZUV4dGVuc2lvbiAoaW5pdGlhbGl6ZSkge1xuICBFeHRlbnNpb24uY2FsbCh0aGlzLCB7XG4gICAgdHlwZTogXCJpbnN0YW5jZVwiLFxuICAgIGluaGVyaXQ6IHRydWUsXG4gICAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZVxuICB9KVxufVxuXG5pbmhlcml0KEluc3RhbmNlRXh0ZW5zaW9uLCBFeHRlbnNpb24pXG5cbi8vSW5zdGFuY2VFeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBpbnN0YW5jZSwgYmxvY2sgKXtcbi8vICB2YXIgaW5pdGlhbGl6ZSA9IHRoaXMuaW5pdGlhbGl6ZVxuLy8gIGZvckluKGJsb2NrLCBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKXtcbi8vICAgIGluaXRpYWxpemUoaW5zdGFuY2UsIG5hbWUsIHZhbHVlLCBibG9jaylcbi8vICB9KVxuLy99XG4iLCJ2YXIgZm9ySW4gPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvaW5cIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9FeHRlbnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90b3R5cGVFeHRlbnNpb25cblxuZnVuY3Rpb24gUHJvdG90eXBlRXh0ZW5zaW9uIChpbml0aWFsaXplKSB7XG4gIEV4dGVuc2lvbi5jYWxsKHRoaXMsIHtcbiAgICB0eXBlOiBcInByb3RvdHlwZVwiLFxuICAgIGluaGVyaXQ6IGZhbHNlLFxuICAgIGluaXRpYWxpemU6IGluaXRpYWxpemVcbiAgfSlcbn1cblxuaW5oZXJpdChQcm90b3R5cGVFeHRlbnNpb24sIEV4dGVuc2lvbilcblxuLy9Qcm90b3R5cGVFeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBwcm90b3R5cGUsIGJsb2NrICl7XG4vLyAgdmFyIGluaXRpYWxpemUgPSB0aGlzLmluaXRpYWxpemVcbi8vICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4vLyAgICBpbml0aWFsaXplKHByb3RvdHlwZSwgbmFtZSwgdmFsdWUsIGJsb2NrKVxuLy8gIH0pXG4vL31cbiIsInZhciBkZWZhdWx0cyA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9kZWZhdWx0c1wiKVxudmFyIFZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpXG52YXIgU2VsZWN0b3IgPSByZXF1aXJlKFwiLi4vZG9tL1NlbGVjdG9yXCIpXG52YXIgSW5zdGFuY2VFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9JbnN0YW5jZUV4dGVuc2lvblwiKVxuXG52YXIgUmVnaW9uID0gbW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIGV4dGVuc2lvbnM6IHtcbiAgICBjaGlsZHJlbjogbmV3IEluc3RhbmNlRXh0ZW5zaW9uKGZ1bmN0aW9uKHJlZ2lvbiwgbmFtZSwgc2VsZWN0b3Ipe1xuICAgICAgc2VsZWN0b3IgPSBuZXcgU2VsZWN0b3IoZGVmYXVsdHMoc2VsZWN0b3IsIHtcbiAgICAgICAgYXR0cmlidXRlOiBcImRhdGEtZWxlbWVudFwiLFxuICAgICAgICBvcGVyYXRvcjogXCJ+XCIsXG4gICAgICAgIHZhbHVlOiBuYW1lXG4gICAgICB9KSlcbiAgICAgIHNlbGVjdG9yLmVsZW1lbnQgPSByZWdpb24uZWxlbWVudFxuICAgICAgcmVnaW9uLmNoaWxkcmVuW25hbWVdID0gc2VsZWN0b3JcbiAgICB9KVxuICB9LFxuICBjaGlsZHJlbjoge30sXG4gIGxheW91dHM6IHt9LFxuICBldmVudHM6IHt9LFxuICBhdHRyaWJ1dGVzOiB7XG4gICAgdmlzaWJsZTogZmFsc2UsXG4gICAgZm9jdXNlZDogZmFsc2VcbiAgfSxcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIFJlZ2lvbihlbGVtZW50KSB7XG4gICAgVmlldy5jYWxsKHRoaXMsIGVsZW1lbnQpXG4gICAgUmVnaW9uLmluaXRpYWxpemUodGhpcylcbiAgfSxcbiAgcHJvdG90eXBlOiB7XG4gICAgbmFtZTogXCJcIlxuICB9XG59KVxuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmF1bHRzXCIpXG52YXIgVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIilcbnZhciBSZWdpb24gPSByZXF1aXJlKFwiLi9SZWdpb25cIilcbnZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuLi9kb20vU2VsZWN0b3JcIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEluc3RhbmNlRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vSW5zdGFuY2VFeHRlbnNpb25cIilcblxudmFyIFNjcmVlbiA9IG1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICBleHRlbnNpb25zOiB7XG4gICAgcmVnaW9uczogbmV3IEluc3RhbmNlRXh0ZW5zaW9uKGZ1bmN0aW9uIChzY3JlZW4sIG5hbWUsIHNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IG5ldyBTZWxlY3RvcihkZWZhdWx0cyhzZWxlY3Rvciwge1xuICAgICAgICBhdHRyaWJ1dGU6IFwiZGF0YS1yZWdpb25cIixcbiAgICAgICAgb3BlcmF0b3I6IFwiPVwiLFxuICAgICAgICB2YWx1ZTogbmFtZSxcbiAgICAgICAgQ29uc3RydWN0b3I6IFJlZ2lvblxuICAgICAgfSkpXG4gICAgICBzZWxlY3Rvci5lbGVtZW50ID0gc2NyZWVuLmVsZW1lbnRcbiAgICAgIHNjcmVlbi5yZWdpb25zW25hbWVdID0gc2VsZWN0b3JcbiAgICB9KVxuICB9LFxuICByZWdpb25zOiB7fSxcbiAgY2hhbmdlTGF5b3V0OiB7fSxcbiAgZXZlbnRzOiB7fSxcbiAgYXR0cmlidXRlczoge30sXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBTY3JlZW4oZWxlbWVudCkge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IGRvY3VtZW50LmJvZHlcbiAgICBlbGVtZW50ID0gdGhpcy5zZWxlY3Rvci5zZWxlY3QoZWxlbWVudClcbiAgICBWaWV3LmNhbGwodGhpcywgZWxlbWVudClcbiAgICB0aGlzLnJlZ2lvbnMgPSB7fVxuICAgIFNjcmVlbi5pbml0aWFsaXplKHRoaXMpXG4gIH0sXG4gIHByb3RvdHlwZToge1xuICAgIHNlbGVjdG9yOiBuZXcgU2VsZWN0b3Ioe2F0dHJpYnV0ZTogXCJkYXRhLXNjcmVlblwifSlcbiAgfVxufSlcbiIsInZhciBkZWZpbmUgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmaW5lXCIpXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmYXVsdHNcIilcbnZhciBmYWN0b3J5ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnlcIilcbnZhciBFdmVudCA9IHJlcXVpcmUoXCIuL0V2ZW50XCIpXG52YXIgYXR0cmlidXRlcyA9IHJlcXVpcmUoXCIuLi9hdHRyaWJ1dGVzXCIpXG52YXIgZG9tQXR0cmlidXRlcyA9IHJlcXVpcmUoXCIuLi9kb20vYXR0cmlidXRlc1wiKVxudmFyIFByb3RvdHlwZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL1Byb3RvdHlwZUV4dGVuc2lvblwiKVxudmFyIEluc3RhbmNlRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vSW5zdGFuY2VFeHRlbnNpb25cIilcbnZhciBDYWNoZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0NhY2hlRXh0ZW5zaW9uXCIpXG5cbnZhciBWaWV3ID0gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHtcbiAgJ3N0YXRpYyc6IHt9LFxuXG4gIGV4dGVuc2lvbnM6IHtcbiAgICBsYXlvdXRzOiBuZXcgQ2FjaGVFeHRlbnNpb24oZnVuY3Rpb24gKHByb3RvdHlwZSwgbmFtZSwgbGF5b3V0SGFuZGxlcikge1xuICAgICAgcmV0dXJuIGxheW91dEhhbmRsZXJcbiAgICB9KSxcbiAgICBldmVudHM6IG5ldyBJbnN0YW5jZUV4dGVuc2lvbihmdW5jdGlvbiAodmlldywgbmFtZSwgZXZlbnQpIHtcbiAgICAgIGlmICghKGV2ZW50IGluc3RhbmNlb2YgRXZlbnQpKSB7XG4gICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50KVxuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBldmVudC5oYW5kbGVyID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgZXZlbnQuaGFuZGxlciA9IHZpZXdbZXZlbnQuaGFuZGxlcl0uYmluZCh2aWV3KVxuICAgICAgfVxuICAgICAgZXZlbnQucmVnaXN0ZXIodmlldy5lbGVtZW50LCB0aGlzKVxuICAgIH0pLFxuICAgIGF0dHJpYnV0ZXM6IG5ldyBQcm90b3R5cGVFeHRlbnNpb24oZnVuY3Rpb24gKHByb3RvdHlwZSwgbmFtZSwgYXR0cmlidXRlKSB7XG4gICAgICBpZiAoIShhdHRyaWJ1dGUgaW5zdGFuY2VvZiBhdHRyaWJ1dGVzLkF0dHJpYnV0ZSkpIHtcbiAgICAgICAgYXR0cmlidXRlID0gZG9tQXR0cmlidXRlcy5jcmVhdGUoYXR0cmlidXRlKVxuICAgICAgfVxuXG4gICAgICBhdHRyaWJ1dGUubmFtZSA9IGF0dHJpYnV0ZS5uYW1lIHx8IG5hbWVcbiAgICAgIGF0dHJpYnV0ZS5kZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsIG5hbWUsIGZ1bmN0aW9uICh2aWV3KSB7XG4gICAgICAgIHJldHVybiB2aWV3LmVsZW1lbnRcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICBsYXlvdXRzOiB7XG4gICAgJ2RlZmF1bHQnOiBmdW5jdGlvbiAoKSB7fVxuICB9LFxuICBldmVudHM6IHt9LFxuICBhdHRyaWJ1dGVzOiB7XG4gICAgZHVtbXk6IGZhbHNlXG4gIH0sXG5cbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIFZpZXcoIGVsZW1lbnQgKXtcbiAgICB0aGlzLmN1cnJlbnRMYXlvdXQgPSBcIlwiXG4gICAgLy90aGlzLmxheW91dHMgPSB7fVxuICAgIHRoaXMuY2hpbGRyZW4gPSB7fVxuICAgIHRoaXMuX2VsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIFZpZXcuaW5pdGlhbGl6ZSh0aGlzKVxuICB9LFxuXG4gIGFjY2Vzc29yOiB7XG4gICAgZWxlbWVudDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICB2YXIgcHJldmlvdXMgPSB0aGlzLl9lbGVtZW50XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gICAgICAgIHRoaXMub25FbGVtZW50Q2hhbmdlKGVsZW1lbnQsIHByZXZpb3VzKVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBwcm90b3R5cGU6IHtcbiAgICBvbkVsZW1lbnRDaGFuZ2U6IGZ1bmN0aW9uIChlbGVtZW50LCBwcmV2aW91cykge30sXG4gICAgb25MYXlvdXRDaGFuZ2U6IGZ1bmN0aW9uIChsYXlvdXQsIHByZXZpb3VzKSB7fSxcbiAgICBjaGFuZ2VMYXlvdXQ6IGZ1bmN0aW9uKCBsYXlvdXQgKXtcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRMYXlvdXQgPT0gbGF5b3V0KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgfVxuXG4gICAgICB2YXIgbGF5b3V0SGFuZGxlciA9IHRoaXMubGF5b3V0c1tsYXlvdXRdXG4gICAgICBpZiAoIWxheW91dEhhbmRsZXIpIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoXCJNaXNzaW5nIGxheW91dCBoYW5kbGVyOiBcIiArIGxheW91dCkpXG5cbiAgICAgIHZhciB2aWV3ID0gdGhpc1xuICAgICAgdmFyIHByZXZpb3VzID0gdmlldy5jdXJyZW50TGF5b3V0XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHByZXZpb3VzKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGxheW91dEhhbmRsZXIuY2FsbCh2aWV3LCBwcmV2aW91cylcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2aWV3LmN1cnJlbnRMYXlvdXQgPSBsYXlvdXRcbiAgICAgICAgdmlldy5vbkxheW91dENoYW5nZShsYXlvdXQsIHByZXZpb3VzKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbiAodHlwZSwgZGV0YWlsLCBkZWYpIHtcbiAgICAgIHZhciBkZWZpbml0aW9uID0gZGVmYXVsdHMoZGVmLCB7XG4gICAgICAgIGRldGFpbDogZGV0YWlsIHx8IG51bGwsXG4gICAgICAgIHZpZXc6IHdpbmRvdyxcbiAgICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgd2luZG93LkN1c3RvbUV2ZW50KHR5cGUsIGRlZmluaXRpb24pKVxuICAgIH1cbiAgfVxufSlcbiIsInZhciB1aSA9IG1vZHVsZS5leHBvcnRzID0ge31cblxudWkuU2NyZWVuID0gcmVxdWlyZShcIi4vU2NyZWVuXCIpXG51aS5SZWdpb24gPSByZXF1aXJlKFwiLi9SZWdpb25cIilcbnVpLkVsZW1lbnQgPSByZXF1aXJlKFwiLi9FbGVtZW50XCIpXG51aS5WaWV3ID0gcmVxdWlyZShcIi4vVmlld1wiKVxuIl19
