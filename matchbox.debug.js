(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.matchbox = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var matchbox = module.exports = {}

matchbox.factory = require("./src/factory")
matchbox.ui = require("./src/ui")
matchbox.dom = require("./src/dom")

},{"./src/dom":14,"./src/factory":21,"./src/ui":31}],2:[function(require,module,exports){
'use strict';
module.exports = function () {
	var str = [].map.call(arguments, function (str) {
		return str.trim();
	}).filter(function (str) {
		return str.length;
	}).join('-');

	if (!str.length) {
		return '';
	}

	if (str.length === 1 || !(/[_.\- ]+/).test(str) ) {
		if (str[0] === str[0].toLowerCase() && str.slice(1) !== str.slice(1).toLowerCase()) {
			return str;
		}

		return str.toLowerCase();
	}

	return str
	.replace(/^[_.\- ]+/, '')
	.toLowerCase()
	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
};

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var extend = require("./extend")

module.exports = function (obj) {
  return extend({}, obj)
}

},{"./extend":7}],5:[function(require,module,exports){
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

},{"./copy":4}],6:[function(require,module,exports){
var Descriptor = require("./Descriptor")

module.exports = new Descriptor()

},{"./Descriptor":3}],7:[function(require,module,exports){
module.exports = function extend( obj, extension ){
  for( var name in extension ){
    if( extension.hasOwnProperty(name) ) obj[name] = extension[name]
  }
  return obj
}

},{}],8:[function(require,module,exports){
module.exports = function( obj, callback ){
  for( var prop in obj ){
    if( obj.hasOwnProperty(prop) ){
      callback(prop, obj[prop], obj)
    }
  }
  return obj
}

},{}],9:[function(require,module,exports){
var extend = require("./extend")

module.exports = function( obj, extension ){
  return extend(extend({}, obj), extension)
}

},{"./extend":7}],10:[function(require,module,exports){
var inherit = require("../factory/inherit")
var Attribute = require("../util/Attribute")

module.exports = DomAttribute

function DomAttribute (def) {
  Attribute.call(this, def)
  def = def || {}
  this.useData = def.useData || false
}

inherit(DomAttribute, Attribute)


DomAttribute.prototype.getAttribute = function( element, name ){
  name = this.useData ? "data-" + name : name
  return element.getAttribute(name)
}
DomAttribute.prototype.setAttribute = function( element, name, value ){
  name = this.useData ? "data-" + name : name
  return element.setAttribute(name, value)
}
DomAttribute.prototype.hasAttribute = function( element, name ){
  name = this.useData ? "data-" + name : name
  return element.hasAttribute(name)
}
DomAttribute.prototype.removeAttribute = function( element, name ){
  name = this.useData ? "data-" + name : name
  return element.removeAttribute(name)
}

},{"../factory/inherit":22,"../util/Attribute":32}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./Selector":12}],14:[function(require,module,exports){
var dom = module.exports = {}

dom.delegate = require("./delegate")
dom.Selector = require("./Selector")

},{"./Selector":12,"./delegate":13}],15:[function(require,module,exports){
var merge = require("matchbox-util/object/merge")
var forIn = require("matchbox-util/object/in")
var Extension = require("./Extension")

module.exports = Blueprint

function Blueprint( blocks, parent ){
  var blueprint = this

  this.blocks = merge(blocks)
  this.parent = parent
  //this.extensions = this.get("extensions", {})

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
  //if (this.parent) {
  //  this.parent.buildPrototype(prototype, top)
  //}
  this.build("prototype", this.globalExtensions, top, function (name, extension, block) {
    forIn(block, function( name, value ){
      extension.initialize(prototype, name, value)
    })
  })
}

Blueprint.prototype.buildCache = function( prototype, top ){
  //if (this.parent) {
  //  this.parent.buildCache(prototype, top)
  //}
  this.build("cache", this.globalExtensions, top, function (name, extension, block) {
    if (!prototype.hasOwnProperty(name)) {
      prototype[name] = {}
    }
    //if (prototype.constructor.Super) {
    //  var superCache = prototype.constructor.Super.prototype[name]
    //  prototype[name] = merge(prototype[name], superCache)
    //}

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
  this.build("instance", this.globalExtensions, top, function (name, extension, block) {
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

//Blueprint.prototype.build = function( type, extensions top, context, ){
//  var blueprint = top || this
//  forIn(extensions, function (name, extension) {
//    if( extension.type != type ) return
//
//    var block = blueprint.get(name)
//    if( !block ) return
//
//    extension.use(context, block)
//  })
//}

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

},{"./Extension":16,"matchbox-util/object/in":8,"matchbox-util/object/merge":9}],16:[function(require,module,exports){
module.exports = Extension

function Extension(extension){
  extension = extension || {}
  this.name = ""
  this.type = extension.type || "instance"
  this.inherit = extension.inherit || false
  this.initialize = extension.initialize || null
}

//Extension.prototype.use = function( context, block ){}

},{}],17:[function(require,module,exports){
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

},{"./Blueprint":15,"./augment":18,"./extend":19,"./include":20,"./inherit":22,"matchbox-util/object/define":6}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
module.exports = function extend (Class, prototype) {
  Object.getOwnPropertyNames(prototype).forEach(function (name) {
    if (name !== "constructor" ) {
      var descriptor = Object.getOwnPropertyDescriptor(prototype, name)
      Object.defineProperty(Class.prototype, name, descriptor)
    }
  })

  return Class
}

},{}],20:[function(require,module,exports){
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

},{"./extend":19}],21:[function(require,module,exports){
var Factory = require("./Factory")

module.exports = function factory( blueprint ){
  return new Factory(blueprint).assemble()
}

},{"./Factory":17}],22:[function(require,module,exports){
module.exports = function inherit (Class, Base) {
  Class.prototype = Object.create(Base.prototype)
  Class.prototype.constructor = Class

  return Class
}

},{}],23:[function(require,module,exports){
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

},{"./../factory/Extension":16,"./../factory/inherit":22,"matchbox-util/object/copy":4,"matchbox-util/object/in":8}],24:[function(require,module,exports){
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

},{"../dom/Fragment":11,"../dom/Selector":12,"./CacheExtension":23,"./InstanceExtension":26,"./View":30,"matchbox-util/object/defaults":5}],25:[function(require,module,exports){
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

},{"../dom/delegate":13}],26:[function(require,module,exports){
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

},{"./../factory/Extension":16,"./../factory/inherit":22,"matchbox-util/object/in":8}],27:[function(require,module,exports){
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

},{"./../factory/Extension":16,"./../factory/inherit":22,"matchbox-util/object/in":8}],28:[function(require,module,exports){
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

},{"../dom/Selector":12,"./InstanceExtension":26,"./View":30,"matchbox-util/object/defaults":5}],29:[function(require,module,exports){
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

},{"../dom/Selector":12,"../factory/inherit":22,"./InstanceExtension":26,"./Region":28,"./View":30,"matchbox-util/object/defaults":5}],30:[function(require,module,exports){
var define = require("matchbox-util/object/define")
var defaults = require("matchbox-util/object/defaults")
var factory = require("../factory")
var Event = require("./Event")
var Attribute = require("../dom/DomAttribute")
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
      if (!(attribute instanceof Attribute)) {
        attribute = new Attribute(attribute)
      }

      define.accessor(prototype, name, getter, setter)
      function getter () {
        return attribute.get(this.element)
      }
      function setter (value) {
        return attribute.set(this.element, value)
      }
    })
  },

  layouts: {
    'default': function () {

    }
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

      var role = this
      var previous = role.currentLayout
      return Promise.resolve(previous).then(function () {
        return layoutHandler.call(role, previous)
      }).then(function () {
        role.currentLayout = layout
        role.onLayoutChange(layout, previous)
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

},{"../dom/DomAttribute":10,"../factory":21,"./CacheExtension":23,"./Event":25,"./InstanceExtension":26,"./PrototypeExtension":27,"matchbox-util/object/defaults":5,"matchbox-util/object/define":6}],31:[function(require,module,exports){
var ui = module.exports = {}

ui.Screen = require("./Screen")
ui.Region = require("./Region")
ui.Element = require("./Element")
ui.View = require("./View")

},{"./Element":24,"./Region":28,"./Screen":29,"./View":30}],32:[function(require,module,exports){
var camelcase = require("camelcase")

module.exports = Attribute

function Attribute( def ){
  var typeOfDef = typeof def
  var type
  var defaultValue
  var hasDefault

  switch( typeOfDef ){
    // primitive value
    case "boolean":
    case "number":
    case "string":
      type = typeOfDef
      defaultValue = def
      hasDefault = true
      def = {}
      break
    // definition object
    case "object":
    case "undefined":
    default:
      def = def || {}
      defaultValue = def["default"]
      hasDefault = defaultValue != null

      if( typeof def["type"] == "undefined" ){
        type = hasDefault ? typeof defaultValue : "string";
      }
      else {
        type = def["type"]
      }
  }

  var shouldRemove = function( value ){ return value == null }
  var parseValue
  var stringifyValue

  switch( type ){
    case "boolean":
      shouldRemove = function( value ){ return value === false }
      parseValue = function( value ){ return value != null }
      stringifyValue = function(){ return "" }
      break
    case "number":
      parseValue = function( value ){ return value == null ? null : parseInt(value, 10) }
      break
    case "float":
      parseValue = function( value ){ return value == null ? null : parseFloat(value) }
      break
    case "string":
    default:
      stringifyValue = function( value ){ return value == null ? null : value ? "" + value : "" }
  }

  this.type = type
  this.defaultValue = defaultValue
  this.shouldRemove = shouldRemove
  this.hasDefault = hasDefault
  this.parseValue = parseValue
  this.stringifyValue = stringifyValue
  this.name = def["name"]
  this.getter = def["get"]
  this.setter = def["set"]
  this.onchange = def["onchange"]
}

Attribute.prototype.getAttribute = function( context, name ){}
Attribute.prototype.setAttribute = function( context, name, value ){}
Attribute.prototype.hasAttribute = function( context, name ){}
Attribute.prototype.removeAttribute = function( context, name ){}

Attribute.prototype.get = function( context, useDefault ){
  if( this.getter ){
    return this.getter.call(context)
  }

  var value = this.getAttribute(context, this.name)
  if( value == null && useDefault == true ){
    return this.defaultValue
  }
  return this.parseValue ? this.parseValue(value) : value
}

Attribute.prototype.set = function( context, value, callOnchange ){
  if( this.setter ){
    this.setter.call(context)
    return
  }

  var old = this.get(context, false)
  if( this.shouldRemove(value) ){
    this.removeAttribute(context, this.name)
  }
  else if( old === value ){
    return
  }
  else {
    var newValue = this.stringifyValue ? this.stringifyValue(value) : value
    this.setAttribute(context, this.name, newValue)
  }
  this.onchange && callOnchange != false && this.onchange.call(context, old, value)
}

},{"camelcase":2}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jYW1lbGNhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvRGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9jb3B5LmpzIiwibm9kZV9tb2R1bGVzL21hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmF1bHRzLmpzIiwibm9kZV9tb2R1bGVzL21hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXRjaGJveC11dGlsL29iamVjdC9leHRlbmQuanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvaW4uanMiLCJub2RlX21vZHVsZXMvbWF0Y2hib3gtdXRpbC9vYmplY3QvbWVyZ2UuanMiLCJzcmMvZG9tL0RvbUF0dHJpYnV0ZS5qcyIsInNyYy9kb20vRnJhZ21lbnQuanMiLCJzcmMvZG9tL1NlbGVjdG9yLmpzIiwic3JjL2RvbS9kZWxlZ2F0ZS5qcyIsInNyYy9kb20vaW5kZXguanMiLCJzcmMvZmFjdG9yeS9CbHVlcHJpbnQuanMiLCJzcmMvZmFjdG9yeS9FeHRlbnNpb24uanMiLCJzcmMvZmFjdG9yeS9GYWN0b3J5LmpzIiwic3JjL2ZhY3RvcnkvYXVnbWVudC5qcyIsInNyYy9mYWN0b3J5L2V4dGVuZC5qcyIsInNyYy9mYWN0b3J5L2luY2x1ZGUuanMiLCJzcmMvZmFjdG9yeS9pbmRleC5qcyIsInNyYy9mYWN0b3J5L2luaGVyaXQuanMiLCJzcmMvdWkvQ2FjaGVFeHRlbnNpb24uanMiLCJzcmMvdWkvRWxlbWVudC5qcyIsInNyYy91aS9FdmVudC5qcyIsInNyYy91aS9JbnN0YW5jZUV4dGVuc2lvbi5qcyIsInNyYy91aS9Qcm90b3R5cGVFeHRlbnNpb24uanMiLCJzcmMvdWkvUmVnaW9uLmpzIiwic3JjL3VpL1NjcmVlbi5qcyIsInNyYy91aS9WaWV3LmpzIiwic3JjL3VpL2luZGV4LmpzIiwic3JjL3V0aWwvQXR0cmlidXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBtYXRjaGJveCA9IG1vZHVsZS5leHBvcnRzID0ge31cblxubWF0Y2hib3guZmFjdG9yeSA9IHJlcXVpcmUoXCIuL3NyYy9mYWN0b3J5XCIpXG5tYXRjaGJveC51aSA9IHJlcXVpcmUoXCIuL3NyYy91aVwiKVxubWF0Y2hib3guZG9tID0gcmVxdWlyZShcIi4vc3JjL2RvbVwiKVxuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzdHIgPSBbXS5tYXAuY2FsbChhcmd1bWVudHMsIGZ1bmN0aW9uIChzdHIpIHtcblx0XHRyZXR1cm4gc3RyLnRyaW0oKTtcblx0fSkuZmlsdGVyKGZ1bmN0aW9uIChzdHIpIHtcblx0XHRyZXR1cm4gc3RyLmxlbmd0aDtcblx0fSkuam9pbignLScpO1xuXG5cdGlmICghc3RyLmxlbmd0aCkge1xuXHRcdHJldHVybiAnJztcblx0fVxuXG5cdGlmIChzdHIubGVuZ3RoID09PSAxIHx8ICEoL1tfLlxcLSBdKy8pLnRlc3Qoc3RyKSApIHtcblx0XHRpZiAoc3RyWzBdID09PSBzdHJbMF0udG9Mb3dlckNhc2UoKSAmJiBzdHIuc2xpY2UoMSkgIT09IHN0ci5zbGljZSgxKS50b0xvd2VyQ2FzZSgpKSB7XG5cdFx0XHRyZXR1cm4gc3RyO1xuXHRcdH1cblxuXHRcdHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcblx0fVxuXG5cdHJldHVybiBzdHJcblx0LnJlcGxhY2UoL15bXy5cXC0gXSsvLCAnJylcblx0LnRvTG93ZXJDYXNlKClcblx0LnJlcGxhY2UoL1tfLlxcLSBdKyhcXHd8JCkvZywgZnVuY3Rpb24gKG0sIHAxKSB7XG5cdFx0cmV0dXJuIHAxLnRvVXBwZXJDYXNlKCk7XG5cdH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gRGVzY3JpcHRvclxuXG52YXIgX3dyaXRhYmxlID0gXCJfd3JpdGFibGVcIlxudmFyIF9lbnVtZXJhYmxlID0gXCJfZW51bWVyYWJsZVwiXG52YXIgX2NvbmZpZ3VyYWJsZSA9IFwiX2NvbmZpZ3VyYWJsZVwiXG5cbmZ1bmN0aW9uIERlc2NyaXB0b3IoIHdyaXRhYmxlLCBlbnVtZXJhYmxlLCBjb25maWd1cmFibGUgKXtcbiAgdGhpcy52YWx1ZSh0aGlzLCBfd3JpdGFibGUsIHdyaXRhYmxlIHx8IGZhbHNlKVxuICB0aGlzLnZhbHVlKHRoaXMsIF9lbnVtZXJhYmxlLCBlbnVtZXJhYmxlIHx8IGZhbHNlKVxuICB0aGlzLnZhbHVlKHRoaXMsIF9jb25maWd1cmFibGUsIGNvbmZpZ3VyYWJsZSB8fCBmYWxzZSlcblxuICB0aGlzLmdldHRlcih0aGlzLCBcIndcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy53cml0YWJsZSB9KVxuICB0aGlzLmdldHRlcih0aGlzLCBcIndyaXRhYmxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERlc2NyaXB0b3IodHJ1ZSwgZW51bWVyYWJsZSwgY29uZmlndXJhYmxlKVxuICB9KVxuXG4gIHRoaXMuZ2V0dGVyKHRoaXMsIFwiZVwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLmVudW1lcmFibGUgfSlcbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJlbnVtZXJhYmxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERlc2NyaXB0b3Iod3JpdGFibGUsIHRydWUsIGNvbmZpZ3VyYWJsZSlcbiAgfSlcblxuICB0aGlzLmdldHRlcih0aGlzLCBcImNcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5jb25maWd1cmFibGUgfSlcbiAgdGhpcy5nZXR0ZXIodGhpcywgXCJjb25maWd1cmFibGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRGVzY3JpcHRvcih3cml0YWJsZSwgZW51bWVyYWJsZSwgdHJ1ZSlcbiAgfSlcbn1cblxuRGVzY3JpcHRvci5wcm90b3R5cGUgPSB7XG4gIGFjY2Vzc29yOiBmdW5jdGlvbiggb2JqLCBuYW1lLCBnZXR0ZXIsIHNldHRlciApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IHRoaXNbX2VudW1lcmFibGVdLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgZ2V0OiBnZXR0ZXIsXG4gICAgICBzZXQ6IHNldHRlclxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgZ2V0dGVyOiBmdW5jdGlvbiggb2JqLCBuYW1lLCBmbiApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IHRoaXNbX2VudW1lcmFibGVdLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgZ2V0OiBmblxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgc2V0dGVyOiBmdW5jdGlvbiggb2JqLCBuYW1lLCBmbiApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IHRoaXNbX2VudW1lcmFibGVdLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgc2V0OiBmblxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcbiAgdmFsdWU6IGZ1bmN0aW9uKCBvYmosIG5hbWUsIHZhbHVlICl7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgd3JpdGFibGU6IHRoaXNbX3dyaXRhYmxlXSxcbiAgICAgIGVudW1lcmFibGU6IHRoaXNbX2VudW1lcmFibGVdLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuICBtZXRob2Q6IGZ1bmN0aW9uKCBvYmosIG5hbWUsIGZuICl7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgbmFtZSwge1xuICAgICAgd3JpdGFibGU6IHRoaXNbX3dyaXRhYmxlXSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiB0aGlzW19jb25maWd1cmFibGVdLFxuICAgICAgdmFsdWU6IGZuXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuICBwcm9wZXJ0eTogZnVuY3Rpb24oIG9iaiwgbmFtZSwgdmFsdWUgKXtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBuYW1lLCB7XG4gICAgICB3cml0YWJsZTogdGhpc1tfd3JpdGFibGVdLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IHRoaXNbX2NvbmZpZ3VyYWJsZV0sXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0sXG4gIGNvbnN0YW50OiBmdW5jdGlvbiggb2JqLCBuYW1lLCB2YWx1ZSApe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIG5hbWUsIHtcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiB2YWx1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwidmFyIGV4dGVuZCA9IHJlcXVpcmUoXCIuL2V4dGVuZFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIGV4dGVuZCh7fSwgb2JqKVxufVxuIiwidmFyIGNvcHkgPSByZXF1aXJlKFwiLi9jb3B5XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmYXVsdHMgKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybiBjb3B5KGRlZmF1bHRzKVxuICB9XG5cbiAgdmFyIG9iaiA9IGNvcHkob3B0aW9ucylcblxuICBmb3IgKHZhciBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgaWYgKGRlZmF1bHRzLmhhc093blByb3BlcnR5KHByb3ApICYmICFvcHRpb25zLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICBvYmpbcHJvcF0gPSBkZWZhdWx0c1twcm9wXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmpcbn1cbiIsInZhciBEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4vRGVzY3JpcHRvclwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEZXNjcmlwdG9yKClcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKCBvYmosIGV4dGVuc2lvbiApe1xuICBmb3IoIHZhciBuYW1lIGluIGV4dGVuc2lvbiApe1xuICAgIGlmKCBleHRlbnNpb24uaGFzT3duUHJvcGVydHkobmFtZSkgKSBvYmpbbmFtZV0gPSBleHRlbnNpb25bbmFtZV1cbiAgfVxuICByZXR1cm4gb2JqXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBvYmosIGNhbGxiYWNrICl7XG4gIGZvciggdmFyIHByb3AgaW4gb2JqICl7XG4gICAgaWYoIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSApe1xuICAgICAgY2FsbGJhY2socHJvcCwgb2JqW3Byb3BdLCBvYmopXG4gICAgfVxuICB9XG4gIHJldHVybiBvYmpcbn1cbiIsInZhciBleHRlbmQgPSByZXF1aXJlKFwiLi9leHRlbmRcIilcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggb2JqLCBleHRlbnNpb24gKXtcbiAgcmV0dXJuIGV4dGVuZChleHRlbmQoe30sIG9iaiksIGV4dGVuc2lvbilcbn1cbiIsInZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEF0dHJpYnV0ZSA9IHJlcXVpcmUoXCIuLi91dGlsL0F0dHJpYnV0ZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IERvbUF0dHJpYnV0ZVxuXG5mdW5jdGlvbiBEb21BdHRyaWJ1dGUgKGRlZikge1xuICBBdHRyaWJ1dGUuY2FsbCh0aGlzLCBkZWYpXG4gIGRlZiA9IGRlZiB8fCB7fVxuICB0aGlzLnVzZURhdGEgPSBkZWYudXNlRGF0YSB8fCBmYWxzZVxufVxuXG5pbmhlcml0KERvbUF0dHJpYnV0ZSwgQXR0cmlidXRlKVxuXG5cbkRvbUF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24oIGVsZW1lbnQsIG5hbWUgKXtcbiAgbmFtZSA9IHRoaXMudXNlRGF0YSA/IFwiZGF0YS1cIiArIG5hbWUgOiBuYW1lXG4gIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKVxufVxuRG9tQXR0cmlidXRlLnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbiggZWxlbWVudCwgbmFtZSwgdmFsdWUgKXtcbiAgbmFtZSA9IHRoaXMudXNlRGF0YSA/IFwiZGF0YS1cIiArIG5hbWUgOiBuYW1lXG4gIHJldHVybiBlbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSlcbn1cbkRvbUF0dHJpYnV0ZS5wcm90b3R5cGUuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24oIGVsZW1lbnQsIG5hbWUgKXtcbiAgbmFtZSA9IHRoaXMudXNlRGF0YSA/IFwiZGF0YS1cIiArIG5hbWUgOiBuYW1lXG4gIHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZShuYW1lKVxufVxuRG9tQXR0cmlidXRlLnByb3RvdHlwZS5yZW1vdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbiggZWxlbWVudCwgbmFtZSApe1xuICBuYW1lID0gdGhpcy51c2VEYXRhID8gXCJkYXRhLVwiICsgbmFtZSA6IG5hbWVcbiAgcmV0dXJuIGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKG5hbWUpXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEZyYWdtZW50XG5cbmZ1bmN0aW9uIEZyYWdtZW50IChmcmFnbWVudCkge1xuICBmcmFnbWVudCA9IGZyYWdtZW50IHx8IHt9XG4gIHRoaXMuaHRtbCA9IGZyYWdtZW50Lmh0bWwgfHwgXCJcIlxuICB0aGlzLmZpcnN0ID0gZnJhZ21lbnQuZmlyc3QgPT0gdW5kZWZpbmVkIHx8ICEhZnJhZ21lbnQuZmlyc3RcbiAgdGhpcy50aW1lb3V0ID0gZnJhZ21lbnQudGltZW91dCB8fCAyMDAwXG59XG5cbkZyYWdtZW50LnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoaHRtbCkge1xuICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgdGVtcC5pbm5lckhUTUwgPSBodG1sIHx8IHRoaXMuaHRtbFxuXG4gIGlmICh0aGlzLmZpcnN0ID09PSB1bmRlZmluZWQgfHwgdGhpcy5maXJzdCkge1xuICAgIHJldHVybiB0ZW1wLmNoaWxkcmVuWzBdXG4gIH1cblxuICB2YXIgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgd2hpbGUgKHRlbXAuY2hpbGROb2Rlcy5sZW5ndGgpIHtcbiAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCh0ZW1wLmZpcnN0Q2hpbGQpXG4gIH1cblxuICByZXR1cm4gZnJhZ21lbnQ7XG59XG5cbkZyYWdtZW50LnByb3RvdHlwZS5jb21waWxlID0gZnVuY3Rpb24gKGh0bWwsIG9wdGlvbnMsIGNiKSB7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGNiKG51bGwsIGh0bWwpXG4gIH0sIDQpXG59XG5cbkZyYWdtZW50LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY29udGV4dCwgb3B0aW9ucykge1xuICB2YXIgZnJhZ21lbnQgPSB0aGlzXG4gIGNvbnRleHQgPSBjb250ZXh0IHx8IHt9XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVzb2x2ZWQgPSBmYWxzZVxuICAgIHZhciBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIlJlbmRlciB0aW1lZCBvdXRcIikpXG4gICAgfSwgZnJhZ21lbnQudGltZW91dClcblxuICAgIHRyeSB7XG4gICAgICBmcmFnbWVudC5jb21waWxlKGNvbnRleHQsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIsIHJlbmRlcmVkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZClcbiAgICAgICAgaWYgKHJlc29sdmVkKSByZXR1cm5cblxuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycilcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKGZyYWdtZW50LmNyZWF0ZShyZW5kZXJlZCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICByZWplY3QoZSlcbiAgICB9XG4gIH0pXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IFNlbGVjdG9yXG5cblNlbGVjdG9yLkRFRkFVTFRfTkVTVF9TRVBBUkFUT1IgPSBcIjpcIlxuXG5mdW5jdGlvbiBTZWxlY3RvciAoc2VsZWN0b3IpIHtcbiAgc2VsZWN0b3IgPSBzZWxlY3RvciB8fCB7fVxuICB0aGlzLmF0dHJpYnV0ZSA9IHNlbGVjdG9yLmF0dHJpYnV0ZVxuICB0aGlzLnZhbHVlID0gc2VsZWN0b3IudmFsdWUgfHwgbnVsbFxuICB0aGlzLm9wZXJhdG9yID0gc2VsZWN0b3Iub3BlcmF0b3IgfHwgXCI9XCJcbiAgdGhpcy5leHRyYSA9IHNlbGVjdG9yLmV4dHJhIHx8IG51bGxcblxuICB0aGlzLmVsZW1lbnQgPSBzZWxlY3Rvci5lbGVtZW50IHx8IG51bGxcblxuICB0aGlzLkNvbnN0cnVjdG9yID0gc2VsZWN0b3IuQ29uc3RydWN0b3IgfHwgbnVsbFxuICB0aGlzLmluc3RhbnRpYXRlID0gc2VsZWN0b3IuaW5zdGFudGlhdGUgfHwgbnVsbFxuICB0aGlzLm11bHRpcGxlID0gc2VsZWN0b3IubXVsdGlwbGUgIT0gbnVsbCA/ICEhc2VsZWN0b3IubXVsdGlwbGUgOiBmYWxzZVxuXG4gIHRoaXMubWF0Y2hlciA9IHNlbGVjdG9yLm1hdGNoZXIgfHwgbnVsbFxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgU2VsZWN0b3IodGhpcylcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLmNvbWJpbmUgPSBmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgdmFyIHMgPSB0aGlzLmNsb25lKClcbiAgcy5leHRyYSArPSBzZWxlY3Rvci50b1N0cmluZygpXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcyA9IHRoaXMuY2xvbmUoKVxuICBzLm9wZXJhdG9yID0gXCI9XCJcbiAgcy52YWx1ZSA9IHZhbHVlXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcyA9IHRoaXMuY2xvbmUoKVxuICBzLm9wZXJhdG9yID0gXCJ+XCJcbiAgcy52YWx1ZSA9IHZhbHVlXG4gIHJldHVybiBzXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5wcmVmaXggPSBmdW5jdGlvbiAocHJlLCBzZXBhcmF0b3IpIHtcbiAgdmFyIHMgPSB0aGlzLmNsb25lKClcbiAgdmFyIHNlcCA9IHMudmFsdWUgPyBzZXBhcmF0b3IgfHwgU2VsZWN0b3IuREVGQVVMVF9ORVNUX1NFUEFSQVRPUiA6IFwiXCJcbiAgcy52YWx1ZSA9IHByZSArIHNlcCArIHMudmFsdWVcbiAgcmV0dXJuIHNcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLm5lc3QgPSBmdW5jdGlvbiAocG9zdCwgc2VwYXJhdG9yKSB7XG4gIHZhciBzID0gdGhpcy5jbG9uZSgpXG4gIHZhciBzZXAgPSBzLnZhbHVlID8gc2VwYXJhdG9yIHx8IFNlbGVjdG9yLkRFRkFVTFRfTkVTVF9TRVBBUkFUT1IgOiBcIlwiXG4gIHMudmFsdWUgKz0gc2VwICsgcG9zdFxuICByZXR1cm4gc1xufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuZnJvbSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHZhciBzID0gdGhpcy5jbG9uZSgpXG4gIHMuZWxlbWVudCA9IGVsZW1lbnRcbiAgcmV0dXJuIHNcbn1cblxuU2VsZWN0b3IucHJvdG90eXBlLnNlbGVjdCA9IGZ1bmN0aW9uIChlbGVtZW50LCB0cmFuc2Zvcm0pIHtcbiAgdmFyIHJlc3VsdCA9IGVsZW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnRvU3RyaW5nKCkpXG4gIHJldHVybiB0cmFuc2Zvcm0gPyB0cmFuc2Zvcm0ocmVzdWx0KSA6IHJlc3VsdFxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuc2VsZWN0QWxsID0gZnVuY3Rpb24gKGVsZW1lbnQsIHRyYW5zZm9ybSkge1xuICB2YXIgcmVzdWx0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMudG9TdHJpbmcoKSlcbiAgcmV0dXJuIHRyYW5zZm9ybSA/IHRyYW5zZm9ybShyZXN1bHQpIDogcmVzdWx0XG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5ub2RlID0gZnVuY3Rpb24gKHRyYW5zZm9ybSkge1xuICByZXR1cm4gdGhpcy5zZWxlY3QodGhpcy5lbGVtZW50LCB0cmFuc2Zvcm0pXG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS5ub2RlTGlzdCA9IGZ1bmN0aW9uICh0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIHRoaXMuc2VsZWN0QWxsKHRoaXMuZWxlbWVudCwgdHJhbnNmb3JtKVxufVxuXG5TZWxlY3Rvci5wcm90b3R5cGUuY29uc3RydWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yXG4gIHZhciBpbnN0YW50aWF0ZSA9IHRoaXMuaW5zdGFudGlhdGUgfHwgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKGVsZW1lbnQpXG4gIH1cbiAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlTGlzdChmdW5jdGlvbiAoZWxlbWVudHMpIHtcbiAgICAgIHJldHVybiBbXS5tYXAuY2FsbChlbGVtZW50cywgaW5zdGFudGlhdGUpXG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlKGluc3RhbnRpYXRlKVxuICB9XG59XG5cblNlbGVjdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZSAhPSBudWxsXG4gICAgICA/ICdcIicgKyAodGhpcy52YWx1ZSA9PSB0cnVlID8gXCJcIiA6IHRoaXMudmFsdWUpICsgJ1wiJ1xuICAgICAgOiBcIlwiXG4gIHZhciBvcGVyYXRvciA9IHZhbHVlID8gdGhpcy5vcGVyYXRvciB8fCBcIj1cIiA6IFwiXCJcbiAgdmFyIGV4dHJhID0gdGhpcy5leHRyYSB8fCBcIlwiXG4gIHJldHVybiBcIltcIiArIHRoaXMuYXR0cmlidXRlICsgb3BlcmF0b3IgKyB2YWx1ZSArIFwiXVwiICsgZXh0cmFcbn1cbiIsInZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuL1NlbGVjdG9yXCIpXG5cbi8qKlxuICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIG9uIGFuIGVsZW1lbnRcbiAqIGFuZCByZXR1cm5zIGEgZGVsZWdhdG9yLlxuICogQSBkZWxlZ2F0ZWQgZXZlbnQgcnVucyBtYXRjaGVzIHRvIGZpbmQgYW4gZXZlbnQgdGFyZ2V0LFxuICogdGhlbiBleGVjdXRlcyB0aGUgaGFuZGxlciBwYWlyZWQgd2l0aCB0aGUgbWF0Y2hlci5cbiAqIE1hdGNoZXJzIGNhbiBjaGVjayBpZiBhbiBldmVudCB0YXJnZXQgbWF0Y2hlcyBhIGdpdmVuIHNlbGVjdG9yLFxuICogb3Igc2VlIGlmIGFuIG9mIGl0cyBwYXJlbnRzIGRvLlxuICogKi9cbm1vZHVsZS5leHBvcnRzID0gZGVsZWdhdGVcblxuZnVuY3Rpb24gZGVsZWdhdGUoIG9wdGlvbnMgKXtcbiAgdmFyIGVsZW1lbnQgPSBvcHRpb25zLmVsZW1lbnRcbiAgICAsIGV2ZW50ID0gb3B0aW9ucy5ldmVudFxuICAgICwgY2FwdHVyZSA9ICEhb3B0aW9ucy5jYXB0dXJlIHx8IGZhbHNlXG4gICAgLCBjb250ZXh0ID0gb3B0aW9ucy5jb250ZXh0IHx8IGVsZW1lbnRcbiAgICAsIHRyYW5zZm9ybSA9IG9wdGlvbnMudHJhbnNmb3JtIHx8IG51bGxcblxuICBpZiggIWVsZW1lbnQgKXtcbiAgICBjb25zb2xlLmxvZyhcIkNhbid0IGRlbGVnYXRlIHVuZGVmaW5lZCBlbGVtZW50XCIpXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBpZiggIWV2ZW50ICl7XG4gICAgY29uc29sZS5sb2coXCJDYW4ndCBkZWxlZ2F0ZSB1bmRlZmluZWQgZXZlbnRcIilcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgdmFyIGRlbGVnYXRvciA9IGNyZWF0ZURlbGVnYXRvcihjb250ZXh0LCB0cmFuc2Zvcm0pXG4gIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZGVsZWdhdG9yLCBjYXB0dXJlKVxuXG4gIHJldHVybiBkZWxlZ2F0b3Jcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgZGVsZWdhdG9yIHRoYXQgY2FuIGJlIHVzZWQgYXMgYW4gZXZlbnQgbGlzdGVuZXIuXG4gKiBUaGUgZGVsZWdhdG9yIGhhcyBzdGF0aWMgbWV0aG9kcyB3aGljaCBjYW4gYmUgdXNlZCB0byByZWdpc3RlciBoYW5kbGVycy5cbiAqICovXG5mdW5jdGlvbiBjcmVhdGVEZWxlZ2F0b3IoIGNvbnRleHQsIHRyYW5zZm9ybSApe1xuICB2YXIgbWF0Y2hlcnMgPSBbXVxuXG4gIGZ1bmN0aW9uIGRlbGVnYXRvciggZSApe1xuICAgIHZhciBsID0gbWF0Y2hlcnMubGVuZ3RoXG4gICAgaWYoICFsICl7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHZhciBlbCA9IHRoaXNcbiAgICAgICAgLCBpID0gLTFcbiAgICAgICAgLCBoYW5kbGVyXG4gICAgICAgICwgc2VsZWN0b3JcbiAgICAgICAgLCBkZWxlZ2F0ZUVsZW1lbnRcbiAgICAgICAgLCBzdG9wUHJvcGFnYXRpb25cbiAgICAgICAgLCBhcmdzXG5cbiAgICB3aGlsZSggKytpIDwgbCApe1xuICAgICAgYXJncyA9IG1hdGNoZXJzW2ldXG4gICAgICBoYW5kbGVyID0gYXJnc1swXVxuICAgICAgc2VsZWN0b3IgPSBhcmdzWzFdXG5cbiAgICAgIGRlbGVnYXRlRWxlbWVudCA9IG1hdGNoQ2FwdHVyZVBhdGgoc2VsZWN0b3IsIGVsLCBlLCB0cmFuc2Zvcm0sIGNvbnRleHQpXG4gICAgICBpZiggZGVsZWdhdGVFbGVtZW50ICYmIGRlbGVnYXRlRWxlbWVudC5sZW5ndGggKSB7XG4gICAgICAgIHN0b3BQcm9wYWdhdGlvbiA9IGZhbHNlID09PSBoYW5kbGVyLmFwcGx5KGNvbnRleHQsIFtlXS5jb25jYXQoZGVsZWdhdGVFbGVtZW50KSlcbiAgICAgICAgaWYoIHN0b3BQcm9wYWdhdGlvbiApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgaGFuZGxlciB3aXRoIGEgdGFyZ2V0IGZpbmRlciBsb2dpY1xuICAgKiAqL1xuICBkZWxlZ2F0b3IubWF0Y2ggPSBmdW5jdGlvbiggc2VsZWN0b3IsIGhhbmRsZXIgKXtcbiAgICBtYXRjaGVycy5wdXNoKFtoYW5kbGVyLCBzZWxlY3Rvcl0pXG4gICAgcmV0dXJuIGRlbGVnYXRvclxuICB9XG5cbiAgcmV0dXJuIGRlbGVnYXRvclxufVxuXG5mdW5jdGlvbiBtYXRjaENhcHR1cmVQYXRoKCBzZWxlY3RvciwgZWwsIGUsIHRyYW5zZm9ybSwgY29udGV4dCApe1xuICB2YXIgZGVsZWdhdGVFbGVtZW50cyA9IFtdXG4gIHZhciBkZWxlZ2F0ZUVsZW1lbnQgPSBudWxsXG4gIGlmKCBBcnJheS5pc0FycmF5KHNlbGVjdG9yKSApe1xuICAgIHZhciBpID0gLTFcbiAgICB2YXIgbCA9IHNlbGVjdG9yLmxlbmd0aFxuICAgIHdoaWxlKCArK2kgPCBsICl7XG4gICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSBmaW5kUGFyZW50KHNlbGVjdG9yW2ldLCBlbCwgZSlcbiAgICAgIGlmKCAhZGVsZWdhdGVFbGVtZW50ICkgcmV0dXJuIG51bGxcbiAgICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSB0cmFuc2Zvcm0oY29udGV4dCwgc2VsZWN0b3IsIGRlbGVnYXRlRWxlbWVudClcbiAgICAgIH1cbiAgICAgIGRlbGVnYXRlRWxlbWVudHMucHVzaChkZWxlZ2F0ZUVsZW1lbnQpXG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIGRlbGVnYXRlRWxlbWVudCA9IGZpbmRQYXJlbnQoc2VsZWN0b3IsIGVsLCBlKVxuICAgIGlmKCAhZGVsZWdhdGVFbGVtZW50ICkgcmV0dXJuIG51bGxcbiAgICBpZiAodHlwZW9mIHRyYW5zZm9ybSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIGRlbGVnYXRlRWxlbWVudCA9IHRyYW5zZm9ybShjb250ZXh0LCBzZWxlY3RvciwgZGVsZWdhdGVFbGVtZW50KVxuICAgIH1cbiAgICBkZWxlZ2F0ZUVsZW1lbnRzLnB1c2goZGVsZWdhdGVFbGVtZW50KVxuICB9XG4gIHJldHVybiBkZWxlZ2F0ZUVsZW1lbnRzXG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHRhcmdldCBvciBhbnkgb2YgaXRzIHBhcmVudCBtYXRjaGVzIGEgc2VsZWN0b3JcbiAqICovXG5mdW5jdGlvbiBmaW5kUGFyZW50KCBzZWxlY3RvciwgZWwsIGUgKXtcbiAgdmFyIHRhcmdldCA9IGUudGFyZ2V0XG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIFNlbGVjdG9yKSB7XG4gICAgc2VsZWN0b3IgPSBzZWxlY3Rvci50b1N0cmluZygpXG4gIH1cbiAgc3dpdGNoKCB0eXBlb2Ygc2VsZWN0b3IgKXtcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICB3aGlsZSggdGFyZ2V0ICYmIHRhcmdldCAhPSBlbCApe1xuICAgICAgICBpZiggdGFyZ2V0Lm1hdGNoZXMgJiYgdGFyZ2V0Lm1hdGNoZXMoc2VsZWN0b3IpICkgcmV0dXJuIHRhcmdldFxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlIFwiZnVuY3Rpb25cIjpcbiAgICAgIHdoaWxlKCB0YXJnZXQgJiYgdGFyZ2V0ICE9IGVsICl7XG4gICAgICAgIGlmKCBzZWxlY3Rvci5jYWxsKGVsLCB0YXJnZXQpICkgcmV0dXJuIHRhcmdldFxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG51bGxcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuIiwidmFyIGRvbSA9IG1vZHVsZS5leHBvcnRzID0ge31cblxuZG9tLmRlbGVnYXRlID0gcmVxdWlyZShcIi4vZGVsZWdhdGVcIilcbmRvbS5TZWxlY3RvciA9IHJlcXVpcmUoXCIuL1NlbGVjdG9yXCIpXG4iLCJ2YXIgbWVyZ2UgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvbWVyZ2VcIilcbnZhciBmb3JJbiA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9pblwiKVxudmFyIEV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0V4dGVuc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsdWVwcmludFxuXG5mdW5jdGlvbiBCbHVlcHJpbnQoIGJsb2NrcywgcGFyZW50ICl7XG4gIHZhciBibHVlcHJpbnQgPSB0aGlzXG5cbiAgdGhpcy5ibG9ja3MgPSBtZXJnZShibG9ja3MpXG4gIHRoaXMucGFyZW50ID0gcGFyZW50XG4gIC8vdGhpcy5leHRlbnNpb25zID0gdGhpcy5nZXQoXCJleHRlbnNpb25zXCIsIHt9KVxuXG4gIHRoaXMubG9jYWxFeHRlbnNpb25zID0gdGhpcy5nZXQoXCJleHRlbnNpb25zXCIsIHt9KVxuXG4gIGZvckluKHRoaXMubG9jYWxFeHRlbnNpb25zLCBmdW5jdGlvbiggbmFtZSwgZXh0ZW5zaW9uICl7XG4gICAgLy9pZiAocGFyZW50ICYmICEhfnBhcmVudC5leHRlbnNpb25OYW1lcy5pbmRleE9mKG5hbWUpKSB7XG4gICAgLy8gIHRocm93IG5ldyBFcnJvcihcIkRlc2NyaXB0aW9uIG92ZXJyaWRlIGlzIG5vdCBzdXBwb3J0ZWRcIilcbiAgICAvL31cblxuICAgIGV4dGVuc2lvbiA9IGV4dGVuc2lvbiBpbnN0YW5jZW9mIEV4dGVuc2lvblxuICAgICAgICA/IGV4dGVuc2lvblxuICAgICAgICA6IG5ldyBFeHRlbnNpb24oZXh0ZW5zaW9uKVxuICAgIGJsdWVwcmludC5sb2NhbEV4dGVuc2lvbnNbbmFtZV0gPSBleHRlbnNpb25cbiAgICBleHRlbnNpb24ubmFtZSA9IG5hbWVcbiAgfSlcblxuICB0aGlzLmdsb2JhbEV4dGVuc2lvbnMgPSB0aGlzLmxvY2FsRXh0ZW5zaW9uc1xuXG4gIGlmIChwYXJlbnQpIHtcbiAgICB0aGlzLmdsb2JhbEV4dGVuc2lvbnMgPSBtZXJnZShwYXJlbnQuZ2xvYmFsRXh0ZW5zaW9ucywgdGhpcy5sb2NhbEV4dGVuc2lvbnMpXG4gICAgZm9ySW4odGhpcy5nbG9iYWxFeHRlbnNpb25zLCBmdW5jdGlvbiAobmFtZSwgZXh0ZW5zaW9uKSB7XG4gICAgICBpZiAoZXh0ZW5zaW9uLmluaGVyaXQpIHtcbiAgICAgICAgYmx1ZXByaW50LmJsb2Nrc1tuYW1lXSA9IG1lcmdlKHBhcmVudC5nZXQobmFtZSksIGJsdWVwcmludC5nZXQobmFtZSkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkUHJvdG90eXBlID0gZnVuY3Rpb24oIHByb3RvdHlwZSwgdG9wICl7XG4gIC8vaWYgKHRoaXMucGFyZW50KSB7XG4gIC8vICB0aGlzLnBhcmVudC5idWlsZFByb3RvdHlwZShwcm90b3R5cGUsIHRvcClcbiAgLy99XG4gIHRoaXMuYnVpbGQoXCJwcm90b3R5cGVcIiwgdGhpcy5nbG9iYWxFeHRlbnNpb25zLCB0b3AsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24sIGJsb2NrKSB7XG4gICAgZm9ySW4oYmxvY2ssIGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApe1xuICAgICAgZXh0ZW5zaW9uLmluaXRpYWxpemUocHJvdG90eXBlLCBuYW1lLCB2YWx1ZSlcbiAgICB9KVxuICB9KVxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkQ2FjaGUgPSBmdW5jdGlvbiggcHJvdG90eXBlLCB0b3AgKXtcbiAgLy9pZiAodGhpcy5wYXJlbnQpIHtcbiAgLy8gIHRoaXMucGFyZW50LmJ1aWxkQ2FjaGUocHJvdG90eXBlLCB0b3ApXG4gIC8vfVxuICB0aGlzLmJ1aWxkKFwiY2FjaGVcIiwgdGhpcy5nbG9iYWxFeHRlbnNpb25zLCB0b3AsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24sIGJsb2NrKSB7XG4gICAgaWYgKCFwcm90b3R5cGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIHByb3RvdHlwZVtuYW1lXSA9IHt9XG4gICAgfVxuICAgIC8vaWYgKHByb3RvdHlwZS5jb25zdHJ1Y3Rvci5TdXBlcikge1xuICAgIC8vICB2YXIgc3VwZXJDYWNoZSA9IHByb3RvdHlwZS5jb25zdHJ1Y3Rvci5TdXBlci5wcm90b3R5cGVbbmFtZV1cbiAgICAvLyAgcHJvdG90eXBlW25hbWVdID0gbWVyZ2UocHJvdG90eXBlW25hbWVdLCBzdXBlckNhY2hlKVxuICAgIC8vfVxuXG4gICAgdmFyIGNhY2hlID0gcHJvdG90eXBlW25hbWVdXG4gICAgdmFyIGluaXRpYWxpemUgPSBleHRlbnNpb24uaW5pdGlhbGl6ZVxuXG4gICAgZm9ySW4oYmxvY2ssIGZ1bmN0aW9uKCBuYW1lLCB2YWx1ZSApe1xuICAgICAgY2FjaGVbbmFtZV0gPSBpbml0aWFsaXplXG4gICAgICAgICAgPyBpbml0aWFsaXplKHByb3RvdHlwZSwgbmFtZSwgdmFsdWUpXG4gICAgICAgICAgOiB2YWx1ZVxuICAgIH0pXG4gIH0pXG59XG5cbkJsdWVwcmludC5wcm90b3R5cGUuYnVpbGRJbnN0YW5jZSA9IGZ1bmN0aW9uKCBpbnN0YW5jZSwgdG9wICl7XG4gIHRoaXMuYnVpbGQoXCJpbnN0YW5jZVwiLCB0aGlzLmdsb2JhbEV4dGVuc2lvbnMsIHRvcCwgZnVuY3Rpb24gKG5hbWUsIGV4dGVuc2lvbiwgYmxvY2spIHtcbiAgICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4gICAgICBleHRlbnNpb24uaW5pdGlhbGl6ZShpbnN0YW5jZSwgbmFtZSwgdmFsdWUpXG4gICAgfSlcbiAgfSlcbn1cblxuQmx1ZXByaW50LnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCB0eXBlLCBleHRlbnNpb25zLCB0b3AsIGJ1aWxkICl7XG4gIHZhciBibHVlcHJpbnQgPSB0b3AgfHwgdGhpc1xuICAvL3ZhciBiYXNlID0gdGhpc1xuICBmb3JJbihleHRlbnNpb25zLCBmdW5jdGlvbiAobmFtZSwgZXh0ZW5zaW9uKSB7XG4gICAgaWYoIGV4dGVuc2lvbi50eXBlICE9IHR5cGUgKSByZXR1cm5cbiAgICAvL3ZhciBibHVlcHJpbnQgPSBleHRlbnNpb24uaW5oZXJpdCA/IHRvcCA6IGJhc2VcbiAgICB2YXIgYmxvY2sgPSBibHVlcHJpbnQuZ2V0KG5hbWUpXG4gICAgaWYoICFibG9jayApIHJldHVyblxuXG4gICAgYnVpbGQobmFtZSwgZXh0ZW5zaW9uLCBibG9jaylcbiAgfSlcbn1cblxuLy9CbHVlcHJpbnQucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oIHR5cGUsIGV4dGVuc2lvbnMgdG9wLCBjb250ZXh0LCApe1xuLy8gIHZhciBibHVlcHJpbnQgPSB0b3AgfHwgdGhpc1xuLy8gIGZvckluKGV4dGVuc2lvbnMsIGZ1bmN0aW9uIChuYW1lLCBleHRlbnNpb24pIHtcbi8vICAgIGlmKCBleHRlbnNpb24udHlwZSAhPSB0eXBlICkgcmV0dXJuXG4vL1xuLy8gICAgdmFyIGJsb2NrID0gYmx1ZXByaW50LmdldChuYW1lKVxuLy8gICAgaWYoICFibG9jayApIHJldHVyblxuLy9cbi8vICAgIGV4dGVuc2lvbi51c2UoY29udGV4dCwgYmxvY2spXG4vLyAgfSlcbi8vfVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmRpZ2VzdCA9IGZ1bmN0aW9uKCBuYW1lLCBmbiwgbG9vcCApe1xuICBpZiAodGhpcy5oYXMobmFtZSkpIHtcbiAgICB2YXIgYmxvY2sgPSB0aGlzLmdldChuYW1lKVxuICAgIGlmIChsb29wKSB7XG4gICAgICBmb3JJbihibG9jaywgZm4pXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm4uY2FsbCh0aGlzLCBibG9jaylcbiAgICB9XG4gIH1cbn1cblxuQmx1ZXByaW50LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiggbmFtZSApe1xuICByZXR1cm4gdGhpcy5ibG9ja3MuaGFzT3duUHJvcGVydHkobmFtZSkgJiYgdGhpcy5ibG9ja3NbbmFtZV0gIT0gbnVsbFxufVxuXG5CbHVlcHJpbnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCBuYW1lLCBkZWZhdWx0VmFsdWUgKXtcbiAgaWYoIHRoaXMuaGFzKG5hbWUpICl7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tzW25hbWVdXG4gIH1cbiAgZWxzZSByZXR1cm4gZGVmYXVsdFZhbHVlXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEV4dGVuc2lvblxuXG5mdW5jdGlvbiBFeHRlbnNpb24oZXh0ZW5zaW9uKXtcbiAgZXh0ZW5zaW9uID0gZXh0ZW5zaW9uIHx8IHt9XG4gIHRoaXMubmFtZSA9IFwiXCJcbiAgdGhpcy50eXBlID0gZXh0ZW5zaW9uLnR5cGUgfHwgXCJpbnN0YW5jZVwiXG4gIHRoaXMuaW5oZXJpdCA9IGV4dGVuc2lvbi5pbmhlcml0IHx8IGZhbHNlXG4gIHRoaXMuaW5pdGlhbGl6ZSA9IGV4dGVuc2lvbi5pbml0aWFsaXplIHx8IG51bGxcbn1cblxuLy9FeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBjb250ZXh0LCBibG9jayApe31cbiIsInZhciBkZWZpbmUgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmaW5lXCIpXG52YXIgQmx1ZXByaW50ID0gcmVxdWlyZShcIi4vQmx1ZXByaW50XCIpXG52YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kXCIpXG52YXIgYXVnbWVudCA9IHJlcXVpcmUoXCIuL2F1Z21lbnRcIilcbnZhciBpbmNsdWRlID0gcmVxdWlyZShcIi4vaW5jbHVkZVwiKVxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi9pbmhlcml0XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gRmFjdG9yeVxuXG5mdW5jdGlvbiBGYWN0b3J5KCBibHVlcHJpbnQsIHBhcmVudCApe1xuICB2YXIgZmFjdG9yeSA9IHRoaXNcblxuICBpZiggIShibHVlcHJpbnQgaW5zdGFuY2VvZiBCbHVlcHJpbnQpICkge1xuICAgIGJsdWVwcmludCA9IG5ldyBCbHVlcHJpbnQoYmx1ZXByaW50LCBwYXJlbnQgPyBwYXJlbnQuYmx1ZXByaW50IDogbnVsbClcbiAgfVxuXG4gIHRoaXMuYmx1ZXByaW50ID0gYmx1ZXByaW50XG4gIHRoaXMucGFyZW50ID0gcGFyZW50IHx8IG51bGxcbiAgdGhpcy5hbmNlc3RvcnMgPSBwYXJlbnQgPyBwYXJlbnQuYW5jZXN0b3JzLmNvbmNhdChbcGFyZW50XSkgOiBbXVxuICB0aGlzLnJvb3QgPSB0aGlzLmFuY2VzdG9yc1swXSB8fCBudWxsXG4gIHRoaXMuU3VwZXIgPSBibHVlcHJpbnQuZ2V0KFwiaW5oZXJpdFwiLCBudWxsKVxuICB0aGlzLkNvbnN0cnVjdG9yID0gYmx1ZXByaW50LmdldChcImNvbnN0cnVjdG9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5TdXBlcikge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5TdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfVxuICAgIHRoaXMuY29uc3RydWN0b3IuaW5pdGlhbGl6ZSh0aGlzKVxuICB9KVxuICB0aGlzLkNvbnN0cnVjdG9yLmV4dGVuZCA9IGZ1bmN0aW9uIChzdXBlckJsdWVwcmludCkge1xuICAgIHN1cGVyQmx1ZXByaW50ID0gc3VwZXJCbHVlcHJpbnQgfHwge31cbiAgICBzdXBlckJsdWVwcmludFtcImluaGVyaXRcIl0gPSBmYWN0b3J5LkNvbnN0cnVjdG9yXG4gICAgdmFyIHN1cGVyRmFjdG9yeSA9IG5ldyBGYWN0b3J5KHN1cGVyQmx1ZXByaW50LCBmYWN0b3J5KVxuICAgIHJldHVybiBzdXBlckZhY3RvcnkuYXNzZW1ibGUoKVxuICB9XG5cbiAgdGhpcy5pbmR1c3RyeS5wdXNoKHRoaXMpXG59XG5cbkZhY3RvcnkucHJvdG90eXBlLmFzc2VtYmxlID0gZnVuY3Rpb24oKXtcbiAgdmFyIGZhY3RvcnkgPSB0aGlzXG4gIHZhciBibHVlcHJpbnQgPSB0aGlzLmJsdWVwcmludFxuICB2YXIgQ29uc3RydWN0b3IgPSB0aGlzLkNvbnN0cnVjdG9yXG5cbiAgQ29uc3RydWN0b3IuU3VwZXIgPSB0aGlzLlN1cGVyXG4gIENvbnN0cnVjdG9yLmJsdWVwcmludCA9IGJsdWVwcmludFxuXG4gIHRoaXMuZGlnZXN0KClcblxuICBibHVlcHJpbnQuYnVpbGRQcm90b3R5cGUoQ29uc3RydWN0b3IucHJvdG90eXBlLCBibHVlcHJpbnQpXG4gIGJsdWVwcmludC5idWlsZENhY2hlKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgYmx1ZXByaW50KVxuXG4gIENvbnN0cnVjdG9yLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAvL3ZhciB0b3AgPSBmYWN0b3J5LmZpbmRGYWN0b3J5KGluc3RhbmNlLmNvbnN0cnVjdG9yKS5ibHVlcHJpbnRcbiAgICB2YXIgdG9wID0gaW5zdGFuY2UuY29uc3RydWN0b3IuYmx1ZXByaW50XG4gICAgYmx1ZXByaW50LmJ1aWxkSW5zdGFuY2UoaW5zdGFuY2UsIHRvcClcbiAgfVxuXG4gIHJldHVybiBDb25zdHJ1Y3RvclxufVxuXG5GYWN0b3J5LnByb3RvdHlwZS5kaWdlc3QgPSBmdW5jdGlvbiggICl7XG4gIHZhciBmYWN0b3J5ID0gdGhpc1xuICB2YXIgYmx1ZXByaW50ID0gdGhpcy5ibHVlcHJpbnRcbiAgdmFyIENvbnN0cnVjdG9yID0gdGhpcy5Db25zdHJ1Y3RvclxuICB2YXIgcHJvdG8gPSBDb25zdHJ1Y3Rvci5wcm90b3R5cGVcblxuICBibHVlcHJpbnQuZGlnZXN0KFwiaW5oZXJpdFwiLCBmdW5jdGlvbiAoU3VwZXIpIHtcbiAgICBpbmhlcml0KENvbnN0cnVjdG9yLCBTdXBlcilcbiAgfSlcbiAgYmx1ZXByaW50LmRpZ2VzdChcImluY2x1ZGVcIiwgZnVuY3Rpb24gKGluY2x1ZGVzKSB7XG4gICAgaW5jbHVkZShDb25zdHJ1Y3RvciwgaW5jbHVkZXMpXG4gIH0pXG4gIGJsdWVwcmludC5kaWdlc3QoXCJhdWdtZW50XCIsIGZ1bmN0aW9uIChhdWdtZW50cykge1xuICAgIGF1Z21lbnQoQ29uc3RydWN0b3IsIGF1Z21lbnRzKVxuICB9KVxuICBibHVlcHJpbnQuZGlnZXN0KFwicHJvdG90eXBlXCIsIGZ1bmN0aW9uIChwcm90bykge1xuICAgIGV4dGVuZChDb25zdHJ1Y3RvciwgcHJvdG8pXG4gIH0pXG4gIGJsdWVwcmludC5kaWdlc3QoXCJzdGF0aWNcIiwgZnVuY3Rpb24gKG5hbWUsIG1ldGhvZCkge1xuICAgIENvbnN0cnVjdG9yW25hbWVdID0gbWV0aG9kXG4gIH0sIHRydWUpXG4gIGJsdWVwcmludC5kaWdlc3QoXCJhY2Nlc3NvclwiLCBmdW5jdGlvbiggbmFtZSwgYWNjZXNzICl7XG4gICAgaWYoICFhY2Nlc3MgKSByZXR1cm5cbiAgICBpZiggdHlwZW9mIGFjY2VzcyA9PSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgIGRlZmluZS5nZXR0ZXIocHJvdG8sIG5hbWUsIGFjY2VzcylcbiAgICB9XG4gICAgZWxzZSBpZiggdHlwZW9mIGFjY2Vzc1tcImdldFwiXSA9PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIGFjY2Vzc1tcInNldFwiXSA9PSBcImZ1bmN0aW9uXCIgKXtcbiAgICAgIGRlZmluZS5hY2Nlc3Nvcihwcm90bywgbmFtZSwgYWNjZXNzW1wiZ2V0XCJdLCBhY2Nlc3NbXCJzZXRcIl0pXG4gICAgfVxuICAgIGVsc2UgaWYoIHR5cGVvZiBhY2Nlc3NbXCJnZXRcIl0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICBkZWZpbmUuZ2V0dGVyKHByb3RvLCBuYW1lLCBhY2Nlc3NbXCJnZXRcIl0pXG4gICAgfVxuICAgIGVsc2UgaWYoIHR5cGVvZiBhY2Nlc3NbXCJzZXRcIl0gPT0gXCJmdW5jdGlvblwiICl7XG4gICAgICBkZWZpbmUuZ2V0dGVyKHByb3RvLCBuYW1lLCBhY2Nlc3NbXCJzZXRcIl0pXG4gICAgfVxuICB9LCB0cnVlKVxuICAvL2JsdWVwcmludC5kaWdlc3QoXCJpbmNsdWRlXCIsIGZ1bmN0aW9uIChpbmNsdWRlcykge1xuICAvLyAgaWYgKCFBcnJheS5pc0FycmF5KGluY2x1ZGVzKSkge1xuICAvLyAgICBpbmNsdWRlcyA9IFtpbmNsdWRlc11cbiAgLy8gIH1cbiAgLy8gIGluY2x1ZGVzLmZvckVhY2goZnVuY3Rpb24gKGluY2x1ZGUpIHtcbiAgLy8gICAgdmFyIGZvcmVpZ24gPSBmYWN0b3J5LmZpbmRGYWN0b3J5KGluY2x1ZGUpXG4gIC8vICAgIGlmIChmb3JlaWduKSB7XG4gIC8vICAgICAgZm9yZWlnbi5ibHVlcHJpbnQuYnVpbGQoXCJwcm90b3R5cGVcIiwgQ29uc3RydWN0b3IucHJvdG90eXBlLCBibHVlcHJpbnQpXG4gIC8vICAgIH1cbiAgLy8gIH0pXG4gIC8vfSlcbn1cblxuRmFjdG9yeS5wcm90b3R5cGUuaW5kdXN0cnkgPSBbXVxuXG5GYWN0b3J5LnByb3RvdHlwZS5maW5kRmFjdG9yeSA9IGZ1bmN0aW9uKCBDb25zdHJ1Y3RvciApe1xuICB2YXIgcmV0ID0gbnVsbFxuICB0aGlzLmluZHVzdHJ5LnNvbWUoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgICByZXR1cm4gZmFjdG9yeS5Db25zdHJ1Y3RvciA9PT0gQ29uc3RydWN0b3IgJiYgKHJldCA9IGZhY3RvcnkpXG4gIH0pXG4gIHJldHVybiByZXRcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXVnbWVudCAoQ2xhc3MsIG1peGluKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG1peGluKSkge1xuICAgIG1peGluLmZvckVhY2goZnVuY3Rpb24gKG1peGluKSB7XG4gICAgICBpZiAodHlwZW9mIG1peGluID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBtaXhpbi5jYWxsKENsYXNzLnByb3RvdHlwZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0eXBlb2YgbWl4aW4gPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBtaXhpbi5jYWxsKENsYXNzLnByb3RvdHlwZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gQ2xhc3Ncbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kIChDbGFzcywgcHJvdG90eXBlKSB7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvdHlwZSkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChuYW1lICE9PSBcImNvbnN0cnVjdG9yXCIgKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENsYXNzLnByb3RvdHlwZSwgbmFtZSwgZGVzY3JpcHRvcilcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIENsYXNzXG59XG4iLCJ2YXIgZXh0ZW5kID0gcmVxdWlyZShcIi4vZXh0ZW5kXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5jbHVkZSAoQ2xhc3MsIE90aGVyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KE90aGVyKSkge1xuICAgIE90aGVyLmZvckVhY2goZnVuY3Rpb24gKE90aGVyKSB7XG4gICAgICBpZiAodHlwZW9mIE90aGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBleHRlbmQoQ2xhc3MsIE90aGVyLnByb3RvdHlwZSlcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBPdGhlciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGV4dGVuZChDbGFzcywgT3RoZXIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIE90aGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgZXh0ZW5kKENsYXNzLCBPdGhlci5wcm90b3R5cGUpXG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBPdGhlciA9PSBcIm9iamVjdFwiKSB7XG4gICAgICBleHRlbmQoQ2xhc3MsIE90aGVyKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBDbGFzc1xufVxuIiwidmFyIEZhY3RvcnkgPSByZXF1aXJlKFwiLi9GYWN0b3J5XCIpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmFjdG9yeSggYmx1ZXByaW50ICl7XG4gIHJldHVybiBuZXcgRmFjdG9yeShibHVlcHJpbnQpLmFzc2VtYmxlKClcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdCAoQ2xhc3MsIEJhc2UpIHtcbiAgQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCYXNlLnByb3RvdHlwZSlcbiAgQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2xhc3NcblxuICByZXR1cm4gQ2xhc3Ncbn1cbiIsInZhciBmb3JJbiA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9pblwiKVxudmFyIGNvcHkgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvY29weVwiKVxudmFyIGluaGVyaXQgPSByZXF1aXJlKFwiLi8uLi9mYWN0b3J5L2luaGVyaXRcIilcbnZhciBFeHRlbnNpb24gPSByZXF1aXJlKFwiLi8uLi9mYWN0b3J5L0V4dGVuc2lvblwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IENhY2hlRXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIENhY2hlRXh0ZW5zaW9uIChpbml0aWFsaXplKSB7XG4gIEV4dGVuc2lvbi5jYWxsKHRoaXMsIHtcbiAgICB0eXBlOiBcImNhY2hlXCIsXG4gICAgaW5oZXJpdDogdHJ1ZSxcbiAgICBpbml0aWFsaXplOiBpbml0aWFsaXplXG4gIH0pXG59XG5cbmluaGVyaXQoQ2FjaGVFeHRlbnNpb24sIEV4dGVuc2lvbilcblxuLy9DYWNoZUV4dGVuc2lvbi5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24oIHByb3RvdHlwZSwgYmxvY2sgKXtcbi8vICBpZiAoIXRoaXMubmFtZSkgcmV0dXJuXG4vL1xuLy8gIHZhciBjYWNoZSA9IHByb3RvdHlwZVt0aGlzLm5hbWVdID0ge31cbi8vXG4vLyAgaWYgKHByb3RvdHlwZS5jb25zdHJ1Y3Rvci5TdXBlcikge1xuLy8gICAgdmFyIHN1cGVyQ2FjaGUgPSBwcm90b3R5cGUuY29uc3RydWN0b3IuU3VwZXIucHJvdG90eXBlW3RoaXMubmFtZV1cbi8vICAgIGNhY2hlID0gcHJvdG90eXBlW3RoaXMubmFtZV0gPSBjb3B5KHN1cGVyQ2FjaGUpXG4vLyAgfVxuLy9cbi8vICB2YXIgaW5pdGlhbGl6ZSA9IHRoaXMuaW5pdGlhbGl6ZVxuLy8gIGZvckluKGJsb2NrLCBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKXtcbi8vICAgIGNhY2hlW25hbWVdID0gaW5pdGlhbGl6ZVxuLy8gICAgICAgID8gaW5pdGlhbGl6ZShwcm90b3R5cGUsIG5hbWUsIHZhbHVlLCBibG9jaylcbi8vICAgICAgICA6IHZhbHVlXG4vLyAgfSlcbi8vfVxuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmF1bHRzXCIpXG52YXIgVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIilcbnZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuLi9kb20vU2VsZWN0b3JcIilcbnZhciBGcmFnbWVudCA9IHJlcXVpcmUoXCIuLi9kb20vRnJhZ21lbnRcIilcbnZhciBJbnN0YW5jZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0luc3RhbmNlRXh0ZW5zaW9uXCIpXG52YXIgQ2FjaGVFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9DYWNoZUV4dGVuc2lvblwiKVxuXG52YXIgRWxlbWVudCA9IG1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICBleHRlbnNpb25zOiB7XG4gICAgY2hpbGRyZW46IG5ldyBJbnN0YW5jZUV4dGVuc2lvbihmdW5jdGlvbihlbGVtZW50LCBuYW1lLCBzZWxlY3Rvcil7XG4gICAgICBzZWxlY3RvciA9IG5ldyBTZWxlY3RvcihkZWZhdWx0cyhzZWxlY3Rvciwge1xuICAgICAgICBhdHRyaWJ1dGU6IFwiZGF0YS1lbGVtZW50XCIsXG4gICAgICAgIG9wZXJhdG9yOiBcIn5cIixcbiAgICAgICAgdmFsdWU6IG5hbWVcbiAgICAgIH0pKS5wcmVmaXgoZWxlbWVudC5uYW1lKVxuICAgICAgc2VsZWN0b3IuZWxlbWVudCA9IGVsZW1lbnQuZWxlbWVudFxuICAgICAgZWxlbWVudC5jaGlsZHJlbltuYW1lXSA9IHNlbGVjdG9yXG4gICAgfSksXG4gICAgZnJhZ21lbnRzOiBuZXcgQ2FjaGVFeHRlbnNpb24oZnVuY3Rpb24gKHByb3RvdHlwZSwgbmFtZSwgZnJhZ21lbnQpIHtcbiAgICAgIGlmICghKGZyYWdtZW50IGluc3RhbmNlb2YgRnJhZ21lbnQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnJhZ21lbnQoZnJhZ21lbnQpXG4gICAgICB9XG4gICAgICByZXR1cm4gZnJhZ21lbnRcbiAgICB9KVxuICB9LFxuICBjaGlsZHJlbjoge30sXG4gIGxheW91dDoge30sXG4gIGV2ZW50czoge30sXG4gIGF0dHJpYnV0ZXM6IHt9LFxuICBmcmFnbWVudHM6IHt9LFxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gRWxlbWVudChlbGVtZW50KSB7XG4gICAgVmlldy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgRWxlbWVudC5pbml0aWFsaXplKHRoaXMpXG4gIH0sXG4gIHByb3RvdHlwZToge1xuICAgIG5hbWU6IFwiXCJcbiAgfVxufSlcbiIsInZhciBkZWxlZ2F0ZSA9IHJlcXVpcmUoXCIuLi9kb20vZGVsZWdhdGVcIilcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudFxuXG5mdW5jdGlvbiBFdmVudCAoZXZlbnQpIHtcbiAgZXZlbnQgPSBldmVudCB8fCB7fVxuICB0aGlzLnR5cGUgPSBldmVudC50eXBlXG4gIHRoaXMudGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG4gIHRoaXMub25jZSA9ICEhZXZlbnQub25jZVxuICB0aGlzLmNhcHR1cmUgPSAhIWV2ZW50LmNhcHR1cmVcbiAgdGhpcy5oYW5kbGVyID0gZXZlbnQuaGFuZGxlclxuICB0aGlzLnByb3h5ID0gZXZlbnQuaGFuZGxlclxuICBpZiAoZXZlbnQudHJhbnNmb3JtICkgdGhpcy50cmFuc2Zvcm0gPSBldmVudC50cmFuc2Zvcm1cbn1cblxuRXZlbnQucHJvdG90eXBlLnRyYW5zZm9ybSA9IGZ1bmN0aW9uICgpIHt9XG5cbkV2ZW50LnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb250ZXh0KSB7XG4gIGlmICh0aGlzLnRhcmdldCkge1xuICAgIHRoaXMucHJveHkgPSBkZWxlZ2F0ZSh7XG4gICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgZXZlbnQ6IHRoaXMuZXZlbnQsXG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgdHJhbnNmb3JtOiB0aGlzLnRyYW5zZm9ybVxuICAgIH0pXG4gICAgdGhpcy5wcm94eS5tYXRjaCh0aGlzLnRhcmdldCwgdGhpcy5oYW5kbGVyKVxuICB9XG4gIGVsc2Uge1xuICAgIGlmICh0aGlzLm9uY2UpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5jYXB0dXJlKVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5jYXB0dXJlKVxuICAgIH1cbiAgfVxufVxuXG5FdmVudC5wcm90b3R5cGUudW5SZWdpc3RlciA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIGlmICh0aGlzLnByb3h5KSB7XG4gICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy5wcm94eSwgdGhpcy5jYXB0dXJlKVxuICB9XG4gIGVsc2Uge1xuICAgIGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMuaGFuZGxlciwgdGhpcy5jYXB0dXJlKVxuICB9XG59XG4iLCJ2YXIgZm9ySW4gPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvaW5cIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9FeHRlbnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBJbnN0YW5jZUV4dGVuc2lvblxuXG5mdW5jdGlvbiBJbnN0YW5jZUV4dGVuc2lvbiAoaW5pdGlhbGl6ZSkge1xuICBFeHRlbnNpb24uY2FsbCh0aGlzLCB7XG4gICAgdHlwZTogXCJpbnN0YW5jZVwiLFxuICAgIGluaGVyaXQ6IHRydWUsXG4gICAgaW5pdGlhbGl6ZTogaW5pdGlhbGl6ZVxuICB9KVxufVxuXG5pbmhlcml0KEluc3RhbmNlRXh0ZW5zaW9uLCBFeHRlbnNpb24pXG5cbi8vSW5zdGFuY2VFeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBpbnN0YW5jZSwgYmxvY2sgKXtcbi8vICB2YXIgaW5pdGlhbGl6ZSA9IHRoaXMuaW5pdGlhbGl6ZVxuLy8gIGZvckluKGJsb2NrLCBmdW5jdGlvbiggbmFtZSwgdmFsdWUgKXtcbi8vICAgIGluaXRpYWxpemUoaW5zdGFuY2UsIG5hbWUsIHZhbHVlLCBibG9jaylcbi8vICB9KVxuLy99XG4iLCJ2YXIgZm9ySW4gPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvaW5cIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9pbmhlcml0XCIpXG52YXIgRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vLi4vZmFjdG9yeS9FeHRlbnNpb25cIilcblxubW9kdWxlLmV4cG9ydHMgPSBQcm90b3R5cGVFeHRlbnNpb25cblxuZnVuY3Rpb24gUHJvdG90eXBlRXh0ZW5zaW9uIChpbml0aWFsaXplKSB7XG4gIEV4dGVuc2lvbi5jYWxsKHRoaXMsIHtcbiAgICB0eXBlOiBcInByb3RvdHlwZVwiLFxuICAgIGluaGVyaXQ6IGZhbHNlLFxuICAgIGluaXRpYWxpemU6IGluaXRpYWxpemVcbiAgfSlcbn1cblxuaW5oZXJpdChQcm90b3R5cGVFeHRlbnNpb24sIEV4dGVuc2lvbilcblxuLy9Qcm90b3R5cGVFeHRlbnNpb24ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uKCBwcm90b3R5cGUsIGJsb2NrICl7XG4vLyAgdmFyIGluaXRpYWxpemUgPSB0aGlzLmluaXRpYWxpemVcbi8vICBmb3JJbihibG9jaywgZnVuY3Rpb24oIG5hbWUsIHZhbHVlICl7XG4vLyAgICBpbml0aWFsaXplKHByb3RvdHlwZSwgbmFtZSwgdmFsdWUsIGJsb2NrKVxuLy8gIH0pXG4vL31cbiIsInZhciBkZWZhdWx0cyA9IHJlcXVpcmUoXCJtYXRjaGJveC11dGlsL29iamVjdC9kZWZhdWx0c1wiKVxudmFyIFZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpXG52YXIgU2VsZWN0b3IgPSByZXF1aXJlKFwiLi4vZG9tL1NlbGVjdG9yXCIpXG52YXIgSW5zdGFuY2VFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9JbnN0YW5jZUV4dGVuc2lvblwiKVxuXG52YXIgUmVnaW9uID0gbW9kdWxlLmV4cG9ydHMgPSBWaWV3LmV4dGVuZCh7XG4gIGV4dGVuc2lvbnM6IHtcbiAgICBjaGlsZHJlbjogbmV3IEluc3RhbmNlRXh0ZW5zaW9uKGZ1bmN0aW9uKHJlZ2lvbiwgbmFtZSwgc2VsZWN0b3Ipe1xuICAgICAgc2VsZWN0b3IgPSBuZXcgU2VsZWN0b3IoZGVmYXVsdHMoc2VsZWN0b3IsIHtcbiAgICAgICAgYXR0cmlidXRlOiBcImRhdGEtZWxlbWVudFwiLFxuICAgICAgICBvcGVyYXRvcjogXCJ+XCIsXG4gICAgICAgIHZhbHVlOiBuYW1lXG4gICAgICB9KSlcbiAgICAgIHNlbGVjdG9yLmVsZW1lbnQgPSByZWdpb24uZWxlbWVudFxuICAgICAgcmVnaW9uLmNoaWxkcmVuW25hbWVdID0gc2VsZWN0b3JcbiAgICB9KVxuICB9LFxuICBjaGlsZHJlbjoge30sXG4gIGxheW91dHM6IHt9LFxuICBldmVudHM6IHt9LFxuICBhdHRyaWJ1dGVzOiB7XG4gICAgdmlzaWJsZTogZmFsc2UsXG4gICAgZm9jdXNlZDogZmFsc2VcbiAgfSxcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIFJlZ2lvbihlbGVtZW50KSB7XG4gICAgVmlldy5jYWxsKHRoaXMsIGVsZW1lbnQpXG4gICAgUmVnaW9uLmluaXRpYWxpemUodGhpcylcbiAgfSxcbiAgcHJvdG90eXBlOiB7XG4gICAgbmFtZTogXCJcIlxuICB9XG59KVxuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZShcIm1hdGNoYm94LXV0aWwvb2JqZWN0L2RlZmF1bHRzXCIpXG52YXIgVmlldyA9IHJlcXVpcmUoXCIuL1ZpZXdcIilcbnZhciBSZWdpb24gPSByZXF1aXJlKFwiLi9SZWdpb25cIilcbnZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuLi9kb20vU2VsZWN0b3JcIilcbnZhciBpbmhlcml0ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnkvaW5oZXJpdFwiKVxudmFyIEluc3RhbmNlRXh0ZW5zaW9uID0gcmVxdWlyZShcIi4vSW5zdGFuY2VFeHRlbnNpb25cIilcblxudmFyIFNjcmVlbiA9IG1vZHVsZS5leHBvcnRzID0gVmlldy5leHRlbmQoe1xuICBleHRlbnNpb25zOiB7XG4gICAgcmVnaW9uczogbmV3IEluc3RhbmNlRXh0ZW5zaW9uKGZ1bmN0aW9uIChzY3JlZW4sIG5hbWUsIHNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IG5ldyBTZWxlY3RvcihkZWZhdWx0cyhzZWxlY3Rvciwge1xuICAgICAgICBhdHRyaWJ1dGU6IFwiZGF0YS1yZWdpb25cIixcbiAgICAgICAgb3BlcmF0b3I6IFwiPVwiLFxuICAgICAgICB2YWx1ZTogbmFtZSxcbiAgICAgICAgQ29uc3RydWN0b3I6IFJlZ2lvblxuICAgICAgfSkpXG4gICAgICBzZWxlY3Rvci5lbGVtZW50ID0gc2NyZWVuLmVsZW1lbnRcbiAgICAgIHNjcmVlbi5yZWdpb25zW25hbWVdID0gc2VsZWN0b3JcbiAgICB9KVxuICB9LFxuICByZWdpb25zOiB7fSxcbiAgbGF5b3V0OiB7fSxcbiAgZXZlbnRzOiB7fSxcbiAgYXR0cmlidXRlczoge30sXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBTY3JlZW4oZWxlbWVudCkge1xuICAgIGVsZW1lbnQgPSBlbGVtZW50IHx8IGRvY3VtZW50LmJvZHlcbiAgICBlbGVtZW50ID0gdGhpcy5zZWxlY3Rvci5zZWxlY3QoZWxlbWVudClcbiAgICBWaWV3LmNhbGwodGhpcywgZWxlbWVudClcbiAgICB0aGlzLnJlZ2lvbnMgPSB7fVxuICAgIFNjcmVlbi5pbml0aWFsaXplKHRoaXMpXG4gIH0sXG4gIHByb3RvdHlwZToge1xuICAgIHNlbGVjdG9yOiBuZXcgU2VsZWN0b3Ioe2F0dHJpYnV0ZTogXCJkYXRhLXNjcmVlblwifSlcbiAgfVxufSlcbiIsInZhciBkZWZpbmUgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmaW5lXCIpXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKFwibWF0Y2hib3gtdXRpbC9vYmplY3QvZGVmYXVsdHNcIilcbnZhciBmYWN0b3J5ID0gcmVxdWlyZShcIi4uL2ZhY3RvcnlcIilcbnZhciBFdmVudCA9IHJlcXVpcmUoXCIuL0V2ZW50XCIpXG52YXIgQXR0cmlidXRlID0gcmVxdWlyZShcIi4uL2RvbS9Eb21BdHRyaWJ1dGVcIilcbnZhciBQcm90b3R5cGVFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9Qcm90b3R5cGVFeHRlbnNpb25cIilcbnZhciBJbnN0YW5jZUV4dGVuc2lvbiA9IHJlcXVpcmUoXCIuL0luc3RhbmNlRXh0ZW5zaW9uXCIpXG52YXIgQ2FjaGVFeHRlbnNpb24gPSByZXF1aXJlKFwiLi9DYWNoZUV4dGVuc2lvblwiKVxuXG52YXIgVmlldyA9IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSh7XG4gICdzdGF0aWMnOiB7fSxcblxuICBleHRlbnNpb25zOiB7XG4gICAgbGF5b3V0czogbmV3IENhY2hlRXh0ZW5zaW9uKGZ1bmN0aW9uIChwcm90b3R5cGUsIG5hbWUsIGxheW91dEhhbmRsZXIpIHtcbiAgICAgIHJldHVybiBsYXlvdXRIYW5kbGVyXG4gICAgfSksXG4gICAgZXZlbnRzOiBuZXcgSW5zdGFuY2VFeHRlbnNpb24oZnVuY3Rpb24gKHZpZXcsIG5hbWUsIGV2ZW50KSB7XG4gICAgICBpZiAoIShldmVudCBpbnN0YW5jZW9mIEV2ZW50KSkge1xuICAgICAgICBldmVudCA9IG5ldyBFdmVudChldmVudClcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZXZlbnQuaGFuZGxlciA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGV2ZW50LmhhbmRsZXIgPSB2aWV3W2V2ZW50LmhhbmRsZXJdLmJpbmQodmlldylcbiAgICAgIH1cbiAgICAgIGV2ZW50LnJlZ2lzdGVyKHZpZXcuZWxlbWVudCwgdGhpcylcbiAgICB9KSxcbiAgICBhdHRyaWJ1dGVzOiBuZXcgUHJvdG90eXBlRXh0ZW5zaW9uKGZ1bmN0aW9uIChwcm90b3R5cGUsIG5hbWUsIGF0dHJpYnV0ZSkge1xuICAgICAgaWYgKCEoYXR0cmlidXRlIGluc3RhbmNlb2YgQXR0cmlidXRlKSkge1xuICAgICAgICBhdHRyaWJ1dGUgPSBuZXcgQXR0cmlidXRlKGF0dHJpYnV0ZSlcbiAgICAgIH1cblxuICAgICAgZGVmaW5lLmFjY2Vzc29yKHByb3RvdHlwZSwgbmFtZSwgZ2V0dGVyLCBzZXR0ZXIpXG4gICAgICBmdW5jdGlvbiBnZXR0ZXIgKCkge1xuICAgICAgICByZXR1cm4gYXR0cmlidXRlLmdldCh0aGlzLmVsZW1lbnQpXG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBzZXR0ZXIgKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGUuc2V0KHRoaXMuZWxlbWVudCwgdmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcblxuICBsYXlvdXRzOiB7XG4gICAgJ2RlZmF1bHQnOiBmdW5jdGlvbiAoKSB7XG5cbiAgICB9XG4gIH0sXG4gIGV2ZW50czoge30sXG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBkdW1teTogZmFsc2VcbiAgfSxcblxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gVmlldyggZWxlbWVudCApe1xuICAgIHRoaXMuY3VycmVudExheW91dCA9IFwiXCJcbiAgICAvL3RoaXMubGF5b3V0cyA9IHt9XG4gICAgdGhpcy5jaGlsZHJlbiA9IHt9XG4gICAgdGhpcy5fZWxlbWVudCA9IG51bGxcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgVmlldy5pbml0aWFsaXplKHRoaXMpXG4gIH0sXG5cbiAgYWNjZXNzb3I6IHtcbiAgICBlbGVtZW50OiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX2VsZW1lbnRcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgICAgICAgdGhpcy5vbkVsZW1lbnRDaGFuZ2UoZWxlbWVudCwgcHJldmlvdXMpXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHByb3RvdHlwZToge1xuICAgIG9uRWxlbWVudENoYW5nZTogZnVuY3Rpb24gKGVsZW1lbnQsIHByZXZpb3VzKSB7fSxcbiAgICBvbkxheW91dENoYW5nZTogZnVuY3Rpb24gKGxheW91dCwgcHJldmlvdXMpIHt9LFxuICAgIGxheW91dDogZnVuY3Rpb24oIGxheW91dCApe1xuICAgICAgaWYgKHRoaXMuY3VycmVudExheW91dCA9PSBsYXlvdXQpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICB9XG5cbiAgICAgIHZhciBsYXlvdXRIYW5kbGVyID0gdGhpcy5sYXlvdXRzW2xheW91dF1cbiAgICAgIGlmICghbGF5b3V0SGFuZGxlcikgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIk1pc3NpbmcgbGF5b3V0IGhhbmRsZXI6IFwiICsgbGF5b3V0KSlcblxuICAgICAgdmFyIHJvbGUgPSB0aGlzXG4gICAgICB2YXIgcHJldmlvdXMgPSByb2xlLmN1cnJlbnRMYXlvdXRcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJldmlvdXMpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbGF5b3V0SGFuZGxlci5jYWxsKHJvbGUsIHByZXZpb3VzKVxuICAgICAgfSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJvbGUuY3VycmVudExheW91dCA9IGxheW91dFxuICAgICAgICByb2xlLm9uTGF5b3V0Q2hhbmdlKGxheW91dCwgcHJldmlvdXMpXG4gICAgICB9KVxuICAgIH0sXG4gICAgZGlzcGF0Y2g6IGZ1bmN0aW9uICh0eXBlLCBkZXRhaWwsIGRlZikge1xuICAgICAgdmFyIGRlZmluaXRpb24gPSBkZWZhdWx0cyhkZWYsIHtcbiAgICAgICAgZGV0YWlsOiBkZXRhaWwgfHwgbnVsbCxcbiAgICAgICAgdmlldzogd2luZG93LFxuICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICBjYW5jZWxhYmxlOiB0cnVlXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyB3aW5kb3cuQ3VzdG9tRXZlbnQodHlwZSwgZGVmaW5pdGlvbikpXG4gICAgfVxuICB9XG59KVxuIiwidmFyIHVpID0gbW9kdWxlLmV4cG9ydHMgPSB7fVxuXG51aS5TY3JlZW4gPSByZXF1aXJlKFwiLi9TY3JlZW5cIilcbnVpLlJlZ2lvbiA9IHJlcXVpcmUoXCIuL1JlZ2lvblwiKVxudWkuRWxlbWVudCA9IHJlcXVpcmUoXCIuL0VsZW1lbnRcIilcbnVpLlZpZXcgPSByZXF1aXJlKFwiLi9WaWV3XCIpXG4iLCJ2YXIgY2FtZWxjYXNlID0gcmVxdWlyZShcImNhbWVsY2FzZVwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEF0dHJpYnV0ZVxuXG5mdW5jdGlvbiBBdHRyaWJ1dGUoIGRlZiApe1xuICB2YXIgdHlwZU9mRGVmID0gdHlwZW9mIGRlZlxuICB2YXIgdHlwZVxuICB2YXIgZGVmYXVsdFZhbHVlXG4gIHZhciBoYXNEZWZhdWx0XG5cbiAgc3dpdGNoKCB0eXBlT2ZEZWYgKXtcbiAgICAvLyBwcmltaXRpdmUgdmFsdWVcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICB0eXBlID0gdHlwZU9mRGVmXG4gICAgICBkZWZhdWx0VmFsdWUgPSBkZWZcbiAgICAgIGhhc0RlZmF1bHQgPSB0cnVlXG4gICAgICBkZWYgPSB7fVxuICAgICAgYnJlYWtcbiAgICAvLyBkZWZpbml0aW9uIG9iamVjdFxuICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICBjYXNlIFwidW5kZWZpbmVkXCI6XG4gICAgZGVmYXVsdDpcbiAgICAgIGRlZiA9IGRlZiB8fCB7fVxuICAgICAgZGVmYXVsdFZhbHVlID0gZGVmW1wiZGVmYXVsdFwiXVxuICAgICAgaGFzRGVmYXVsdCA9IGRlZmF1bHRWYWx1ZSAhPSBudWxsXG5cbiAgICAgIGlmKCB0eXBlb2YgZGVmW1widHlwZVwiXSA9PSBcInVuZGVmaW5lZFwiICl7XG4gICAgICAgIHR5cGUgPSBoYXNEZWZhdWx0ID8gdHlwZW9mIGRlZmF1bHRWYWx1ZSA6IFwic3RyaW5nXCI7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdHlwZSA9IGRlZltcInR5cGVcIl1cbiAgICAgIH1cbiAgfVxuXG4gIHZhciBzaG91bGRSZW1vdmUgPSBmdW5jdGlvbiggdmFsdWUgKXsgcmV0dXJuIHZhbHVlID09IG51bGwgfVxuICB2YXIgcGFyc2VWYWx1ZVxuICB2YXIgc3RyaW5naWZ5VmFsdWVcblxuICBzd2l0Y2goIHR5cGUgKXtcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgc2hvdWxkUmVtb3ZlID0gZnVuY3Rpb24oIHZhbHVlICl7IHJldHVybiB2YWx1ZSA9PT0gZmFsc2UgfVxuICAgICAgcGFyc2VWYWx1ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApeyByZXR1cm4gdmFsdWUgIT0gbnVsbCB9XG4gICAgICBzdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uKCl7IHJldHVybiBcIlwiIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgcGFyc2VWYWx1ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApeyByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiBwYXJzZUludCh2YWx1ZSwgMTApIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSBcImZsb2F0XCI6XG4gICAgICBwYXJzZVZhbHVlID0gZnVuY3Rpb24oIHZhbHVlICl7IHJldHVybiB2YWx1ZSA9PSBudWxsID8gbnVsbCA6IHBhcnNlRmxvYXQodmFsdWUpIH1cbiAgICAgIGJyZWFrXG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgIGRlZmF1bHQ6XG4gICAgICBzdHJpbmdpZnlWYWx1ZSA9IGZ1bmN0aW9uKCB2YWx1ZSApeyByZXR1cm4gdmFsdWUgPT0gbnVsbCA/IG51bGwgOiB2YWx1ZSA/IFwiXCIgKyB2YWx1ZSA6IFwiXCIgfVxuICB9XG5cbiAgdGhpcy50eXBlID0gdHlwZVxuICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZVxuICB0aGlzLnNob3VsZFJlbW92ZSA9IHNob3VsZFJlbW92ZVxuICB0aGlzLmhhc0RlZmF1bHQgPSBoYXNEZWZhdWx0XG4gIHRoaXMucGFyc2VWYWx1ZSA9IHBhcnNlVmFsdWVcbiAgdGhpcy5zdHJpbmdpZnlWYWx1ZSA9IHN0cmluZ2lmeVZhbHVlXG4gIHRoaXMubmFtZSA9IGRlZltcIm5hbWVcIl1cbiAgdGhpcy5nZXR0ZXIgPSBkZWZbXCJnZXRcIl1cbiAgdGhpcy5zZXR0ZXIgPSBkZWZbXCJzZXRcIl1cbiAgdGhpcy5vbmNoYW5nZSA9IGRlZltcIm9uY2hhbmdlXCJdXG59XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZ2V0QXR0cmlidXRlID0gZnVuY3Rpb24oIGNvbnRleHQsIG5hbWUgKXt9XG5BdHRyaWJ1dGUucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKCBjb250ZXh0LCBuYW1lLCB2YWx1ZSApe31cbkF0dHJpYnV0ZS5wcm90b3R5cGUuaGFzQXR0cmlidXRlID0gZnVuY3Rpb24oIGNvbnRleHQsIG5hbWUgKXt9XG5BdHRyaWJ1dGUucHJvdG90eXBlLnJlbW92ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKCBjb250ZXh0LCBuYW1lICl7fVxuXG5BdHRyaWJ1dGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKCBjb250ZXh0LCB1c2VEZWZhdWx0ICl7XG4gIGlmKCB0aGlzLmdldHRlciApe1xuICAgIHJldHVybiB0aGlzLmdldHRlci5jYWxsKGNvbnRleHQpXG4gIH1cblxuICB2YXIgdmFsdWUgPSB0aGlzLmdldEF0dHJpYnV0ZShjb250ZXh0LCB0aGlzLm5hbWUpXG4gIGlmKCB2YWx1ZSA9PSBudWxsICYmIHVzZURlZmF1bHQgPT0gdHJ1ZSApe1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRWYWx1ZVxuICB9XG4gIHJldHVybiB0aGlzLnBhcnNlVmFsdWUgPyB0aGlzLnBhcnNlVmFsdWUodmFsdWUpIDogdmFsdWVcbn1cblxuQXR0cmlidXRlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiggY29udGV4dCwgdmFsdWUsIGNhbGxPbmNoYW5nZSApe1xuICBpZiggdGhpcy5zZXR0ZXIgKXtcbiAgICB0aGlzLnNldHRlci5jYWxsKGNvbnRleHQpXG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgb2xkID0gdGhpcy5nZXQoY29udGV4dCwgZmFsc2UpXG4gIGlmKCB0aGlzLnNob3VsZFJlbW92ZSh2YWx1ZSkgKXtcbiAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShjb250ZXh0LCB0aGlzLm5hbWUpXG4gIH1cbiAgZWxzZSBpZiggb2xkID09PSB2YWx1ZSApe1xuICAgIHJldHVyblxuICB9XG4gIGVsc2Uge1xuICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuc3RyaW5naWZ5VmFsdWUgPyB0aGlzLnN0cmluZ2lmeVZhbHVlKHZhbHVlKSA6IHZhbHVlXG4gICAgdGhpcy5zZXRBdHRyaWJ1dGUoY29udGV4dCwgdGhpcy5uYW1lLCBuZXdWYWx1ZSlcbiAgfVxuICB0aGlzLm9uY2hhbmdlICYmIGNhbGxPbmNoYW5nZSAhPSBmYWxzZSAmJiB0aGlzLm9uY2hhbmdlLmNhbGwoY29udGV4dCwgb2xkLCB2YWx1ZSlcbn1cbiJdfQ==
