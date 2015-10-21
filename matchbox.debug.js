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
  this.useDefaultOnGet = false

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
      return attribute.get(context, attribute.useDefaultOnGet)
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
  this.useDefaultOnGet = true
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
      if (typeof selector == "function") {
        selector = {Constructor: selector}
      }
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

  layouts: {},
  events: {},
  attributes: {},

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9EZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL21hdGNoYm94LXV0aWwvb2JqZWN0L2NvcHkuanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmYXVsdHMuanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL21hdGNoYm94LXV0aWwvb2JqZWN0L2V4dGVuZC5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9pbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9tZXJnZS5qcyIsInNyYy9hdHRyaWJ1dGVzL0F0dHJpYnV0ZS5qcyIsInNyYy9hdHRyaWJ1dGVzL0Jvb2xlYW4uanMiLCJzcmMvYXR0cmlidXRlcy9GbG9hdC5qcyIsInNyYy9hdHRyaWJ1dGVzL051bWJlci5qcyIsInNyYy9hdHRyaWJ1dGVzL1N0cmluZy5qcyIsInNyYy9hdHRyaWJ1dGVzL2luZGV4LmpzIiwic3JjL2RvbS9GcmFnbWVudC5qcyIsInNyYy9kb20vU2VsZWN0b3IuanMiLCJzcmMvZG9tL2F0dHJpYnV0ZXMuanMiLCJzcmMvZG9tL2RlbGVnYXRlLmpzIiwic3JjL2RvbS9pbmRleC5qcyIsInNyYy9mYWN0b3J5L0JsdWVwcmludC5qcyIsInNyYy9mYWN0b3J5L0V4dGVuc2lvbi5qcyIsInNyYy9mYWN0b3J5L0ZhY3RvcnkuanMiLCJzcmMvZmFjdG9yeS9hdWdtZW50LmpzIiwic3JjL2ZhY3RvcnkvZXh0ZW5kLmpzIiwic3JjL2ZhY3RvcnkvaW5jbHVkZS5qcyIsInNyYy9mYWN0b3J5L2luZGV4LmpzIiwic3JjL2ZhY3RvcnkvaW5oZXJpdC5qcyIsInNyYy91aS9DYWNoZUV4dGVuc2lvbi5qcyIsInNyYy91aS9FbGVtZW50LmpzIiwic3JjL3VpL0V2ZW50LmpzIiwic3JjL3VpL0luc3RhbmNlRXh0ZW5zaW9uLmpzIiwic3JjL3VpL1Byb3RvdHlwZUV4dGVuc2lvbi5qcyIsInNyYy91aS9SZWdpb24uanMiLCJzcmMvdWkvU2NyZWVuLmpzIiwic3JjL3VpL1ZpZXcuanMiLCJzcmMvdWkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtYXRjaGJveCA9IG1vZHVsZS5leHBvcnRzID0ge31cblxubWF0Y2hib3guZmFjdG9yeSA9IHJlcXVpcmUoXCIuL3NyYy9mYWN0b3J5XCIpXG5tYXRjaGJveC51aSA9IHJlcXVpcmUoXCIuL3NyYy91aVwiKVxubWF0Y2hib3guZG9tID0gcmVxdWlyZShcIi4vc3JjL2RvbVwiKVxubWF0Y2hib3guYXR0cmlidXRlcyA9IHJlcXVpcmUoXCIuL3NyYy9hdHRyaWJ1dGVzXCIpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IERlc2NyaXB0b3JcblxudmFyIF93cml0YWJsZSA9IFwiX3dyaXRhYmxlXCJcbnZhciBfZW51bWVyYWJsZSA9IFwiX2VudW1lcmFibGVcIlxudmFyIF9jb25maWd1cmFibGUgPSBcIl9jb25maWd1cmFibGVcIlxuXG5mdW5jdGlvbiBEZXNjcmlwdG9yKCB3cml0YWJsZSwgZW51bWVyYWJsZSwgY29uZmlndXJhYmxlICl7XG4gIHRoaXMudmFsdWUodGhpcywgX3dyaXRhYmxlLCB3cml0YWJsZSB8fCBmYWxzZSlcbiAgdGhpcy52YWx1ZSh0aGlzLCBfZW51bWVyYWJsZSwgZW51bWVyYWJsZSB8fCBmYWxzZSlcbiAgdGhpcy52YWx1ZSh0aGlzLCBfY29uZmlndXJhYmxlLCBjb25maWd1cmFibGUgfHwgZmFsc2UpXG5cbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJ3XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMud3JpdGFibGUgfSlcbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJ3cml0YWJsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEZXNjcmlwdG9yKHRydWUsIGVudW1lcmFibGUsIGNvbmZpZ3VyYWJsZSlcbiAgfSlcblxuICB0aGlzLmdldHRlcih0aGlzLCBcImVcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5lbnVtZXJhYmxlIH0pXG4gIHRoaXMuZ2V0dGVyKHRoaXMsIFwiZW51bWVyYWJsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEZXNjcmlwdG9yKHdyaXRhYmxlLCB0cnVlLCBjb25maWd1cmFibGUpXG4gIH0pXG5cbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJjXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuY29uZmlndXJhYmxlIH0pXG4gIHRoaXMuZ2V0dGVyKHRoaXMsIFwiY29uZmlndXJhYmxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERlc2NyaXB0b3Iod3JpdGFibGUsIGVudW1lcmFibGUsIHRydWUpXG4gIH0pXG59XG5cbkRlc2NyaXB0b3IucHJvdG90eXBlID0ge1xuICBhY2Nlc3NvcjogZnVuY3Rpb24oIG9iaiwgbmFtZSwgZ2V0dGVyLCBzZXR0ZXIgKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIGdldDogZ2V0dGVyLFxuICAgICAgc2V0OiBzZXR0ZXJcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIGdldHRlcjogZnVuY3Rpb24oIG9iaiwgbmFtZSwgZm4gKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIGdldDogZm5cbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIHNldHRlcjogZnVuY3Rpb24oIG9iaiwgbmFtZSwgZm4gKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIHNldDogZm5cbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIHZhbHVlOiBmdW5jdGlvbiggb2JqLCBuYW1lLCB2YWx1ZSApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIHdyaXRhYmxlOiB0aGlzW193cml0YWJsZV0sXG4gICAgICBlbnVtZXJhYmxlOiB0aGlzW19lbnVtZXJhYmxlXSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgbWV0aG9kOiBmdW5jdGlvbiggb2JqLCBuYW1lLCBmbiApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIHdyaXRhYmxlOiB0aGlzW193cml0YWJsZV0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdGhpc1tfY29uZmlndXJhYmxlXSxcbiAgICAgIHZhbHVlOiBmblxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgcHJvcGVydHk6IGZ1bmN0aW9uKCBvYmosIG5hbWUsIHZhbHVlICl7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgd3JpdGFibGU6IHRoaXNbX3dyaXRhYmxlXSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuICBjb25zdGFudDogZnVuY3Rpb24oIG9iaiwgbmFtZSwgdmFsdWUgKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwiLi9leHRlbmRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBleHRlbmQoe30sIG9iailcbn1cbiIsInZhciBjb3B5ID0gcmVxdWlyZShcIi4vY29weVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmF1bHRzIChvcHRpb25zLCBkZWZhdWx0cykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gY29weShkZWZhdWx0cylcbiAgfVxuXG4gIHZhciBvYmogPSBjb3B5KG9wdGlvbnMpXG5cbiAgZm9yICh2YXIgcHJvcCBpbiBkZWZhdWx0cykge1xuICAgIGlmIChkZWZhdWx0cy5oYXNPd25Qcm9wZXJ0eShwcm9wKSAmJiAhb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgb2JqW3Byb3BdID0gZGVmYXVsdHNbcHJvcF1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqXG59XG4iLCJ2YXIgRGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuL0Rlc2NyaXB0b3JcIilcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgRGVzY3JpcHRvcigpXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCggb2JqLCBleHRlbnNpb24gKXtcbiAgZm9yKCB2YXIgbmFtZSBpbiBleHRlbnNpb24gKXtcbiAgICBpZiggZXh0ZW5zaW9uLmhhc093blByb3BlcnR5KG5hbWUpICkgb2JqW25hbWVdID0gZXh0ZW5zaW9uW25hbWVdXG4gIH1cbiAgcmV0dXJuIG9ialxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb2JqLCBjYWxsYmFjayApe1xuICBmb3IoIHZhciBwcm9wIGluIG9iaiApe1xuICAgIGlmKCBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgKXtcbiAgICAgIGNhbGxiYWNrKHByb3AsIG9ialtwcm9wXSwgb2JqKVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqXG59XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG9iaiwgZXh0ZW5zaW9uICl7XG4gIHJldHVybiBleHRlbmQoZXh0ZW5kKHt9LCBvYmopLCBleHRlbnNpb24pXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEF0dHJpYnV0ZVxuXG5mdW5jdGlvbiBBdHRyaWJ1dGUgKGRlZikge1xuICBpZiAodHlwZW9mIGRlZiA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgZGVmID0ge31cbiAgfVxuICB0aGlzLnR5cGUgPSBkZWYudHlwZSB8fCBcIlwiXG4gIHRoaXMubmFtZSA9IGRlZi5uYW1lIHx8IFwiXCJcbiAgdGhpcy5vbmNoYW5nZSA9IGRlZi5vbmNoYW5nZSB8fCBudWxsXG4gIHRoaXMuZGVmYXVsdCA9IG51bGxcbiAgdGhpcy51c2VEZWZhdWx0T25HZXQgPSBmYWxzZVxuXG4gIGlmIChBdHRyaWJ1dGUuaXNQcmltaXRpdmUoZGVmKSkge1xuICAgIHRoaXMuZGVmYXVsdCA9IGRlZlxuICAgIHRoaXMuaGFzRGVmYXVsdCA9IHRydWVcbiAgfVxuICBlbHNlIGlmIChkZWYpIHtcbiAgICB0aGlzLmRlZmF1bHQgPSBkZWYuZGVmYXVsdFxuICAgIHRoaXMuaGFzRGVmYXVsdCA9IHR5cGVvZiB0aGlzLmRlZmF1bHQgIT0gXCJ1bmRlZmluZWRcIlxuICB9XG59XG5cbkF0dHJpYnV0ZS5nZXRUeXBlID0gZnVuY3Rpb24gKGRlZikge1xuICBpZiAodHlwZW9mIGRlZiA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIFwic3RyaW5nXCJcbiAgfVxuICBpZiAoQXR0cmlidXRlLmlzUHJpbWl0aXZlKGRlZikpIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiBkZWYpIHtcbiAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgLy8gbm90ZTogaXQgZmFpbHMgZm9yIDEuMFxuICAgICAgICBpZiAoZGVmID09PSArZGVmICYmIGRlZiAhPT0gKGRlZiB8IDApKSB7XG4gICAgICAgICAgcmV0dXJuIFwiZmxvYXRcIlxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgZGVmXG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHR5cGVvZiBkZWYudHlwZVxuICB9XG59XG5cbkF0dHJpYnV0ZS5pc1ByaW1pdGl2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICBzd2l0Y2goIHR5cGVvZiB2YWx1ZSApIHtcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5BdHRyaWJ1dGUucHJvdG90eXBlLnBhcnNlVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlXG59XG5BdHRyaWJ1dGUucHJvdG90eXBlLnN0cmluZ2lmeVZhbHVlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiBcIlwiICsgdmFsdWVcbn1cbkF0dHJpYnV0ZS5wcm90b3R5cGUuc2hvdWxkUmVtb3ZlID0gZnVuY3Rpb24oIHZhbHVlICl7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsXG59XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqLCBuYW1lLCBnZXRDb250ZXh0KSB7XG4gIHZhciBhdHRyaWJ1dGUgPSB0aGlzXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb250ZXh0ID0gdHlwZW9mIGdldENvbnRleHQgPT0gXCJmdW5jdGlvblwiID8gZ2V0Q29udGV4dCh0aGlzKSA6IGdldENvbnRleHRcbiAgICAgIHJldHVybiBhdHRyaWJ1dGUuZ2V0KGNvbnRleHQsIGF0dHJpYnV0ZS51c2VEZWZhdWx0T25HZXQpXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgdmFyIGNvbnRleHQgPSB0eXBlb2YgZ2V0Q29udGV4dCA9PSBcImZ1bmN0aW9uXCIgPyBnZXRDb250ZXh0KHRoaXMpIDogZ2V0Q29udGV4dFxuICAgICAgYXR0cmlidXRlLnNldChjb250ZXh0LCB2YWx1ZSlcbiAgICB9XG4gIH0pXG59XG5BdHRyaWJ1dGUucHJvdG90eXBlLmdldEZyb21Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5hbWUpIHt9XG5BdHRyaWJ1dGUucHJvdG90eXBlLnNldE9uQ29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0LCBuYW1lLCB2YWx1ZSkge31cbkF0dHJpYnV0ZS5wcm90b3R5cGUuaGFzT25Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5hbWUpIHt9XG5BdHRyaWJ1dGUucHJvdG90eXBlLnJlbW92ZUZyb21Db250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5hbWUpIHt9XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oIGNvbnRleHQsIHVzZURlZmF1bHQgKXtcbiAgdmFyIHZhbHVlID0gdGhpcy5nZXRGcm9tQ29udGV4dChjb250ZXh0LCB0aGlzLm5hbWUpXG4gIGlmKCB2YWx1ZSA9PSBudWxsICYmIHVzZURlZmF1bHQgPT0gdHJ1ZSApe1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRcbiAgfVxuXG4gIHJldHVybiB0aGlzLnBhcnNlVmFsdWUodmFsdWUpXG59XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oIGNvbnRleHQsIHZhbHVlLCBjYWxsT25jaGFuZ2UgKXtcbiAgdmFyIHByZXZpb3VzVmFsdWUgPSB0aGlzLmdldChjb250ZXh0LCBmYWxzZSlcbiAgaWYoIHByZXZpb3VzVmFsdWUgPT09IHZhbHVlICl7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiggdGhpcy5zaG91bGRSZW1vdmUodmFsdWUpICl7XG4gICAgdGhpcy5yZW1vdmVGcm9tQ29udGV4dChjb250ZXh0LCB0aGlzLm5hbWUpXG4gIH1cbiAgZWxzZSB7XG4gICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5zdHJpbmdpZnlWYWx1ZSh2YWx1ZSlcbiAgICB0aGlzLnNldE9uQ29udGV4dChjb250ZXh0LCB0aGlzLm5hbWUsIG5ld1ZhbHVlKVxuICB9XG5cbiAgdGhpcy5vbmNoYW5nZSAmJiBjYWxsT25jaGFuZ2UgIT0gZmFsc2UgJiYgdGhpcy5vbmNoYW5nZS5jYWxsKGNvbnRleHQsIHByZXZpb3VzVmFsdWUsIHZhbHVlKVxufVxuIiwidmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4vQXR0cmlidXRlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gQm9vbGVhblxuXG5mdW5jdGlvbiBCb29sZWFuIChkZWYpIHtcbiAgQXR0cmlidXRlLmNhbGwodGhpcywgZGVmKVxuICB0aGlzLnR5cGUgPSBcImJvb2xlYW5cIlxuICB0aGlzLnVzZURlZmF1bHRPbkdldCA9IHRydWVcbn1cblxuaW5oZXJpdChCb29sZWFuLCBBdHRyaWJ1dGUpXG5cbkJvb2xlYW4ucHJvdG90eXBlLnN0cmluZ2lmeVZhbHVlID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIFwiXCJcbn1cbkJvb2xlYW4ucHJvdG90eXBlLnNob3VsZFJlbW92ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApe1xuICByZXR1cm4gdmFsdWUgPT0gZmFsc2Vcbn1cbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEF0dHJpYnV0ZSA9IHJlcXVpcmUoXCIuL0F0dHJpYnV0ZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb2F0XG5cbmZ1bmN0aW9uIEZsb2F0IChkZWYpIHtcbiAgQXR0cmlidXRlLmNhbGwodGhpcywgZGVmKVxuICB0aGlzLnR5cGUgPSBcImZsb2F0XCJcbn1cblxuaW5oZXJpdChGbG9hdCwgQXR0cmlidXRlKVxuXG5GbG9hdC5wcm90b3R5cGUuc3RyaW5naWZ5VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHBhcnNlSW50KHZhbHVlLCAxMClcbn1cbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEF0dHJpYnV0ZSA9IHJlcXVpcmUoXCIuL0F0dHJpYnV0ZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IE51bWJlclxuXG5mdW5jdGlvbiBOdW1iZXIgKGRlZikge1xuICBBdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG4gIHRoaXMudHlwZSA9IFwibnVtYmVyXCJcbn1cblxuaW5oZXJpdChOdW1iZXIsIEF0dHJpYnV0ZSlcblxuTnVtYmVyLnByb3RvdHlwZS5zdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyBudWxsIDogcGFyc2VGbG9hdCh2YWx1ZSlcbn1cbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEF0dHJpYnV0ZSA9IHJlcXVpcmUoXCIuL0F0dHJpYnV0ZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0cmluZ1xuXG5mdW5jdGlvbiBTdHJpbmcgKGRlZikge1xuICBBdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG4gIHRoaXMudHlwZSA9IFwic3RyaW5nXCJcbn1cblxuaW5oZXJpdChTdHJpbmcsIEF0dHJpYnV0ZSlcblxuU3RyaW5nLnByb3RvdHlwZS5zdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyBudWxsIDogdmFsdWUgPyBcIlwiICsgdmFsdWUgOiBcIlwiXG59XG4iLCJ2YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4vQXR0cmlidXRlXCIpXG52YXIgU3RyaW5nID0gcmVxdWlyZShcIi4vU3RyaW5nXCIpXG52YXIgQm9vbGVhbiA9IHJlcXVpcmUoXCIuL0Jvb2xlYW5cIilcbnZhciBOdW1iZXIgPSByZXF1aXJlKFwiLi9OdW1iZXJcIilcbnZhciBGbG9hdCA9IHJlcXVpcmUoXCIuL0Zsb2F0XCIpXG5cbnZhciBhdHRyaWJ1dGVzID0gbW9kdWxlLmV4cG9ydHMgPSB7fVxuXG5hdHRyaWJ1dGVzLmNyZWF0ZSA9IGZ1bmN0aW9uIChkZWYpIHtcbiAgc3dpdGNoIChBdHRyaWJ1dGUuZ2V0VHlwZShkZWYpKSB7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIG5ldyBTdHJpbmcoZGVmKVxuICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICByZXR1cm4gbmV3IEJvb2xlYW4oZGVmKVxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgIHJldHVybiBuZXcgTnVtYmVyKGRlZilcbiAgICBjYXNlIFwiZmxvYXRcIjpcbiAgICAgIHJldHVybiBuZXcgRmxvYXQoZGVmKVxuICB9XG59XG5cbmF0dHJpYnV0ZXMuQXR0cmlidXRlID0gQXR0cmlidXRlXG5hdHRyaWJ1dGVzLlN0cmluZyA9IFN0cmluZ1xuYXR0cmlidXRlcy5Cb29sZWFuID0gQm9vbGVhblxuYXR0cmlidXRlcy5OdW1iZXIgPSBOdW1iZXJcbmF0dHJpYnV0ZXMuRmxvYXQgPSBGbG9hdFxuIiwibW9kdWxlLmV4cG9ydHMgPSBGcmFnbWVudFxuXG5mdW5jdGlvbiBGcmFnbWVudCAoZnJhZ21lbnQpIHtcbiAgZnJhZ21lbnQgPSBmcmFnbWVudCB8fCB7fVxuICB0aGlzLmh0bWwgPSBmcmFnbWVudC5odG1sIHx8IFwiXCJcbiAgdGhpcy5maXJzdCA9IGZyYWdtZW50LmZpcnN0ID09IHVuZGVmaW5lZCB8fCAhIWZyYWdtZW50LmZpcnN0XG4gIHRoaXMudGltZW91dCA9IGZyYWdtZW50LnRpbWVvdXQgfHwgMjAwMFxufVxuXG5GcmFnbWVudC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKGh0bWwpIHtcbiAgdmFyIHRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gIHRlbXAuaW5uZXJIVE1MID0gaHRtbCB8fCB0aGlzLmh0bWxcblxuICBpZiAodGhpcy5maXJzdCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZmlyc3QpIHtcbiAgICByZXR1cm4gdGVtcC5jaGlsZHJlblswXVxuICB9XG5cbiAgdmFyIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gIHdoaWxlICh0ZW1wLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQodGVtcC5maXJzdENoaWxkKVxuICB9XG5cbiAgcmV0dXJuIGZyYWdtZW50O1xufVxuXG5GcmFnbWVudC5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uIChodG1sLCBvcHRpb25zLCBjYikge1xuICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBjYihudWxsLCBodG1sKVxuICB9LCA0KVxufVxuXG5GcmFnbWVudC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgdmFyIGZyYWdtZW50ID0gdGhpc1xuICBjb250ZXh0ID0gY29udGV4dCB8fCB7fVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgdmFyIHJlc29sdmVkID0gZmFsc2VcbiAgICB2YXIgaWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJSZW5kZXIgdGltZWQgb3V0XCIpKVxuICAgIH0sIGZyYWdtZW50LnRpbWVvdXQpXG5cbiAgICB0cnkge1xuICAgICAgZnJhZ21lbnQuY29tcGlsZShjb250ZXh0LCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyLCByZW5kZXJlZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoaWQpXG4gICAgICAgIGlmIChyZXNvbHZlZCkgcmV0dXJuXG5cbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJlamVjdChlcnIpXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShmcmFnbWVudC5jcmVhdGUocmVuZGVyZWQpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KGUpXG4gICAgfVxuICB9KVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RvclxuXG5TZWxlY3Rvci5ERUZBVUxUX05FU1RfU0VQQVJBVE9SID0gXCI6XCJcblxuZnVuY3Rpb24gU2VsZWN0b3IgKHNlbGVjdG9yKSB7XG4gIHNlbGVjdG9yID0gc2VsZWN0b3IgfHwge31cbiAgdGhpcy5hdHRyaWJ1dGUgPSBzZWxlY3Rvci5hdHRyaWJ1dGVcbiAgdGhpcy52YWx1ZSA9IHNlbGVjdG9yLnZhbHVlIHx8IG51bGxcbiAgdGhpcy5vcGVyYXRvciA9IHNlbGVjdG9yLm9wZXJhdG9yIHx8IFwiPVwiXG4gIHRoaXMuZXh0cmEgPSBzZWxlY3Rvci5leHRyYSB8fCBudWxsXG5cbiAgdGhpcy5lbGVtZW50ID0gc2VsZWN0b3IuZWxlbWVudCB8fCBudWxsXG5cbiAgdGhpcy5Db25zdHJ1Y3RvciA9IHNlbGVjdG9yLkNvbnN0cnVjdG9yIHx8IG51bGxcbiAgdGhpcy5pbnN0YW50aWF0ZSA9IHNlbGVjdG9yLmluc3RhbnRpYXRlIHx8IG51bGxcbiAgdGhpcy5tdWx0aXBsZSA9IHNlbGVjdG9yLm11bHRpcGxlICE9IG51bGwgPyAhIXNlbGVjdG9yLm11bHRpcGxlIDogZmFsc2VcblxuICB0aGlzLm1hdGNoZXIgPSBzZWxlY3Rvci5tYXRjaGVyIHx8IG51bGxcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IFNlbGVjdG9yKHRoaXMpXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5jb21iaW5lID0gZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gIHZhciBzID0gdGhpcy5jbG9uZSgpXG4gIHMuZXh0cmEgKz0gc2VsZWN0b3IudG9TdHJpbmcoKVxuICByZXR1cm4gc1xufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuZXF1YWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHMgPSB0aGlzLmNsb25lKClcbiAgcy5vcGVyYXRvciA9IFwiPVwiXG4gIHMudmFsdWUgPSB2YWx1ZVxuICByZXR1cm4gc1xufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHMgPSB0aGlzLmNsb25lKClcbiAgcy5vcGVyYXRvciA9IFwiflwiXG4gIHMudmFsdWUgPSB2YWx1ZVxuICByZXR1cm4gc1xufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUucHJlZml4ID0gZnVuY3Rpb24gKHByZSwgc2VwYXJhdG9yKSB7XG4gIHZhciBzID0gdGhpcy5jbG9uZSgpXG4gIHZhciBzZXAgPSBzLnZhbHVlID8gc2VwYXJhdG9yIHx8IFNlbGVjdG9yLkRFRkFVTFRfTkVTVF9TRVBBUkFUT1IgOiBcIlwiXG4gIHMudmFsdWUgPSBwcmUgKyBzZXAgKyBzLnZhbHVlXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5uZXN0ID0gZnVuY3Rpb24gKHBvc3QsIHNlcGFyYXRvcikge1xuICB2YXIgcyA9IHRoaXMuY2xvbmUoKVxuICB2YXIgc2VwID0gcy52YWx1ZSA/IHNlcGFyYXRvciB8fCBTZWxlY3Rvci5ERUZBVUxUX05FU1RfU0VQQVJBVE9SIDogXCJcIlxuICBzLnZhbHVlICs9IHNlcCArIHBvc3RcbiAgcmV0dXJuIHNcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLmZyb20gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB2YXIgcyA9IHRoaXMuY2xvbmUoKVxuICBzLmVsZW1lbnQgPSBlbGVtZW50XG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5zZWxlY3QgPSBmdW5jdGlvbiAoZWxlbWVudCwgdHJhbnNmb3JtKSB7XG4gIHZhciByZXN1bHQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy50b1N0cmluZygpKVxuICByZXR1cm4gdHJhbnNmb3JtID8gdHJhbnNmb3JtKHJlc3VsdCkgOiByZXN1bHRcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLnNlbGVjdEFsbCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0cmFuc2Zvcm0pIHtcbiAgdmFyIHJlc3VsdCA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnRvU3RyaW5nKCkpXG4gIHJldHVybiB0cmFuc2Zvcm0gPyB0cmFuc2Zvcm0ocmVzdWx0KSA6IHJlc3VsdFxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUubm9kZSA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0KHRoaXMuZWxlbWVudCwgdHJhbnNmb3JtKVxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUubm9kZUxpc3QgPSBmdW5jdGlvbiAodHJhbnNmb3JtKSB7XG4gIHJldHVybiB0aGlzLnNlbGVjdEFsbCh0aGlzLmVsZW1lbnQsIHRyYW5zZm9ybSlcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLmNvbnN0cnVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvclxuICB2YXIgaW5zdGFudGlhdGUgPSB0aGlzLmluc3RhbnRpYXRlIHx8IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIG5ldyBDb25zdHJ1Y3RvcihlbGVtZW50KVxuICB9XG4gIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZUxpc3QoZnVuY3Rpb24gKGVsZW1lbnRzKSB7XG4gICAgICByZXR1cm4gW10ubWFwLmNhbGwoZWxlbWVudHMsIGluc3RhbnRpYXRlKVxuICAgIH0pXG4gIH1cbiAgZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZShpbnN0YW50aWF0ZSlcbiAgfVxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB2YWx1ZSA9IHRoaXMudmFsdWUgIT0gbnVsbFxuICAgICAgPyAnXCInICsgKHRoaXMudmFsdWUgPT0gdHJ1ZSA/IFwiXCIgOiB0aGlzLnZhbHVlKSArICdcIidcbiAgICAgIDogXCJcIlxuICB2YXIgb3BlcmF0b3IgPSB2YWx1ZSA/IHRoaXMub3BlcmF0b3IgfHwgXCI9XCIgOiBcIlwiXG4gIHZhciBleHRyYSA9IHRoaXMuZXh0cmEgfHwgXCJcIlxuICByZXR1cm4gXCJbXCIgKyB0aGlzLmF0dHJpYnV0ZSArIG9wZXJhdG9yICsgdmFsdWUgKyBcIl1cIiArIGV4dHJhXG59XG4iLCJ2YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCIuLi9mYWN0b3J5L2luaGVyaXRcIilcbnZhciBpbmNsdWRlID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5jbHVkZVwiKVxudmFyIEF0dHJpYnV0ZSA9IHJlcXVpcmUoXCIuLi9hdHRyaWJ1dGVzL0F0dHJpYnV0ZVwiKVxudmFyIFN0cmluZyA9IHJlcXVpcmUoXCIuLi9hdHRyaWJ1dGVzL1N0cmluZ1wiKVxudmFyIEJvb2xlYW4gPSByZXF1aXJlKFwiLi4vYXR0cmlidXRlcy9Cb29sZWFuXCIpXG52YXIgTnVtYmVyID0gcmVxdWlyZShcIi4uL2F0dHJpYnV0ZXMvTnVtYmVyXCIpXG52YXIgRmxvYXQgPSByZXF1aXJlKFwiLi4vYXR0cmlidXRlcy9GbG9hdFwiKVxuXG52YXIgZG9tQXR0cmlidXRlcyA9IG1vZHVsZS5leHBvcnRzID0ge31cblxuZG9tQXR0cmlidXRlcy5jcmVhdGUgPSBmdW5jdGlvbiAoZGVmKSB7XG4gIHN3aXRjaCAoQXR0cmlidXRlLmdldFR5cGUoZGVmKSkge1xuICAgIGNhc2UgXCJzdHJpbmdcIjpcbiAgICAgIHJldHVybiBuZXcgRG9tU3RyaW5nKGRlZilcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgcmV0dXJuIG5ldyBEb21Cb29sZWFuKGRlZilcbiAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICByZXR1cm4gbmV3IERvbU51bWJlcihkZWYpXG4gICAgY2FzZSBcImZsb2F0XCI6XG4gICAgICByZXR1cm4gbmV3IERvbUZsb2F0KGRlZilcbiAgfVxufVxuXG5mdW5jdGlvbiBEb21BdHRyaWJ1dGUgKGRlZikge1xuICBkZWYgPSBkZWYgfHwge31cbiAgdGhpcy5wcmVmaXggPSBkZWYucHJlZml4ID09IG51bGwgPyBcImRhdGEtXCIgOiBkZWYucHJlZml4XG59XG5cbkRvbUF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0RnJvbUNvbnRleHQgPSBmdW5jdGlvbiggZWxlbWVudCwgbmFtZSApe1xuICBuYW1lID0gdGhpcy5wcmVmaXggPyB0aGlzLnByZWZpeCArIG5hbWUgOiBuYW1lXG4gIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKVxufVxuRG9tQXR0cmlidXRlLnByb3RvdHlwZS5zZXRPbkNvbnRleHQgPSBmdW5jdGlvbiggZWxlbWVudCwgbmFtZSwgdmFsdWUgKXtcbiAgbmFtZSA9IHRoaXMucHJlZml4ID8gdGhpcy5wcmVmaXggKyBuYW1lIDogbmFtZVxuICByZXR1cm4gZWxlbWVudC5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpXG59XG5Eb21BdHRyaWJ1dGUucHJvdG90eXBlLmhhc09uQ29udGV4dCA9IGZ1bmN0aW9uKCBlbGVtZW50LCBuYW1lICl7XG4gIG5hbWUgPSB0aGlzLnByZWZpeCA/IHRoaXMucHJlZml4ICsgbmFtZSA6IG5hbWVcbiAgcmV0dXJuIGVsZW1lbnQuaGFzQXR0cmlidXRlKG5hbWUpXG59XG5Eb21BdHRyaWJ1dGUucHJvdG90eXBlLnJlbW92ZUZyb21Db250ZXh0ID0gZnVuY3Rpb24oIGVsZW1lbnQsIG5hbWUgKXtcbiAgbmFtZSA9IHRoaXMucHJlZml4ID8gdGhpcy5wcmVmaXggKyBuYW1lIDogbmFtZVxuICByZXR1cm4gZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUobmFtZSlcbn1cblxuZnVuY3Rpb24gRG9tU3RyaW5nIChkZWYpIHtcbiAgU3RyaW5nLmNhbGwodGhpcywgZGVmKVxuICBEb21BdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG59XG5kb21BdHRyaWJ1dGVzLlN0cmluZyA9IERvbVN0cmluZ1xuaW5oZXJpdChEb21TdHJpbmcsIFN0cmluZylcbmluY2x1ZGUoRG9tU3RyaW5nLCBEb21BdHRyaWJ1dGUpXG5cbmZ1bmN0aW9uIERvbUJvb2xlYW4gKGRlZikge1xuICBCb29sZWFuLmNhbGwodGhpcywgZGVmKVxuICBEb21BdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG59XG5kb21BdHRyaWJ1dGVzLkJvb2xlYW4gPSBEb21Cb29sZWFuXG5pbmhlcml0KERvbUJvb2xlYW4sIEJvb2xlYW4pXG5pbmNsdWRlKERvbUJvb2xlYW4sIERvbUF0dHJpYnV0ZSlcblxuZnVuY3Rpb24gRG9tTnVtYmVyIChkZWYpIHtcbiAgTnVtYmVyLmNhbGwodGhpcywgZGVmKVxuICBEb21BdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG59XG5kb21BdHRyaWJ1dGVzLk51bWJlciA9IERvbU51bWJlclxuaW5oZXJpdChEb21OdW1iZXIsIE51bWJlcilcbmluY2x1ZGUoRG9tTnVtYmVyLCBEb21BdHRyaWJ1dGUpXG5cbmZ1bmN0aW9uIERvbUZsb2F0IChkZWYpIHtcbiAgRmxvYXQuY2FsbCh0aGlzLCBkZWYpXG4gIERvbUF0dHJpYnV0ZS5jYWxsKHRoaXMsIGRlZilcbn1cbmRvbUF0dHJpYnV0ZXMuRmxvYXQgPSBEb21GbG9hdFxuaW5oZXJpdChEb21GbG9hdCwgRmxvYXQpXG5pbmNsdWRlKERvbUZsb2F0LCBEb21BdHRyaWJ1dGUpXG4iLCJ2YXIgU2VsZWN0b3IgPSByZXF1aXJlKFwiLi9TZWxlY3RvclwiKVxuXG4vKipcbiAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciBvbiBhbiBlbGVtZW50XG4gKiBhbmQgcmV0dXJucyBhIGRlbGVnYXRvci5cbiAqIEEgZGVsZWdhdGVkIGV2ZW50IHJ1bnMgbWF0Y2hlcyB0byBmaW5kIGFuIGV2ZW50IHRhcmdldCxcbiAqIHRoZW4gZXhlY3V0ZXMgdGhlIGhhbmRsZXIgcGFpcmVkIHdpdGggdGhlIG1hdGNoZXIuXG4gKiBNYXRjaGVycyBjYW4gY2hlY2sgaWYgYW4gZXZlbnQgdGFyZ2V0IG1hdGNoZXMgYSBnaXZlbiBzZWxlY3RvcixcbiAqIG9yIHNlZSBpZiBhbiBvZiBpdHMgcGFyZW50cyBkby5cbiAqICovXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGVnYXRlXG5cbmZ1bmN0aW9uIGRlbGVnYXRlKCBvcHRpb25zICl7XG4gIHZhciBlbGVtZW50ID0gb3B0aW9ucy5lbGVtZW50XG4gICAgLCBldmVudCA9IG9wdGlvbnMuZXZlbnRcbiAgICAsIGNhcHR1cmUgPSAhIW9wdGlvbnMuY2FwdHVyZSB8fCBmYWxzZVxuICAgICwgY29udGV4dCA9IG9wdGlvbnMuY29udGV4dCB8fCBlbGVtZW50XG4gICAgLCB0cmFuc2Zvcm0gPSBvcHRpb25zLnRyYW5zZm9ybSB8fCBudWxsXG5cbiAgaWYoICFlbGVtZW50ICl7XG4gICAgY29uc29sZS5sb2coXCJDYW4ndCBkZWxlZ2F0ZSB1bmRlZmluZWQgZWxlbWVudFwiKVxuICAgIHJldHVybiBudWxsXG4gIH1cbiAgaWYoICFldmVudCApe1xuICAgIGNvbnNvbGUubG9nKFwiQ2FuJ3QgZGVsZWdhdGUgdW5kZWZpbmVkIGV2ZW50XCIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIHZhciBkZWxlZ2F0b3IgPSBjcmVhdGVEZWxlZ2F0b3IoY29udGV4dCwgdHJhbnNmb3JtKVxuICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGRlbGVnYXRvciwgY2FwdHVyZSlcblxuICByZXR1cm4gZGVsZWdhdG9yXG59XG5cbi8qKlxuICogUmV0dXJucyBhIGRlbGVnYXRvciB0aGF0IGNhbiBiZSB1c2VkIGFzIGFuIGV2ZW50IGxpc3RlbmVyLlxuICogVGhlIGRlbGVnYXRvciBoYXMgc3RhdGljIG1ldGhvZHMgd2hpY2ggY2FuIGJlIHVzZWQgdG8gcmVnaXN0ZXIgaGFuZGxlcnMuXG4gKiAqL1xuZnVuY3Rpb24gY3JlYXRlRGVsZWdhdG9yKCBjb250ZXh0LCB0cmFuc2Zvcm0gKXtcbiAgdmFyIG1hdGNoZXJzID0gW11cblxuICBmdW5jdGlvbiBkZWxlZ2F0b3IoIGUgKXtcbiAgICB2YXIgbCA9IG1hdGNoZXJzLmxlbmd0aFxuICAgIGlmKCAhbCApe1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICB2YXIgZWwgPSB0aGlzXG4gICAgICAgICwgaSA9IC0xXG4gICAgICAgICwgaGFuZGxlclxuICAgICAgICAsIHNlbGVjdG9yXG4gICAgICAgICwgZGVsZWdhdGVFbGVtZW50XG4gICAgICAgICwgc3RvcFByb3BhZ2F0aW9uXG4gICAgICAgICwgYXJnc1xuXG4gICAgd2hpbGUoICsraSA8IGwgKXtcbiAgICAgIGFyZ3MgPSBtYXRjaGVyc1tpXVxuICAgICAgaGFuZGxlciA9IGFyZ3NbMF1cbiAgICAgIHNlbGVjdG9yID0gYXJnc1sxXVxuXG4gICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSBtYXRjaENhcHR1cmVQYXRoKHNlbGVjdG9yLCBlbCwgZSwgdHJhbnNmb3JtLCBjb250ZXh0KVxuICAgICAgaWYoIGRlbGVnYXRlRWxlbWVudCAmJiBkZWxlZ2F0ZUVsZW1lbnQubGVuZ3RoICkge1xuICAgICAgICBzdG9wUHJvcGFnYXRpb24gPSBmYWxzZSA9PT0gaGFuZGxlci5hcHBseShjb250ZXh0LCBbZV0uY29uY2F0KGRlbGVnYXRlRWxlbWVudCkpXG4gICAgICAgIGlmKCBzdG9wUHJvcGFnYXRpb24gKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGhhbmRsZXIgd2l0aCBhIHRhcmdldCBmaW5kZXIgbG9naWNcbiAgICogKi9cbiAgZGVsZWdhdG9yLm1hdGNoID0gZnVuY3Rpb24oIHNlbGVjdG9yLCBoYW5kbGVyICl7XG4gICAgbWF0Y2hlcnMucHVzaChbaGFuZGxlciwgc2VsZWN0b3JdKVxuICAgIHJldHVybiBkZWxlZ2F0b3JcbiAgfVxuXG4gIHJldHVybiBkZWxlZ2F0b3Jcbn1cblxuZnVuY3Rpb24gbWF0Y2hDYXB0dXJlUGF0aCggc2VsZWN0b3IsIGVsLCBlLCB0cmFuc2Zvcm0sIGNvbnRleHQgKXtcbiAgdmFyIGRlbGVnYXRlRWxlbWVudHMgPSBbXVxuICB2YXIgZGVsZWdhdGVFbGVtZW50ID0gbnVsbFxuICBpZiggQXJyYXkuaXNBcnJheShzZWxlY3RvcikgKXtcbiAgICB2YXIgaSA9IC0xXG4gICAgdmFyIGwgPSBzZWxlY3Rvci5sZW5ndGhcbiAgICB3aGlsZSggKytpIDwgbCApe1xuICAgICAgZGVsZWdhdGVFbGVtZW50ID0gZmluZFBhcmVudChzZWxlY3RvcltpXSwgZWwsIGUpXG4gICAgICBpZiggIWRlbGVnYXRlRWxlbWVudCApIHJldHVybiBudWxsXG4gICAgICBpZiAodHlwZW9mIHRyYW5zZm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZGVsZWdhdGVFbGVtZW50ID0gdHJhbnNmb3JtKGNvbnRleHQsIHNlbGVjdG9yLCBkZWxlZ2F0ZUVsZW1lbnQpXG4gICAgICB9XG4gICAgICBkZWxlZ2F0ZUVsZW1lbnRzLnB1c2goZGVsZWdhdGVFbGVtZW50KVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBkZWxlZ2F0ZUVsZW1lbnQgPSBmaW5kUGFyZW50KHNlbGVjdG9yLCBlbCwgZSlcbiAgICBpZiggIWRlbGVnYXRlRWxlbWVudCApIHJldHVybiBudWxsXG4gICAgaWYgKHR5cGVvZiB0cmFuc2Zvcm0gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSB0cmFuc2Zvcm0oY29udGV4dCwgc2VsZWN0b3IsIGRlbGVnYXRlRWxlbWVudClcbiAgICB9XG4gICAgZGVsZWdhdGVFbGVtZW50cy5wdXNoKGRlbGVnYXRlRWxlbWVudClcbiAgfVxuICByZXR1cm4gZGVsZWdhdGVFbGVtZW50c1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB0YXJnZXQgb3IgYW55IG9mIGl0cyBwYXJlbnQgbWF0Y2hlcyBhIHNlbGVjdG9yXG4gKiAqL1xuZnVuY3Rpb24gZmluZFBhcmVudCggc2VsZWN0b3IsIGVsLCBlICl7XG4gIHZhciB0YXJnZXQgPSBlLnRhcmdldFxuICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBTZWxlY3Rvcikge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IudG9TdHJpbmcoKVxuICB9XG4gIHN3aXRjaCggdHlwZW9mIHNlbGVjdG9yICl7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgd2hpbGUoIHRhcmdldCAmJiB0YXJnZXQgIT0gZWwgKXtcbiAgICAgICAgaWYoIHRhcmdldC5tYXRjaGVzICYmIHRhcmdldC5tYXRjaGVzKHNlbGVjdG9yKSApIHJldHVybiB0YXJnZXRcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSBcImZ1bmN0aW9uXCI6XG4gICAgICB3aGlsZSggdGFyZ2V0ICYmIHRhcmdldCAhPSBlbCApe1xuICAgICAgICBpZiggc2VsZWN0b3IuY2FsbChlbCwgdGFyZ2V0KSApIHJldHVybiB0YXJnZXRcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsXG4gIH1cbiAgcmV0dXJuIG51bGxcbn1cbiIsInZhciBkb20gPSBtb2R1bGUuZXhwb3J0cyA9IHt9XG5cbmRvbS5kZWxlZ2F0ZSA9IHJlcXVpcmUoXCIuL2RlbGVnYXRlXCIpXG5kb20uU2VsZWN0b3IgPSByZXF1aXJlKFwiLi9TZWxlY3RvclwiKVxuIiwidmFyIG1lcmdlID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L21lcmdlXCIpXG52YXIgZm9ySW4gPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvaW5cIilcbnZhciBFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9FeHRlbnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBCbHVlcHJpbnRcblxuZnVuY3Rpb24gQmx1ZXByaW50KCBibG9ja3MsIHBhcmVudCApe1xuICB2YXIgYmx1ZXByaW50ID0gdGhpc1xuXG4gIHRoaXMuYmxvY2tzID0gbWVyZ2UoYmxvY2tzKVxuICB0aGlzLnBhcmVudCA9IHBhcmVudFxuXG4gIHRoaXMubG9jYWxFeHRlbnNpb25zID0gdGhpcy5nZXQoXCJleHRlbnNpb25zXCIsIHt9KVxuXG4gIGZvckluKHRoaXMubG9jYWxFeHRlbnNpb25zLCBmdW5jdGlvbiggbmFtZSwgZXh0ZW5zaW9uICl7XG4gICAgLy9pZiAocGFyZW50ICYmICEhfnBhcmVudC5leHRlbnNpb25OYW1lcy5pbmRleE9mKG5hbWUpKSB7XG4gICAgLy8gIHRocm93IG5ldyBFcnJvcihcIkRlc2NyaXB0aW9uIG92ZXJyaWRlIGlzIG5vdCBzdXBwb3J0ZWRcIilcbiAgICAvL31cblxuICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvbiBpbnN0YW5jZW9mIEV4dGVuc2lvblxuICAgICAgICA/IGV4dGVuc2lvblxuICAgICAgICA6IG5ldyBFeHRlbnNpb24oZXh0ZW5zaW9uKVxuICAgIGJsdWVwcmludC5sb2NhbEV4dGVuc2lvbnNbbmFtZV0gPSBleHRlbnNpb25cbiAgICBleHRlbnNpb24ubmFtZSA9IG5hbWVcbiAgfSlcblxuICB0aGlzLmdsb2JhbEV4dGVuc2lvbnMgPSB0aGlzLmxvY2FsRXh0ZW5zaW9uc1xuXG4gIGlmIChwYXJlbnQpIHtcbiAgICB0aGlzLmdsb2JhbEV4dGVuc2lvbnMgPSBtZXJnZShwYXJlbnQuZ2xvYmFsRXh0ZW5zaW9ucywgdGhpcy5sb2NhbEV4dGVuc2lvbnMpXG4gICAgZm9ySW4odGhpcy5nbG9iYWxFeHRlbnNpb25zLCBmdW5jdGlvbiAobmFtZSwgZXh0ZW5zaW9uKSB7XG4gICAgICBpZiAoZXh0ZW5zaW9uLmluaGVyaXQpIHtcbiAgICAgICAgYmx1ZXByaW50LmJsb2Nrc1tuYW1lXSA9IG1lcmdlKHBhcmVudC5nZXQobmFtZSksIGJsdWVwcmludC5nZXQobmFtZSkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkUHJvdG90eXBlID0gZnVuY3Rpb24oIHByb3RvdHlwZSwgdG9wICl7XG4gIHRoaXMuYnVpbGQoXCJwcm90b3R5cGVcIiwgdGhpcy5nbG9iYWxFeHRlbnNpb25zLCB0b3AsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24sIGJsb2NrKSB7XG4gICAgZm9ySW4oYmxvY2ssIGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApe1xuICAgICAgZXh0ZW5zaW9uLmluaXRpYWxpemUocHJvdG90eXBlLCBuYW1lLCB2YWx1ZSlcbiAgICB9KVxuICB9KVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkQ2FjaGUgPSBmdW5jdGlvbiggcHJvdG90eXBlLCB0b3AgKXtcbiAgdGhpcy5idWlsZChcImNhY2hlXCIsIHRoaXMuZ2xvYmFsRXh0ZW5zaW9ucywgdG9wLCBmdW5jdGlvbiAobmFtZSwgZXh0ZW5zaW9uLCBibG9jaykge1xuICAgIGlmICghcHJvdG90eXBlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBwcm90b3R5cGVbbmFtZV0gPSB7fVxuICAgIH1cblxuICAgIHZhciBjYWNoZSA9IHByb3RvdHlwZVtuYW1lXVxuICAgIHZhciBpbml0aWFsaXplID0gZXh0ZW5zaW9uLmluaXRpYWxpemVcblxuICAgIGZvckluKGJsb2NrLCBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKXtcbiAgICAgIGNhY2hlW25hbWVdID0gaW5pdGlhbGl6ZVxuICAgICAgICAgID8gaW5pdGlhbGl6ZShwcm90b3R5cGUsIG5hbWUsIHZhbHVlKVxuICAgICAgICAgIDogdmFsdWVcbiAgICB9KVxuICB9KVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkSW5zdGFuY2UgPSBmdW5jdGlvbiggaW5zdGFuY2UsIHRvcCApe1xuICB0aGlzLmJ1aWxkKFwiaW5zdGFuY2VcIiwgdGhpcy5sb2NhbEV4dGVuc2lvbnMsIHRvcCwgZnVuY3Rpb24gKG5hbWUsIGV4dGVuc2lvbiwgYmxvY2spIHtcbiAgICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4gICAgICBleHRlbnNpb24uaW5pdGlhbGl6ZShpbnN0YW5jZSwgbmFtZSwgdmFsdWUpXG4gICAgfSlcbiAgfSlcbn1cblxuQmx1ZXByaW50LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCB0eXBlLCBleHRlbnNpb25zLCB0b3AsIGJ1aWxkICl7XG4gIHZhciBibHVlcHJpbnQgPSB0b3AgfHwgdGhpc1xuICAvL3ZhciBiYXNlID0gdGhpc1xuICBmb3JJbihleHRlbnNpb25zLCBmdW5jdGlvbiAobmFtZSwgZXh0ZW5zaW9uKSB7XG4gICAgaWYoIGV4dGVuc2lvbi50eXBlICE9IHR5cGUgKSByZXR1cm5cbiAgICAvL3ZhciBibHVlcHJpbnQgPSBleHRlbnNpb24uaW5oZXJpdCA/IHRvcCA6IGJhc2VcbiAgICB2YXIgYmxvY2sgPSBibHVlcHJpbnQuZ2V0KG5hbWUpXG4gICAgaWYoICFibG9jayApIHJldHVyblxuXG4gICAgYnVpbGQobmFtZSwgZXh0ZW5zaW9uLCBibG9jaylcbiAgfSlcbn1cblxuQmx1ZXByaW50LnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiggbmFtZSwgZm4sIGxvb3AgKXtcbiAgaWYgKHRoaXMuaGFzKG5hbWUpKSB7XG4gICAgdmFyIGJsb2NrID0gdGhpcy5nZXQobmFtZSlcbiAgICBpZiAobG9vcCkge1xuICAgICAgZm9ySW4oYmxvY2ssIGZuKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZuLmNhbGwodGhpcywgYmxvY2spXG4gICAgfVxuICB9XG59XG5cbkJsdWVwcmludC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oIG5hbWUgKXtcbiAgcmV0dXJuIHRoaXMuYmxvY2tzLmhhc093blByb3BlcnR5KG5hbWUpICYmIHRoaXMuYmxvY2tzW25hbWVdICE9IG51bGxcbn1cblxuQmx1ZXByaW50LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiggbmFtZSwgZGVmYXVsdFZhbHVlICl7XG4gIGlmKCB0aGlzLmhhcyhuYW1lKSApe1xuICAgIHJldHVybiB0aGlzLmJsb2Nrc1tuYW1lXVxuICB9XG4gIGVsc2UgcmV0dXJuIGRlZmF1bHRWYWx1ZVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBFeHRlbnNpb25cblxuZnVuY3Rpb24gRXh0ZW5zaW9uKGV4dGVuc2lvbil7XG4gIGV4dGVuc2lvbiA9IGV4dGVuc2lvbiB8fCB7fVxuICB0aGlzLm5hbWUgPSBcIlwiXG4gIHRoaXMudHlwZSA9IGV4dGVuc2lvbi50eXBlIHx8IFwiaW5zdGFuY2VcIlxuICB0aGlzLmluaGVyaXQgPSBleHRlbnNpb24uaW5oZXJpdCB8fCBmYWxzZVxuICB0aGlzLmluaXRpYWxpemUgPSBleHRlbnNpb24uaW5pdGlhbGl6ZSB8fCBudWxsXG59XG5cbi8vRXh0ZW5zaW9uLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiggY29udGV4dCwgYmxvY2sgKXt9XG4iLCJ2YXIgZGVmaW5lID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmluZVwiKVxudmFyIEJsdWVwcmludCA9IHJlcXVpcmUoXCIuL0JsdWVwcmludFwiKVxudmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuL2V4dGVuZFwiKVxudmFyIGF1Z21lbnQgPSByZXF1aXJlKFwiLi9hdWdtZW50XCIpXG52YXIgaW5jbHVkZSA9IHJlcXVpcmUoXCIuL2luY2x1ZGVcIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4vaW5oZXJpdFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZhY3RvcnlcblxuZnVuY3Rpb24gRmFjdG9yeSggYmx1ZXByaW50LCBwYXJlbnQgKXtcbiAgdmFyIGZhY3RvcnkgPSB0aGlzXG5cbiAgaWYoICEoYmx1ZXByaW50IGluc3RhbmNlb2YgQmx1ZXByaW50KSApIHtcbiAgICBibHVlcHJpbnQgPSBuZXcgQmx1ZXByaW50KGJsdWVwcmludCwgcGFyZW50ID8gcGFyZW50LmJsdWVwcmludCA6IG51bGwpXG4gIH1cblxuICB0aGlzLmJsdWVwcmludCA9IGJsdWVwcmludFxuICB0aGlzLnBhcmVudCA9IHBhcmVudCB8fCBudWxsXG4gIHRoaXMuYW5jZXN0b3JzID0gcGFyZW50ID8gcGFyZW50LmFuY2VzdG9ycy5jb25jYXQoW3BhcmVudF0pIDogW11cbiAgdGhpcy5yb290ID0gdGhpcy5hbmNlc3RvcnNbMF0gfHwgbnVsbFxuICB0aGlzLlN1cGVyID0gYmx1ZXByaW50LmdldChcImluaGVyaXRcIiwgbnVsbClcbiAgdGhpcy5Db25zdHJ1Y3RvciA9IGJsdWVwcmludC5nZXQoXCJjb25zdHJ1Y3RvclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IuU3VwZXIpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuU3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH1cbiAgICB0aGlzLmNvbnN0cnVjdG9yLmluaXRpYWxpemUodGhpcylcbiAgfSlcbiAgdGhpcy5Db25zdHJ1Y3Rvci5leHRlbmQgPSBmdW5jdGlvbiAoc3VwZXJCbHVlcHJpbnQpIHtcbiAgICBzdXBlckJsdWVwcmludCA9IHN1cGVyQmx1ZXByaW50IHx8IHt9XG4gICAgc3VwZXJCbHVlcHJpbnRbXCJpbmhlcml0XCJdID0gZmFjdG9yeS5Db25zdHJ1Y3RvclxuICAgIHZhciBzdXBlckZhY3RvcnkgPSBuZXcgRmFjdG9yeShzdXBlckJsdWVwcmludCwgZmFjdG9yeSlcbiAgICByZXR1cm4gc3VwZXJGYWN0b3J5LmFzc2VtYmxlKClcbiAgfVxuXG4gIHRoaXMuaW5kdXN0cnkucHVzaCh0aGlzKVxufVxuXG5GYWN0b3J5LnByb3RvdHlwZS5hc3NlbWJsZSA9IGZ1bmN0aW9uKCl7XG4gIHZhciBmYWN0b3J5ID0gdGhpc1xuICB2YXIgYmx1ZXByaW50ID0gdGhpcy5ibHVlcHJpbnRcbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvclxuXG4gIENvbnN0cnVjdG9yLlN1cGVyID0gdGhpcy5TdXBlclxuICBDb25zdHJ1Y3Rvci5ibHVlcHJpbnQgPSBibHVlcHJpbnRcblxuICB0aGlzLmRpZ2VzdCgpXG5cbiAgYmx1ZXByaW50LmJ1aWxkUHJvdG90eXBlKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgYmx1ZXByaW50KVxuICBibHVlcHJpbnQuYnVpbGRDYWNoZShDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIGJsdWVwcmludClcblxuICBDb25zdHJ1Y3Rvci5pbml0aWFsaXplID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgLy92YXIgdG9wID0gZmFjdG9yeS5maW5kRmFjdG9yeShpbnN0YW5jZS5jb25zdHJ1Y3RvcikuYmx1ZXByaW50XG4gICAgdmFyIHRvcCA9IGluc3RhbmNlLmNvbnN0cnVjdG9yLmJsdWVwcmludFxuICAgIGJsdWVwcmludC5idWlsZEluc3RhbmNlKGluc3RhbmNlLCB0b3ApXG4gIH1cblxuICByZXR1cm4gQ29uc3RydWN0b3Jcbn1cblxuRmFjdG9yeS5wcm90b3R5cGUuZGlnZXN0ID0gZnVuY3Rpb24oICApe1xuICB2YXIgZmFjdG9yeSA9IHRoaXNcbiAgdmFyIGJsdWVwcmludCA9IHRoaXMuYmx1ZXByaW50XG4gIHZhciBDb25zdHJ1Y3RvciA9IHRoaXMuQ29uc3RydWN0b3JcbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3IucHJvdG90eXBlXG5cbiAgYmx1ZXByaW50LmRpZ2VzdChcImluaGVyaXRcIiwgZnVuY3Rpb24gKFN1cGVyKSB7XG4gICAgaW5oZXJpdChDb25zdHJ1Y3RvciwgU3VwZXIpXG4gIH0pXG4gIGJsdWVwcmludC5kaWdlc3QoXCJpbmNsdWRlXCIsIGZ1bmN0aW9uIChpbmNsdWRlcykge1xuICAgIGluY2x1ZGUoQ29uc3RydWN0b3IsIGluY2x1ZGVzKVxuICB9KVxuICBibHVlcHJpbnQuZGlnZXN0KFwiYXVnbWVudFwiLCBmdW5jdGlvbiAoYXVnbWVudHMpIHtcbiAgICBhdWdtZW50KENvbnN0cnVjdG9yLCBhdWdtZW50cylcbiAgfSlcbiAgYmx1ZXByaW50LmRpZ2VzdChcInByb3RvdHlwZVwiLCBmdW5jdGlvbiAocHJvdG8pIHtcbiAgICBleHRlbmQoQ29uc3RydWN0b3IsIHByb3RvKVxuICB9KVxuICBibHVlcHJpbnQuZGlnZXN0KFwic3RhdGljXCIsIGZ1bmN0aW9uIChuYW1lLCBtZXRob2QpIHtcbiAgICBDb25zdHJ1Y3RvcltuYW1lXSA9IG1ldGhvZFxuICB9LCB0cnVlKVxuICBibHVlcHJpbnQuZGlnZXN0KFwiYWNjZXNzb3JcIiwgZnVuY3Rpb24oIG5hbWUsIGFjY2VzcyApe1xuICAgIGlmKCAhYWNjZXNzICkgcmV0dXJuXG4gICAgaWYoIHR5cGVvZiBhY2Nlc3MgPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICBkZWZpbmUuZ2V0dGVyKHByb3RvLCBuYW1lLCBhY2Nlc3MpXG4gICAgfVxuICAgIGVsc2UgaWYoIHR5cGVvZiBhY2Nlc3NbXCJnZXRcIl0gPT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBhY2Nlc3NbXCJzZXRcIl0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICBkZWZpbmUuYWNjZXNzb3IocHJvdG8sIG5hbWUsIGFjY2Vzc1tcImdldFwiXSwgYWNjZXNzW1wic2V0XCJdKVxuICAgIH1cbiAgICBlbHNlIGlmKCB0eXBlb2YgYWNjZXNzW1wiZ2V0XCJdID09IFwiZnVuY3Rpb25cIiApe1xuICAgICAgZGVmaW5lLmdldHRlcihwcm90bywgbmFtZSwgYWNjZXNzW1wiZ2V0XCJdKVxuICAgIH1cbiAgICBlbHNlIGlmKCB0eXBlb2YgYWNjZXNzW1wic2V0XCJdID09IFwiZnVuY3Rpb25cIiApe1xuICAgICAgZGVmaW5lLmdldHRlcihwcm90bywgbmFtZSwgYWNjZXNzW1wic2V0XCJdKVxuICAgIH1cbiAgfSwgdHJ1ZSlcbiAgLy9ibHVlcHJpbnQuZGlnZXN0KFwiaW5jbHVkZVwiLCBmdW5jdGlvbiAoaW5jbHVkZXMpIHtcbiAgLy8gIGlmICghQXJyYXkuaXNBcnJheShpbmNsdWRlcykpIHtcbiAgLy8gICAgaW5jbHVkZXMgPSBbaW5jbHVkZXNdXG4gIC8vICB9XG4gIC8vICBpbmNsdWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbmNsdWRlKSB7XG4gIC8vICAgIHZhciBmb3JlaWduID0gZmFjdG9yeS5maW5kRmFjdG9yeShpbmNsdWRlKVxuICAvLyAgICBpZiAoZm9yZWlnbikge1xuICAvLyAgICAgIGZvcmVpZ24uYmx1ZXByaW50LmJ1aWxkKFwicHJvdG90eXBlXCIsIENvbnN0cnVjdG9yLnByb3RvdHlwZSwgYmx1ZXByaW50KVxuICAvLyAgICB9XG4gIC8vICB9KVxuICAvL30pXG59XG5cbkZhY3RvcnkucHJvdG90eXBlLmluZHVzdHJ5ID0gW11cblxuRmFjdG9yeS5wcm90b3R5cGUuZmluZEZhY3RvcnkgPSBmdW5jdGlvbiggQ29uc3RydWN0b3IgKXtcbiAgdmFyIHJldCA9IG51bGxcbiAgdGhpcy5pbmR1c3RyeS5zb21lKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgcmV0dXJuIGZhY3RvcnkuQ29uc3RydWN0b3IgPT09IENvbnN0cnVjdG9yICYmIChyZXQgPSBmYWN0b3J5KVxuICB9KVxuICByZXR1cm4gcmV0XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGF1Z21lbnQgKENsYXNzLCBtaXhpbikge1xuICBpZiAoQXJyYXkuaXNBcnJheShtaXhpbikpIHtcbiAgICBtaXhpbi5mb3JFYWNoKGZ1bmN0aW9uIChtaXhpbikge1xuICAgICAgaWYgKHR5cGVvZiBtaXhpbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgbWl4aW4uY2FsbChDbGFzcy5wcm90b3R5cGUpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIG1peGluID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgbWl4aW4uY2FsbChDbGFzcy5wcm90b3R5cGUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIENsYXNzXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGV4dGVuZCAoQ2xhc3MsIHByb3RvdHlwZSkge1xuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90b3R5cGUpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gXCJjb25zdHJ1Y3RvclwiICkge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDbGFzcy5wcm90b3R5cGUsIG5hbWUsIGRlc2NyaXB0b3IpXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBDbGFzc1xufVxuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuL2V4dGVuZFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluY2x1ZGUgKENsYXNzLCBPdGhlcikge1xuICBpZiAoQXJyYXkuaXNBcnJheShPdGhlcikpIHtcbiAgICBPdGhlci5mb3JFYWNoKGZ1bmN0aW9uIChPdGhlcikge1xuICAgICAgaWYgKHR5cGVvZiBPdGhlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZXh0ZW5kKENsYXNzLCBPdGhlci5wcm90b3R5cGUpXG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgT3RoZXIgPT0gXCJvYmplY3RcIikge1xuICAgICAgICBleHRlbmQoQ2xhc3MsIE90aGVyKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBPdGhlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGV4dGVuZChDbGFzcywgT3RoZXIucHJvdG90eXBlKVxuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgT3RoZXIgPT0gXCJvYmplY3RcIikge1xuICAgICAgZXh0ZW5kKENsYXNzLCBPdGhlcilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQ2xhc3Ncbn1cbiIsInZhciBGYWN0b3J5ID0gcmVxdWlyZShcIi4vRmFjdG9yeVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZhY3RvcnkoIGJsdWVwcmludCApe1xuICByZXR1cm4gbmV3IEZhY3RvcnkoYmx1ZXByaW50KS5hc3NlbWJsZSgpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXQgKENsYXNzLCBCYXNlKSB7XG4gIENsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoQmFzZS5wcm90b3R5cGUpXG4gIENsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENsYXNzXG5cbiAgcmV0dXJuIENsYXNzXG59XG4iLCJ2YXIgZm9ySW4gPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvaW5cIilcbnZhciBjb3B5ID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2NvcHlcIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9FeHRlbnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBDYWNoZUV4dGVuc2lvblxuXG5mdW5jdGlvbiBDYWNoZUV4dGVuc2lvbiAoaW5pdGlhbGl6ZSkge1xuICBFeHRlbnNpb24uY2FsbCh0aGlzLCB7XG4gICAgdHlwZTogXCJjYWNoZVwiLFxuICAgIGluaGVyaXQ6IHRydWUsXG4gICAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZVxuICB9KVxufVxuXG5pbmhlcml0KENhY2hlRXh0ZW5zaW9uLCBFeHRlbnNpb24pXG5cbi8vQ2FjaGVFeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBwcm90b3R5cGUsIGJsb2NrICl7XG4vLyAgaWYgKCF0aGlzLm5hbWUpIHJldHVyblxuLy9cbi8vICB2YXIgY2FjaGUgPSBwcm90b3R5cGVbdGhpcy5uYW1lXSA9IHt9XG4vL1xuLy8gIGlmIChwcm90b3R5cGUuY29uc3RydWN0b3IuU3VwZXIpIHtcbi8vICAgIHZhciBzdXBlckNhY2hlID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yLlN1cGVyLnByb3RvdHlwZVt0aGlzLm5hbWVdXG4vLyAgICBjYWNoZSA9IHByb3RvdHlwZVt0aGlzLm5hbWVdID0gY29weShzdXBlckNhY2hlKVxuLy8gIH1cbi8vXG4vLyAgdmFyIGluaXRpYWxpemUgPSB0aGlzLmluaXRpYWxpemVcbi8vICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4vLyAgICBjYWNoZVtuYW1lXSA9IGluaXRpYWxpemVcbi8vICAgICAgICA/IGluaXRpYWxpemUocHJvdG90eXBlLCBuYW1lLCB2YWx1ZSwgYmxvY2spXG4vLyAgICAgICAgOiB2YWx1ZVxuLy8gIH0pXG4vL31cbiIsInZhciBkZWZhdWx0cyA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9kZWZhdWx0c1wiKVxudmFyIFZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpXG52YXIgU2VsZWN0b3IgPSByZXF1aXJlKFwiLi4vZG9tL1NlbGVjdG9yXCIpXG52YXIgRnJhZ21lbnQgPSByZXF1aXJlKFwiLi4vZG9tL0ZyYWdtZW50XCIpXG52YXIgSW5zdGFuY2VFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9JbnN0YW5jZUV4dGVuc2lvblwiKVxudmFyIENhY2hlRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vQ2FjaGVFeHRlbnNpb25cIilcblxudmFyIEVsZW1lbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXh0ZW5zaW9uczoge1xuICAgIGNoaWxkcmVuOiBuZXcgSW5zdGFuY2VFeHRlbnNpb24oZnVuY3Rpb24oZWxlbWVudCwgbmFtZSwgc2VsZWN0b3Ipe1xuICAgICAgc2VsZWN0b3IgPSBuZXcgU2VsZWN0b3IoZGVmYXVsdHMoc2VsZWN0b3IsIHtcbiAgICAgICAgYXR0cmlidXRlOiBcImRhdGEtZWxlbWVudFwiLFxuICAgICAgICBvcGVyYXRvcjogXCJ+XCIsXG4gICAgICAgIHZhbHVlOiBuYW1lXG4gICAgICB9KSkucHJlZml4KGVsZW1lbnQubmFtZSlcbiAgICAgIHNlbGVjdG9yLmVsZW1lbnQgPSBlbGVtZW50LmVsZW1lbnRcbiAgICAgIGVsZW1lbnQuY2hpbGRyZW5bbmFtZV0gPSBzZWxlY3RvclxuICAgIH0pLFxuICAgIGZyYWdtZW50czogbmV3IENhY2hlRXh0ZW5zaW9uKGZ1bmN0aW9uIChwcm90b3R5cGUsIG5hbWUsIGZyYWdtZW50KSB7XG4gICAgICBpZiAoIShmcmFnbWVudCBpbnN0YW5jZW9mIEZyYWdtZW50KSkge1xuICAgICAgICByZXR1cm4gbmV3IEZyYWdtZW50KGZyYWdtZW50KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyYWdtZW50XG4gICAgfSlcbiAgfSxcbiAgY2hpbGRyZW46IHt9LFxuICBjaGFuZ2VMYXlvdXQ6IHt9LFxuICBldmVudHM6IHt9LFxuICBhdHRyaWJ1dGVzOiB7fSxcbiAgZnJhZ21lbnRzOiB7fSxcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIEVsZW1lbnQoZWxlbWVudCkge1xuICAgIFZpZXcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIEVsZW1lbnQuaW5pdGlhbGl6ZSh0aGlzKVxuICB9LFxuICBwcm90b3R5cGU6IHtcbiAgICBuYW1lOiBcIlwiXG4gIH1cbn0pXG4iLCJ2YXIgZGVsZWdhdGUgPSByZXF1aXJlKFwiLi4vZG9tL2RlbGVnYXRlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRcblxuZnVuY3Rpb24gRXZlbnQgKGV2ZW50KSB7XG4gIGV2ZW50ID0gZXZlbnQgfHwge31cbiAgdGhpcy50eXBlID0gZXZlbnQudHlwZVxuICB0aGlzLnRhcmdldCA9IGV2ZW50LnRhcmdldFxuICB0aGlzLm9uY2UgPSAhIWV2ZW50Lm9uY2VcbiAgdGhpcy5jYXB0dXJlID0gISFldmVudC5jYXB0dXJlXG4gIHRoaXMuaGFuZGxlciA9IGV2ZW50LmhhbmRsZXJcbiAgdGhpcy5wcm94eSA9IGV2ZW50LmhhbmRsZXJcbiAgaWYgKGV2ZW50LnRyYW5zZm9ybSApIHRoaXMudHJhbnNmb3JtID0gZXZlbnQudHJhbnNmb3JtXG59XG5cbkV2ZW50LnByb3RvdHlwZS50cmFuc2Zvcm0gPSBmdW5jdGlvbiAoKSB7fVxuXG5FdmVudC5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCwgY29udGV4dCkge1xuICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICB0aGlzLnByb3h5ID0gZGVsZWdhdGUoe1xuICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgIHRyYW5zZm9ybTogdGhpcy50cmFuc2Zvcm1cbiAgICB9KVxuICAgIHRoaXMucHJveHkubWF0Y2godGhpcy50YXJnZXQsIHRoaXMuaGFuZGxlcilcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodGhpcy5vbmNlKSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLmhhbmRsZXIsIHRoaXMuY2FwdHVyZSlcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLmhhbmRsZXIsIHRoaXMuY2FwdHVyZSlcbiAgICB9XG4gIH1cbn1cblxuRXZlbnQucHJvdG90eXBlLnVuUmVnaXN0ZXIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICBpZiAodGhpcy5wcm94eSkge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMucHJveHksIHRoaXMuY2FwdHVyZSlcbiAgfVxuICBlbHNlIHtcbiAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLmhhbmRsZXIsIHRoaXMuY2FwdHVyZSlcbiAgfVxufVxuIiwidmFyIGZvckluID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2luXCIpXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCIuLy4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuLy4uL2ZhY3RvcnkvRXh0ZW5zaW9uXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gSW5zdGFuY2VFeHRlbnNpb25cblxuZnVuY3Rpb24gSW5zdGFuY2VFeHRlbnNpb24gKGluaXRpYWxpemUpIHtcbiAgRXh0ZW5zaW9uLmNhbGwodGhpcywge1xuICAgIHR5cGU6IFwiaW5zdGFuY2VcIixcbiAgICBpbmhlcml0OiB0cnVlLFxuICAgIGluaXRpYWxpemU6IGluaXRpYWxpemVcbiAgfSlcbn1cblxuaW5oZXJpdChJbnN0YW5jZUV4dGVuc2lvbiwgRXh0ZW5zaW9uKVxuXG4vL0luc3RhbmNlRXh0ZW5zaW9uLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiggaW5zdGFuY2UsIGJsb2NrICl7XG4vLyAgdmFyIGluaXRpYWxpemUgPSB0aGlzLmluaXRpYWxpemVcbi8vICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4vLyAgICBpbml0aWFsaXplKGluc3RhbmNlLCBuYW1lLCB2YWx1ZSwgYmxvY2spXG4vLyAgfSlcbi8vfVxuIiwidmFyIGZvckluID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2luXCIpXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCIuLy4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuLy4uL2ZhY3RvcnkvRXh0ZW5zaW9uXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvdG90eXBlRXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIFByb3RvdHlwZUV4dGVuc2lvbiAoaW5pdGlhbGl6ZSkge1xuICBFeHRlbnNpb24uY2FsbCh0aGlzLCB7XG4gICAgdHlwZTogXCJwcm90b3R5cGVcIixcbiAgICBpbmhlcml0OiBmYWxzZSxcbiAgICBpbml0aWFsaXplOiBpbml0aWFsaXplXG4gIH0pXG59XG5cbmluaGVyaXQoUHJvdG90eXBlRXh0ZW5zaW9uLCBFeHRlbnNpb24pXG5cbi8vUHJvdG90eXBlRXh0ZW5zaW9uLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiggcHJvdG90eXBlLCBibG9jayApe1xuLy8gIHZhciBpbml0aWFsaXplID0gdGhpcy5pbml0aWFsaXplXG4vLyAgZm9ySW4oYmxvY2ssIGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApe1xuLy8gICAgaW5pdGlhbGl6ZShwcm90b3R5cGUsIG5hbWUsIHZhbHVlLCBibG9jaylcbi8vICB9KVxuLy99XG4iLCJ2YXIgZGVmYXVsdHMgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmYXVsdHNcIilcbnZhciBWaWV3ID0gcmVxdWlyZShcIi4vVmlld1wiKVxudmFyIFNlbGVjdG9yID0gcmVxdWlyZShcIi4uL2RvbS9TZWxlY3RvclwiKVxudmFyIEluc3RhbmNlRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vSW5zdGFuY2VFeHRlbnNpb25cIilcblxudmFyIFJlZ2lvbiA9IG1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICBleHRlbnNpb25zOiB7XG4gICAgY2hpbGRyZW46IG5ldyBJbnN0YW5jZUV4dGVuc2lvbihmdW5jdGlvbihyZWdpb24sIG5hbWUsIHNlbGVjdG9yKXtcbiAgICAgIHNlbGVjdG9yID0gbmV3IFNlbGVjdG9yKGRlZmF1bHRzKHNlbGVjdG9yLCB7XG4gICAgICAgIGF0dHJpYnV0ZTogXCJkYXRhLWVsZW1lbnRcIixcbiAgICAgICAgb3BlcmF0b3I6IFwiflwiLFxuICAgICAgICB2YWx1ZTogbmFtZVxuICAgICAgfSkpXG4gICAgICBzZWxlY3Rvci5lbGVtZW50ID0gcmVnaW9uLmVsZW1lbnRcbiAgICAgIHJlZ2lvbi5jaGlsZHJlbltuYW1lXSA9IHNlbGVjdG9yXG4gICAgfSlcbiAgfSxcbiAgY2hpbGRyZW46IHt9LFxuICBsYXlvdXRzOiB7fSxcbiAgZXZlbnRzOiB7fSxcbiAgYXR0cmlidXRlczoge1xuICAgIHZpc2libGU6IGZhbHNlLFxuICAgIGZvY3VzZWQ6IGZhbHNlXG4gIH0sXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBSZWdpb24oZWxlbWVudCkge1xuICAgIFZpZXcuY2FsbCh0aGlzLCBlbGVtZW50KVxuICAgIFJlZ2lvbi5pbml0aWFsaXplKHRoaXMpXG4gIH0sXG4gIHByb3RvdHlwZToge1xuICAgIG5hbWU6IFwiXCJcbiAgfVxufSlcbiIsInZhciBkZWZhdWx0cyA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9kZWZhdWx0c1wiKVxudmFyIFZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpXG52YXIgUmVnaW9uID0gcmVxdWlyZShcIi4vUmVnaW9uXCIpXG52YXIgU2VsZWN0b3IgPSByZXF1aXJlKFwiLi4vZG9tL1NlbGVjdG9yXCIpXG52YXIgaW5oZXJpdCA9IHJlcXVpcmUoXCIuLi9mYWN0b3J5L2luaGVyaXRcIilcbnZhciBJbnN0YW5jZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0luc3RhbmNlRXh0ZW5zaW9uXCIpXG5cbnZhciBTY3JlZW4gPSBtb2R1bGUuZXhwb3J0cyA9IFZpZXcuZXh0ZW5kKHtcbiAgZXh0ZW5zaW9uczoge1xuICAgIHJlZ2lvbnM6IG5ldyBJbnN0YW5jZUV4dGVuc2lvbihmdW5jdGlvbiAoc2NyZWVuLCBuYW1lLCBzZWxlY3Rvcikge1xuICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgc2VsZWN0b3IgPSB7Q29uc3RydWN0b3I6IHNlbGVjdG9yfVxuICAgICAgfVxuICAgICAgc2VsZWN0b3IgPSBuZXcgU2VsZWN0b3IoZGVmYXVsdHMoc2VsZWN0b3IsIHtcbiAgICAgICAgYXR0cmlidXRlOiBcImRhdGEtcmVnaW9uXCIsXG4gICAgICAgIG9wZXJhdG9yOiBcIj1cIixcbiAgICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICAgIENvbnN0cnVjdG9yOiBSZWdpb25cbiAgICAgIH0pKVxuICAgICAgc2VsZWN0b3IuZWxlbWVudCA9IHNjcmVlbi5lbGVtZW50XG4gICAgICBzY3JlZW4ucmVnaW9uc1tuYW1lXSA9IHNlbGVjdG9yXG4gICAgfSlcbiAgfSxcbiAgcmVnaW9uczoge30sXG4gIGNoYW5nZUxheW91dDoge30sXG4gIGV2ZW50czoge30sXG4gIGF0dHJpYnV0ZXM6IHt9LFxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gU2NyZWVuKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBkb2N1bWVudC5ib2R5XG4gICAgZWxlbWVudCA9IHRoaXMuc2VsZWN0b3Iuc2VsZWN0KGVsZW1lbnQpXG4gICAgVmlldy5jYWxsKHRoaXMsIGVsZW1lbnQpXG4gICAgdGhpcy5yZWdpb25zID0ge31cbiAgICBTY3JlZW4uaW5pdGlhbGl6ZSh0aGlzKVxuICB9LFxuICBwcm90b3R5cGU6IHtcbiAgICBzZWxlY3RvcjogbmV3IFNlbGVjdG9yKHthdHRyaWJ1dGU6IFwiZGF0YS1zY3JlZW5cIn0pXG4gIH1cbn0pXG4iLCJ2YXIgZGVmaW5lID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmluZVwiKVxudmFyIGRlZmF1bHRzID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmF1bHRzXCIpXG52YXIgZmFjdG9yeSA9IHJlcXVpcmUoXCIuLi9mYWN0b3J5XCIpXG52YXIgRXZlbnQgPSByZXF1aXJlKFwiLi9FdmVudFwiKVxudmFyIGF0dHJpYnV0ZXMgPSByZXF1aXJlKFwiLi4vYXR0cmlidXRlc1wiKVxudmFyIGRvbUF0dHJpYnV0ZXMgPSByZXF1aXJlKFwiLi4vZG9tL2F0dHJpYnV0ZXNcIilcbnZhciBQcm90b3R5cGVFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9Qcm90b3R5cGVFeHRlbnNpb25cIilcbnZhciBJbnN0YW5jZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0luc3RhbmNlRXh0ZW5zaW9uXCIpXG52YXIgQ2FjaGVFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9DYWNoZUV4dGVuc2lvblwiKVxuXG52YXIgVmlldyA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSh7XG4gICdzdGF0aWMnOiB7fSxcblxuICBleHRlbnNpb25zOiB7XG4gICAgbGF5b3V0czogbmV3IENhY2hlRXh0ZW5zaW9uKGZ1bmN0aW9uIChwcm90b3R5cGUsIG5hbWUsIGxheW91dEhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBsYXlvdXRIYW5kbGVyXG4gICAgfSksXG4gICAgZXZlbnRzOiBuZXcgSW5zdGFuY2VFeHRlbnNpb24oZnVuY3Rpb24gKHZpZXcsIG5hbWUsIGV2ZW50KSB7XG4gICAgICBpZiAoIShldmVudCBpbnN0YW5jZW9mIEV2ZW50KSkge1xuICAgICAgICBldmVudCA9IG5ldyBFdmVudChldmVudClcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZXZlbnQuaGFuZGxlciA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGV2ZW50LmhhbmRsZXIgPSB2aWV3W2V2ZW50LmhhbmRsZXJdLmJpbmQodmlldylcbiAgICAgIH1cbiAgICAgIGV2ZW50LnJlZ2lzdGVyKHZpZXcuZWxlbWVudCwgdGhpcylcbiAgICB9KSxcbiAgICBhdHRyaWJ1dGVzOiBuZXcgUHJvdG90eXBlRXh0ZW5zaW9uKGZ1bmN0aW9uIChwcm90b3R5cGUsIG5hbWUsIGF0dHJpYnV0ZSkge1xuICAgICAgaWYgKCEoYXR0cmlidXRlIGluc3RhbmNlb2YgYXR0cmlidXRlcy5BdHRyaWJ1dGUpKSB7XG4gICAgICAgIGF0dHJpYnV0ZSA9IGRvbUF0dHJpYnV0ZXMuY3JlYXRlKGF0dHJpYnV0ZSlcbiAgICAgIH1cblxuICAgICAgYXR0cmlidXRlLm5hbWUgPSBhdHRyaWJ1dGUubmFtZSB8fCBuYW1lXG4gICAgICBhdHRyaWJ1dGUuZGVmaW5lUHJvcGVydHkocHJvdG90eXBlLCBuYW1lLCBmdW5jdGlvbiAodmlldykge1xuICAgICAgICByZXR1cm4gdmlldy5lbGVtZW50XG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgbGF5b3V0czoge30sXG4gIGV2ZW50czoge30sXG4gIGF0dHJpYnV0ZXM6IHt9LFxuXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBWaWV3KCBlbGVtZW50ICl7XG4gICAgdGhpcy5jdXJyZW50TGF5b3V0ID0gXCJcIlxuICAgIC8vdGhpcy5sYXlvdXRzID0ge31cbiAgICB0aGlzLmNoaWxkcmVuID0ge31cbiAgICB0aGlzLl9lbGVtZW50ID0gbnVsbFxuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICBWaWV3LmluaXRpYWxpemUodGhpcylcbiAgfSxcblxuICBhY2Nlc3Nvcjoge1xuICAgIGVsZW1lbnQ6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxlbWVudFxuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gdGhpcy5fZWxlbWVudFxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZWxlbWVudFxuICAgICAgICB0aGlzLm9uRWxlbWVudENoYW5nZShlbGVtZW50LCBwcmV2aW91cylcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJvdG90eXBlOiB7XG4gICAgb25FbGVtZW50Q2hhbmdlOiBmdW5jdGlvbiAoZWxlbWVudCwgcHJldmlvdXMpIHt9LFxuICAgIG9uTGF5b3V0Q2hhbmdlOiBmdW5jdGlvbiAobGF5b3V0LCBwcmV2aW91cykge30sXG4gICAgY2hhbmdlTGF5b3V0OiBmdW5jdGlvbiggbGF5b3V0ICl7XG4gICAgICBpZiAodGhpcy5jdXJyZW50TGF5b3V0ID09IGxheW91dCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgIH1cblxuICAgICAgdmFyIGxheW91dEhhbmRsZXIgPSB0aGlzLmxheW91dHNbbGF5b3V0XVxuICAgICAgaWYgKCFsYXlvdXRIYW5kbGVyKSByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiTWlzc2luZyBsYXlvdXQgaGFuZGxlcjogXCIgKyBsYXlvdXQpKVxuXG4gICAgICB2YXIgdmlldyA9IHRoaXNcbiAgICAgIHZhciBwcmV2aW91cyA9IHZpZXcuY3VycmVudExheW91dFxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwcmV2aW91cykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBsYXlvdXRIYW5kbGVyLmNhbGwodmlldywgcHJldmlvdXMpXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmlldy5jdXJyZW50TGF5b3V0ID0gbGF5b3V0XG4gICAgICAgIHZpZXcub25MYXlvdXRDaGFuZ2UobGF5b3V0LCBwcmV2aW91cylcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkaXNwYXRjaDogZnVuY3Rpb24gKHR5cGUsIGRldGFpbCwgZGVmKSB7XG4gICAgICB2YXIgZGVmaW5pdGlvbiA9IGRlZmF1bHRzKGRlZiwge1xuICAgICAgICBkZXRhaWw6IGRldGFpbCB8fCBudWxsLFxuICAgICAgICB2aWV3OiB3aW5kb3csXG4gICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgIGNhbmNlbGFibGU6IHRydWVcbiAgICAgIH0pXG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IHdpbmRvdy5DdXN0b21FdmVudCh0eXBlLCBkZWZpbml0aW9uKSlcbiAgICB9XG4gIH1cbn0pXG4iLCJ2YXIgdWkgPSBtb2R1bGUuZXhwb3J0cyA9IHt9XG5cbnVpLlNjcmVlbiA9IHJlcXVpcmUoXCIuL1NjcmVlblwiKVxudWkuUmVnaW9uID0gcmVxdWlyZShcIi4vUmVnaW9uXCIpXG51aS5FbGVtZW50ID0gcmVxdWlyZShcIi4vRWxlbWVudFwiKVxudWkuVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIilcbiJdfQ==
