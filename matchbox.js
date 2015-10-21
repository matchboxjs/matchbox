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